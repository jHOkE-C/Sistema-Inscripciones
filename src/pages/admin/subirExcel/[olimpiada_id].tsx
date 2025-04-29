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
import { Olimpiada } from '@/types/versiones.type';
import { Departamento, Colegio, Provincia } from '@/interfaces/ubicacion.interface';
import { AreaConCategorias, Categoria, CategoriaExtendida, grados, CONTACTOS_PERMITIDOS } from '@/interfaces/postulante.interface';
import { ExcelParser } from '@/lib/ExcelParser';
import LoadingAlert from '@/components/loading-alert';
import { ErroresDeFormato } from '@/interfaces/error.interface';
import { ErrorCheckboxRow } from '@/components/ErrorCheckboxRow';
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
    const [colegios, setColegios] = useState<Colegio[]>([]);
    const [departamentosProvincias, setDepartamentosProvincias] = useState<Departamento[]>([]);
    const [categoriasConAreaPorGrado, setCategoriasConAreaPorGrado] = useState<Map<string, CategoriaExtendida[]>>(new Map());

    useEffect(() => {
        getOlimpiada();
        getDatos()
    }, []);

    useEffect(() => {
        if (!loadingOlimpiada) {
            const timer = setTimeout(() => setShowUploadAnimation(true), 100);
            return () => clearTimeout(timer);
        } else {
            setShowUploadAnimation(false);
        }
    }, [loadingOlimpiada]);

    const getDatos = async () => {

        const colResponse = await axios.get(`${API_URL}/api/colegios`);
        setColegios(colResponse.data);
        console.log(colResponse.data);
        const departamentosProvincias = await axios.get(`${API_URL}/api/departamentos/with-provinces`);
        setDepartamentosProvincias(departamentosProvincias.data);
        console.log(departamentosProvincias.data);
        const areasConCategoriasResponse = await axios.get(
            `${API_URL}/api/areas/categorias/olimpiada/${olimpiada_id}`
        );
        const gradosCategoriasResponse = await axios.get(
            `${API_URL}/api/categorias/olimpiada/${olimpiada_id}`
        );
        console.log(areasConCategoriasResponse.data);
        console.log(gradosCategoriasResponse.data);


        const areasConCategoriasData = areasConCategoriasResponse.data as AreaConCategorias[];
        const gradosCategoriasData = gradosCategoriasResponse.data as Categoria[][];
        const areasMap = new Map<string, CategoriaExtendida[]>();

        grados.forEach((grado, index) => {
            const categorias = gradosCategoriasData[index] || [];
            const categoriasConArea: CategoriaExtendida[] = categorias.map(
                (cat) => {
                    const area = areasConCategoriasData.find((a) =>
                        a.categorias.some((c) => c.id === cat.id)
                    );

                    return {
                        ...cat,
                        areaId: area?.id ?? 0,
                        areaNombre: area?.nombre ?? "Desconocida",
                    };
                }
            );
            
            const uniqueCategoriasConArea = categoriasConArea.filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i);
            areasMap.set(grado.id, uniqueCategoriasConArea);
        });
        setCategoriasConAreaPorGrado(areasMap);
        console.log(areasMap);
    }

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
        if (!fileToConfirm) return;
        setIsProcessing(true);
        setErroresDeFormato([]); 
        try {
            const result = await ExcelParser(fileToConfirm);
            const errores = [...result.erroresDeFormato]; 

            const hoja2Data = result.jsonData[1];
            console.log(hoja2Data);
            if (hoja2Data && hoja2Data.length > 1) {
                const departamentosNombres = new Set(departamentosProvincias.map(d => d.nombre.toLocaleLowerCase()));
                const colegiosNombres = new Set(colegios.map(c => c.nombre.toLocaleLowerCase()));
                const gradosNombres = new Set(grados.map(g => g.nombre.toLocaleLowerCase()));
                const pertenencias = new Set(CONTACTOS_PERMITIDOS.map(p => p.contacto.toLocaleLowerCase()));
                const foundDepartamentos = new Set<string>();
                const foundColegios = new Set<string>();
                const foundGrados = new Set<string>();
                const foundPertenenciasSet = new Set<string>();
                const foundCategoriasSet = new Set<string>();
                
                for (let i = 1; i < hoja2Data.length; i++) {
                    const fila = hoja2Data[i];
                    const numeroFilaExcel = i + 1;
                    const departamento = fila[0]?.toString().trim().replace(/_/g, ' ').toLowerCase() || ''; 
                    foundDepartamentos.add(departamento);
                    if (departamento && !departamentosNombres.has(departamento)) {
                        errores.push({
                            fila: numeroFilaExcel,
                            columna: 'Departamento(A)',
                            mensaje: `El departamento "${fila[0]}" no es válido o no se encuentra registrado.`,
                            hoja: 2,
                            campo: 'Departamento'
                        });
                        
                     
                    }
                    const colegio = fila[2]?.toString().trim().toLowerCase() || '';
                    foundColegios.add(colegio);
                    if (colegio && !colegiosNombres.has(colegio)) {
                        errores.push({
                            fila: numeroFilaExcel,
                            columna: 'Colegio(C)', 
                            mensaje: `El colegio "${fila[1]}" no es válido o no se encuentra registrado.`,
                            hoja: 2,
                            campo: 'Colegio'
                        });
                        
                    }
                    const grado = fila[3]
                    if (grado !== null) {
                        const gradoCon = grado?.toString().trim().toLowerCase() || '';
                        foundGrados.add(gradoCon);
                        if (!gradosNombres.has(gradoCon)) {
                            errores.push({
                                fila: numeroFilaExcel,
                                columna: 'Grado(D)',
                                mensaje: `El grado "${gradoCon}" no es válido.`,
                                hoja: 2,
                            campo: 'Grado'
                        });
                        }
                    }
                    const pertenencia = fila[4]?.toString().trim().toLowerCase() || '';
                    foundPertenenciasSet.add(pertenencia);
                    if (pertenencia && !pertenencias.has(pertenencia)) {
                        errores.push({
                            fila: numeroFilaExcel,
                            columna: 'Pertenencia(E)',
                            mensaje: `La pertenencia "${fila[3]}" no es válida.`,
                            hoja: 2,
                            campo: 'Pertenencia'
                        });
                    }
                    for (let j = 6; j < 18; j++) {
                        const categoria = fila[j]
                        if (categoria!==null) {
                            const string = String(j-5)
                            const categoria2 = categoria.trim();
                            foundCategoriasSet.add(categoria2.toLowerCase());
                            const categorias = categoriasConAreaPorGrado.get(string);
                            
                            const existeCategoria = categorias?.some(cat => 
                                `${cat.areaNombre} - ${cat.nombre}`.toLowerCase() ===
                                categoria2.toLowerCase()
                            ) ?? false;
                            if (!existeCategoria) {
                                errores.push({
                                    fila: numeroFilaExcel,
                                    columna: grados[j-6].nombre,
                                    mensaje: `La categoría "${fila[j]}" no es válida.`,
                                    hoja: 2,
                                    campo: categoria
                                });
                                console.log("dcategoria");
                            }
                        }
                    }
                }
                // Verificar datos faltantes en Excel
                const missingDepartamentos = Array.from(departamentosNombres).filter(dep => !foundDepartamentos.has(dep));
                if (missingDepartamentos.length > 0) {
                    errores.push({ 
                        fila: 0, 
                        columna: 'Departamento', 
                        mensaje: `Faltan departamentos en el Excel: ${missingDepartamentos.join(', ')}`, 
                        hoja: 2, 
                        campo: 'Departamento' 
                    });
                }
                const missingColegios = Array.from(colegiosNombres).filter(item => !foundColegios.has(item));
                if (missingColegios.length > 0) {
                    errores.push({ 
                        fila: 0, 
                        columna: 'Colegio', 
                        mensaje: `Faltan colegios en el Excel: ${missingColegios.join(', ')}`, 
                        hoja: 2, 
                        campo: 'Colegio' 
                    });
                }
                const missingGrados = Array.from(gradosNombres).filter(item => !foundGrados.has(item));
                if (missingGrados.length > 0) {
                    errores.push({ 
                        fila: 0, 
                        columna: 'Grado', 
                        mensaje: `Faltan grados en el Excel: ${missingGrados.join(', ')}`, 
                        hoja: 2, 
                        campo: 'Grado' 
                    });
                }
                const missingPertenencias = Array.from(pertenencias).filter(item => !foundPertenenciasSet.has(item));
                if (missingPertenencias.length > 0) {
                    errores.push({ 
                        fila: 0, 
                        columna: 'Pertenencia', 
                        mensaje: `Faltan pertenencias en el Excel: ${missingPertenencias.join(', ')}`, 
                        hoja: 2, 
                        campo: 'Pertenencia' 
                    });
                }
                const expectedCategorias = Array.from(categoriasConAreaPorGrado.values()).flat().map(cat => `${cat.areaNombre} - ${cat.nombre}`.toLowerCase());
                const missingCategorias = expectedCategorias.filter(cat => !foundCategoriasSet.has(cat.toLowerCase()));
                if (missingCategorias.length > 0) {
                    errores.push({ 
                        fila: 0, 
                        columna: 'Categoría', 
                        mensaje: `Faltan categorías en el Excel: ${missingCategorias.join(', ')}`, 
                        hoja: 2, 
                        campo: 'Categoría' 
                    });
                }
            }
            const hoja3Data = result.jsonData[2];
            console.log(hoja3Data);
            if (hoja3Data && hoja3Data.length > 1) {
                const map = new Map<string, Provincia[]>(
                    departamentosProvincias.map(item => [item.nombre.toLocaleLowerCase(), item.provincias])
                );
                const headers = hoja3Data[0];
                const departamentos = [
                    {columna: 'A', nombre: 'Beni'}, 
                    {columna: 'B', nombre: 'Chuquisaca'}, 
                    {columna: 'C', nombre: 'Cochabamba'}, 
                    {columna: 'D', nombre: 'La Paz'}, 
                    {columna: 'E', nombre: 'Oruro'}, 
                    {columna: 'F', nombre: 'Pando'}, 
                    {columna: 'G', nombre: 'Potosi'}, 
                    {columna: 'H', nombre: 'Santa Cruz'}, 
                    {columna: 'I', nombre: 'Tarija'}
                ];
                let noHayUnDepartamento = false;
                for (let i = 0; i < headers.length; i++) {
                    const header = headers[i];
                    const departamentoNombre = header?.toLocaleLowerCase();
                    if (!departamentos.some(departamento => departamento.nombre.toLocaleLowerCase() === departamentoNombre)) {
                        errores.push({ 
                            fila: 0, 
                            columna: departamentos[i].columna, 
                            mensaje: `Departamento no encontrado: ${departamentoNombre}`, 
                            hoja: 3, 
                            campo: "" 
                        });
                        noHayUnDepartamento = true;
                    }
                }
                if(!noHayUnDepartamento){
                    for (let fila = 1; fila < hoja3Data.length; fila++) {
                        const numeroFilaExcel = fila + 1;
                        for (let columna = 0; columna < hoja3Data[fila].length; columna++) {                        
                            const key = departamentos[columna].nombre;
                            console.log(key);
                            const valor = hoja3Data[fila][columna];
                            console.log(valor);
                            const provincia = map.get(key.toLowerCase());
                            if(valor!==null)
                            {
                                const existeProvincia = provincia?.some(prov => 
                                    prov.nombre.toLocaleLowerCase() === valor.toLocaleLowerCase()
                                );
                                console.log(existeProvincia);
                                if (!existeProvincia) {
                                    errores.push({ 
                                        fila: numeroFilaExcel, 
                                        columna: departamentos[columna].columna, 
                                        mensaje: `Provincia ${valor} no encontrada en el departamento ${key} `, 
                                        hoja: 3, 
                                        campo: departamentos[columna].nombre
                                    });
                                }
                            }
                        }

                    }
                }
            }
            setErroresDeFormato(errores);
        } catch (error: any) {
            console.error('Error al procesar el archivo:', error);
            setErroresDeFormato([{ fila: 0, columna: 'General', mensaje: error.message || 'Error desconocido al procesar', hoja: 1, campo: 'General' }]);
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
                        {isProcessing ? (
                            <>
                                <DialogTitle>Procesando archivo</DialogTitle>
                                <DialogDescription>Espere por favor, estamos procesando el archivo...</DialogDescription>
                                <LoadingAlert message="Espere por favor, estamos procesando el archivo..." />
                            </>
                        ) : (
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
                                                <ErrorCheckboxRow
                                                    key={index}
                                                    message={`El campo [${error.columna}] en la fila [${error.fila}] en la hoja [${error.hoja}] tiene el siguiente error: ${error.mensaje}`}
                                                />
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
