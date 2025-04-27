import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from '../../../components/fileUpload';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { API_URL } from "@/hooks/useApiRequest";
import { AlertComponent } from "@/components/AlertComponent";
import Loading from '@/components/Loading';
import ReturnComponent from '@/components/ReturnComponent';
import { useParams } from 'react-router-dom';
import { Olimpiada } from "@/types/versiones.type";
import { parseExcel } from '@/utils/excelParser';
import LoadingAlert from '@/components/loading-alert';
import { ErroresDeFormato } from '@/interfaces/error.interface';
type UploadResponse = {
    message: string;
};
const FileUploadFormato: React.FC = () => {
    const { olimpiada_id } = useParams();
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [fileToConfirm, setFileToConfirm] = useState<File | null>(null);
    const [oldFiles, setOldFiles] = useState<File[]>([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [alertInfo, setAlertInfo] = useState<{ title: string, description: string, variant: "default" | "destructive" } | null>(null);
    const [loadingOlimpiada, setLoadingOlimpiada] = useState<boolean>(true);
    const [errorOlimpiada, setErrorOlimpiada] = useState<string | null>(null);
    const [showUploadAnimation, setShowUploadAnimation] = useState<boolean>(false);
    const [erroresDeFormato, setErroresDeFormato] = useState<ErroresDeFormato[]>([]);
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        getOlimpiada();
    }, []);

    useEffect(() => {
        if (!loadingOlimpiada) {
            const timer = setTimeout(() => setShowUploadAnimation(true), 100);
            return () => clearTimeout(timer);
        } else {
            setShowUploadAnimation(false);
        }
    }, [loadingOlimpiada]);

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

    const getOlimpiada = async () => {
        try {
            const response = await axios.get<Olimpiada>(`${API_URL}/api/olimpiadas/${olimpiada_id}`);
            const olimpiadaDetail = response.data;
            if (olimpiadaDetail.url_plantilla) {
                console.log("url_plantilla", olimpiadaDetail.url_plantilla);
                const fileName = olimpiadaDetail.url_plantilla.split('/').pop() || `plantilla-${olimpiada_id}`;
                const templateFile = new File([], fileName);
                const templateFileWithUrl = templateFile as File & { url_plantilla: string };
                templateFileWithUrl.url_plantilla = olimpiadaDetail.url_plantilla;
                setOldFiles([templateFile]);
                console.log("oldFiles", oldFiles);
            }
        } catch (err) {
            console.error("Error al obtener la plantilla de la olimpiada:", err);
            setErrorOlimpiada("Ocurrió un error al obtener la plantilla de la olimpiada.");
            console.log(errorOlimpiada)
        } finally {
            setLoadingOlimpiada(false);
        }
    };

    const handleOpenConfirmDialog = () => {
        if (fileToConfirm) {
            setShowConfirmDialog(true);
        }
        handleProcesar();
    };

    const handleCancelSelection = () => {
        const vacio: File[] = [];
        setUploadedFiles([...vacio]);
        setFileToConfirm(null);
        setShowConfirmDialog(false);
        setAlertInfo(null);
    };

    const handleConfirmUpload = async () => {
        if (!fileToConfirm) return;

        setIsProcessing(true);
        setAlertInfo(null);

        try {
            const base64String = await readFileAsBase64(fileToConfirm);
            const payload = {
                olimpiadaId: Number(olimpiada_id),
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

    const handleProcesar = async () => {
        if (uploadedFiles.length === 0) return;
        const selectedFile = uploadedFiles[0];
        console.log('Archivo seleccionado:', selectedFile.name, selectedFile.type);
        setIsProcessing(true);
        await sleep(1000);
        try {
            const { jsonData, erroresDeFormato } = await parseExcel(selectedFile);
            setErroresDeFormato(erroresDeFormato);
            console.log(jsonData)
        } catch (error) {
            console.error('Error al procesar el archivo:', error);
            setAlertInfo({
                title: "Error",
                description: "Ocurrió un error al procesar el archivo."+error,
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };
    if (loadingOlimpiada) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col items-center min-h-screen p-4">
            <div className="w-full">
                <ReturnComponent to="/admin/subirExcel" />
            </div>
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
                <div
                    className="overflow-hidden transition-all duration-1000 ease-in-out"
                    style={{
                        maxHeight: showUploadAnimation ? '500px' : '0px',
                        opacity: showUploadAnimation ? 1 : 0,
                    }}
                >
                    <div className="pt-4">
                        <label className="block text-sm font-medium text-muted-foreground">
                            Sube el archivo Excel (.xlsx o .xls)
                        </label>
                        <FileUpload
                            key={olimpiada_id + (uploadedFiles.length === 0 ? '-reset' : '')}
                            maxFiles={1}
                            maxSize={10}
                            accept=".xlsx,.xls"
                            onFilesChange={handleFilesChange}
                            filesRefresh={uploadedFiles}
                            oldFiles={oldFiles}
                        />
                        <div className="flex justify-end gap-2 mt-3">
                            <Button variant="outline" size="sm" onClick={handleCancelSelection}>
                                Cancelar
                            </Button>
                            <Button
                                disabled={!fileToConfirm}
                                size="sm" onClick={handleOpenConfirmDialog}>
                                Subir Archivo
                            </Button>
                        </div>
                    </div>
                </div>
                <Dialog open={showConfirmDialog} onOpenChange={handleDialogClose}>
                    <DialogContent className="h-auto gap-2">
                        {isProcessing ?
                            <LoadingAlert message="Espere por favor, estamos procesando el archivo..." />
                            : (
                                <>
                                    <DialogTitle>
                                        {erroresDeFormato.length > 0
                                            ? "Errores de formato"
                                            : "El archivo es válido"}
                                    </DialogTitle>
                                    {erroresDeFormato.length > 0 ? (
                                        <div className="">
                                            <DialogDescription>
                                                Se encontraron errores en el archivo.
                                                puede usar los checkbox para marcar los errores que vas corrigiendo.
                                            </DialogDescription>

                                            <div className="max-h-96 overflow-y-auto space-y-2">
                                                {erroresDeFormato.map((error, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between text-sm mb-2 text-red-500 transition-all duration-200"
                                                    >
                                                        <div className="error-text border-1 p-2 rounded-md">
                                                            {`El campo [${error.columna}] en la fila [${error.fila}] en la hoja [${error.hoja}] tiene el siguiente error: ${error.mensaje}`}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            className="h-4 w-4 cursor-pointer ml-2"
                                                            onChange={(e) => {
                                                                const parentDiv =
                                                                    e.currentTarget.closest("div");
                                                                const textElement =
                                                                    parentDiv?.querySelector(".error-text");

                                                                if (e.currentTarget.checked) {
                                                                    parentDiv?.classList.remove("text-red-500");
                                                                    parentDiv?.classList.add("text-zinc-400");
                                                                    textElement?.classList.add("line-through");
                                                                } else {
                                                                    parentDiv?.classList.remove("text-zinc-400");
                                                                    parentDiv?.classList.add("text-red-500");
                                                                    textElement?.classList.remove("line-through");
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <DialogFooter className="mt-4">
                                                <Button onClick={() => handleDialogClose(false)}>
                                                    Cerrar
                                                </Button>
                                            </DialogFooter>
                                        </div>
                                    ) : (
                                        <>
                                            <DialogDescription>
                                                ¿Estás seguro de que deseas subir y procesar el archivo "{fileToConfirm?.name}" para la olimpiada seleccionada?
                                            </DialogDescription>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline" disabled={isProcessing}>Cancelar</Button>
                                                </DialogClose>
                                                <Button onClick={handleConfirmUpload} disabled={isProcessing}>
                                                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                    {isProcessing ? "Procesando..." : "Confirmar y Subir"}
                                                </Button>
                                            </DialogFooter>
                                        </>
                                    )}
                                </>
                            )}
                    </DialogContent>
                </Dialog>
            </div>
        </div >
    );
};

export default FileUploadFormato;
