import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from '../../../components/fileUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { API_URL } from "@/hooks/useApiRequest";
import { AlertComponent } from "@/components/AlertComponent";
import Loading from '@/components/Loading';

type Olimpiada = {
    id: number;
    nombre: string;
    gestion: string;
    fecha_inicio: string;
    fecha_fin: string;
    vigente: boolean;
    url_plantilla: string;
};

type UploadResponse = {
    message: string;
};

const FileUploadFormato: React.FC = () => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [fileToConfirm, setFileToConfirm] = useState<File | null>(null);
    const [olimpiadas, setOlimpiadas] = useState<Olimpiada[]>([]);
    const [selectedOlimpiada, setSelectedOlimpiada] = useState<string | null>(null);
    const [loadingOlimpiadas, setLoadingOlimpiadas] = useState<boolean>(true);
    const [errorOlimpiadas, setErrorOlimpiadas] = useState<string | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [alertInfo, setAlertInfo] = useState<{ title: string, description: string, variant: "default" | "destructive" } | null>(null);

    useEffect(() => {
        const fetchOlimpiadas = async () => {
            try {
                setLoadingOlimpiadas(true);
                setErrorOlimpiadas(null);
                const response = await axios.get<Olimpiada[]>(`${API_URL}/api/olimpiadas/hoy`);
                setOlimpiadas(response.data);
            } catch (err) {
                console.error("Error al obtener las olimpiadas:", err);
                setErrorOlimpiadas("No se pudieron cargar las olimpiadas. Inténtalo de nuevo más tarde.");
            } finally {
                setLoadingOlimpiadas(false);
            }
        };

        fetchOlimpiadas();
    }, []);

    const handleFilesChange = (files: File[]) => {
        if (files.length > 0) {
            setFileToConfirm(files[0]);
            setUploadedFiles(files);
            setAlertInfo(null);
        } else {
            setFileToConfirm(null);
            setUploadedFiles([]);
        }
    };

    const handleOlimpiadaChange = async (value: string) => {
        setSelectedOlimpiada(value);
        handleCancelSelection();
        try {
            const response = await axios.get<Olimpiada>(`${API_URL}/api/olimpiadas/${value}`);
            const olimpiadaDetail = response.data;
            if (olimpiadaDetail.url_plantilla) {
                const fileName = olimpiadaDetail.url_plantilla.split('/').pop() || `plantilla-${value}`;
                const templateFile = new File([], fileName);
                const templateFileWithUrl = templateFile as File & { url_plantilla: string };
                templateFileWithUrl.url_plantilla = olimpiadaDetail.url_plantilla;
                setUploadedFiles([templateFile]);
                setFileToConfirm(templateFile);
            }
        } catch (err) {
            console.error("Error al obtener la plantilla de la olimpiada:", err);
        }
    };

    const handleOpenConfirmDialog = () => {
        if (fileToConfirm) {
            setShowConfirmDialog(true);
        }
    };

    const handleCancelSelection = () => {
        const vacio: File[] = [];
        setUploadedFiles([...vacio]);
        setFileToConfirm(null);
        setShowConfirmDialog(false);
        setAlertInfo(null);
    };

    const handleConfirmUpload = async () => {
        if (!fileToConfirm || !selectedOlimpiada) return;

        setIsProcessing(true);
        setAlertInfo(null);

        try {
            const base64String = await readFileAsBase64(fileToConfirm);
            const payload = {
                olimpiadaId: Number(selectedOlimpiada),
                fileName: fileToConfirm.name,
                fileContentBase64: base64String,
            };
            console.log("payload", payload);
            const response = await axios.post<UploadResponse>(`${API_URL}/api/olimpiadas/upload-excel`, payload);

            console.log("Respuesta del servidor:", response.data);
            setAlertInfo({
                title: "Éxito",
                description: response.data.message || "Archivo subido y procesado correctamente.",
                variant: "default",
            });
            setShowConfirmDialog(false);
            setFileToConfirm(null);
        } catch (err) {
            console.error("Error al procesar o subir el archivo:", err);
            let errorMessage = "Ocurrió un error al procesar o subir el archivo.";
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            setAlertInfo({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const readFileAsBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    const base64Part = reader.result.split(',')[1];
                    resolve(base64Part);
                } else {
                    reject(new Error("No se pudo leer el archivo como string Base64."));
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleDialogClose = (open: boolean) => {
        setShowConfirmDialog(open);
    }
    if (loadingOlimpiadas) {
        return <Loading />;
    }
    return (

        <div className="w-full max-w-lg p-6 border rounded-lg shadow-md bg-card text-card-foreground space-y-5">
            <h2 className="text-xl font-semibold text-center">Cargar Archivo de Formato</h2>

            {alertInfo && (
                <AlertComponent
                    title={alertInfo.title}
                    description={alertInfo.description}
                    variant={alertInfo.variant}
                    onClose={() => setAlertInfo(null)}
                />
            )}

            <div>
                <label htmlFor="olimpiada-select" className="block text-sm font-medium text-muted-foreground mb-1">
                    1. Selecciona la Olimpiada
                </label>
                {loadingOlimpiadas ? (
                    <div className="h-9 flex items-center text-sm text-muted-foreground">Cargando olimpiadas...</div>
                ) : errorOlimpiadas ? (
                    <p className="text-sm text-red-500">{errorOlimpiadas}</p>
                ) : (
                    <Select onValueChange={handleOlimpiadaChange} value={selectedOlimpiada ?? undefined}>
                        <SelectTrigger id="olimpiada-select" className="w-full">
                            <SelectValue placeholder="-- Elige una olimpiada --" />
                        </SelectTrigger>
                        <SelectContent>
                            {olimpiadas.length > 0 ? (
                                olimpiadas.map((olimpiada) => (
                                    <SelectItem key={olimpiada.id} value={olimpiada.id.toString()}>
                                        {olimpiada.nombre}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="p-2 text-sm text-muted-foreground">No hay olimpiadas disponibles.</div>
                            )}
                        </SelectContent>
                    </Select>
                )}
            </div>

            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${selectedOlimpiada || uploadedFiles.length > 0 ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                style={{ maxHeight: selectedOlimpiada || uploadedFiles.length > 0 ? '500px' : '0px' }}
            >
                {selectedOlimpiada && (
                    <div className="pt-4">
                        <label className="block text-sm font-medium text-muted-foreground">
                            2. Sube el archivo Excel (.xlsx o .xls)
                        </label>
                        <FileUpload
                            key={selectedOlimpiada + (uploadedFiles.length === 0 ? '-reset' : '')}
                            maxFiles={1}
                            maxSize={10}
                            accept=".xlsx,.xls"
                            onFilesChange={handleFilesChange}
                            filesRefresh={uploadedFiles}
                        />
                        <div className="flex justify-end gap-2 mt-3">
                            <Button variant="outline" size="sm" onClick={handleCancelSelection}>
                                Cancelar
                            </Button>
                            <Button
                                disabled={!fileToConfirm}
                                size="sm" onClick={() => handleOpenConfirmDialog()}>
                                Subir Archivo
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={showConfirmDialog} onOpenChange={handleDialogClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Subida</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas subir y procesar el archivo "{fileToConfirm?.name}" para la olimpiada seleccionada?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isProcessing}>Cancelar</Button>
                        </DialogClose>
                        <Button onClick={handleConfirmUpload} disabled={isProcessing}>
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isProcessing ? "Procesando..." : "Confirmar y Subir"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

    );
};

export default FileUploadFormato;
