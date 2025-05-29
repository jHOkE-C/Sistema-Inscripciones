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
import { toast } from "sonner";
import { getDepartamentosWithProvinces, getColegios } from "@/api/ubicacion";
import { getAreasConCategorias, getCategoriasOlimpiada } from "@/api/categorias";
import { uploadExcelOlimpiada } from "@/api/excel";
import { useParams } from 'react-router-dom';
import { Olimpiada } from '@/types/versiones.type';
import { Departamento, Colegio, excelCol, Provincia } from '@/interfaces/ubicacion.interface';
import { CategoriaExtendida, grados, CONTACTOS_PERMITIDOS } from '@/interfaces/postulante.interface';
import { ExcelParser } from '@/lib/ExcelParser';
import LoadingAlert from '@/components/loading-alert';
import { ErroresDeFormato } from '@/interfaces/error.interface';
import { ErrorCheckboxRow } from '@/components/ErrorCheckboxRow';
import ReturnComponent from '@/components/ReturnComponent';
import Loading from '@/components/Loading';

const FileUploadFormato: React.FC = () => {
    const { olimpiada_id } = useParams();
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [fileToConfirm, setFileToConfirm] = useState<File | null>(null);
    const [oldFiles, setOldFiles] = useState<File[]>([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    // const [alertInfo, setAlertInfo] = useState<{ title: string, description: string, variant: "default" | "destructive" } | null>(null); // Eliminado
    const [loadingOlimpiada, setLoadingOlimpiada] = useState<boolean>(true);
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
        try {
            const colegiosData = await getColegios();
            setColegios(colegiosData);
            const departamentosProvinciasData = await getDepartamentosWithProvinces();
            setDepartamentosProvincias(departamentosProvinciasData)
            const areasConCategoriasData = await getAreasConCategorias(Number(olimpiada_id));
            const gradosCategoriasData = await getCategoriasOlimpiada(Number(olimpiada_id));
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
        } catch (error) {
            console.error("Error al cargar datos:", error);
            toast.error("Error al cargar datos."+error);
        }
    }

    const handleFilesChange = (files: File[]) => {
        if (files.length > 0) {
            setFileToConfirm(files[0]);
            setUploadedFiles(files);
            
        } else {
            setFileToConfirm(null);
            setUploadedFiles([]);
        }
    };

    const getOlimpiada = async () => {
        try {
            //recordatorio 
            const response = await axios.get<Olimpiada>(`${API_URL}/api/olimpiadas/${olimpiada_id}`);
            const olimpiadaDetail = response.data;
            if (olimpiadaDetail.url_plantilla) {
                const fileName = olimpiadaDetail.url_plantilla.split('/').pop() || `plantilla-${olimpiada_id}`;
                const templateFile = new File([], fileName);
                const templateFileWithUrl = templateFile as File & { url_plantilla: string };
                templateFileWithUrl.url_plantilla = olimpiadaDetail.url_plantilla;
                setOldFiles([templateFile]);
            }
        } catch (err) {
            console.error("Error al obtener la plantilla de la olimpiada:", err);
            toast.error("Error al obtener la plantilla de la olimpiada.");
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
    };

    const handleConfirmUpload = async () => {
        if (!fileToConfirm) return;
        setIsProcessing(true);
        try {
            const base64String = await readFileAsBase64(fileToConfirm);
            const response = await uploadExcelOlimpiada(
                Number(olimpiada_id),
                fileToConfirm.name,
                base64String
            );
            toast.success(response.message || "Archivo subido y procesado correctamente."); 
            setShowConfirmDialog(false);
            setFileToConfirm(null);
        } catch (err: unknown) {
            let errorMessage = "Error al procesar o subir el archivo.";
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            else {
                errorMessage = "Error Desconocido al procesar el archivo";
            }
            toast.error(errorMessage); 
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
            if (hoja2Data && hoja2Data.length > 1) {
                const departamentosNombres = new Set(departamentosProvincias.map(d => d.nombre.toLocaleLowerCase()));
                const colegiosNombres = new Set(colegios.map(c => c.nombre.toLocaleLowerCase()));
                const gradosNombres = new Set(grados.map(g => g.nombre.toLocaleLowerCase()));
                const pertenencias = new Set(CONTACTOS_PERMITIDOS.map(p => p.contacto.toLocaleLowerCase()));
                const foundDepartamentos = new Set<string>();
                const foundColegios = new Set<string>();
                const foundGrados = new Set<string>();
                const foundPertenenciasSet = new Set<string>();
                const foundCategoriasSet: Map<string, string[]> = new Map<string, string[]>();
                grados.forEach(g => foundCategoriasSet.set(g.id, []));

                //recordatorio, posible mejora para hacer una busqueda de A hasta Z  y guardar la posicion encontrada de cada header
                //para luego hacer la validacion y no tener que hacerlo fijo, que aqui es algo medio que si serviria no como en postulante y su header 
                const headers = [
                    { columna: 'A', header: "Departamentos", position: 0 },
                    { columna: 'C', header: "Colegios", position: 2 },
                    { columna: 'D', header: "Grados", position: 3 },
                    { columna: 'E', header: "Pertenencias", position: 4 },
                    { columna: 'G', header: "1ro Primaria", position: 6 },
                    { columna: 'H', header: "2do Primaria", position: 7 },
                    { columna: 'I', header: "3ro Primaria", position: 8 },
                    { columna: 'J', header: "4to Primaria", position: 9 },
                    { columna: 'K', header: "5to Primaria", position: 10 },
                    { columna: 'L', header: "6to Primaria", position: 11 },
                    { columna: 'M', header: "1ro Secundaria", position: 12 },
                    { columna: 'N', header: "2do Secundaria", position: 13 },
                    { columna: 'O', header: "3ro Secundaria", position: 14 },
                    { columna: 'P', header: "4to Secundaria", position: 15 },
                    { columna: 'Q', header: "5to Secundaria", position: 16 },
                    { columna: 'R', header: "6to Secundaria", position: 17 }
                ]
                let falta = false;
                for (let i = 0; i < headers.length; i++) {
                    const header = headers[i];
                    const valor = hoja2Data[0][header.position]?.toLowerCase() || '';
                    if (valor !== header.header.toLowerCase()) {
                        errores.push({
                            fila: 0,
                            columna: header.columna,
                            mensaje: `La cabecera"${valor}" esta mal, debe ser: "${header.header}".`,
                            hoja: 2,
                            campo: ''
                        });
                        falta = true;
                    }
                }

                if (!falta) {
                    for (let i = 1; i < hoja2Data.length; i++) {
                        const fila = hoja2Data[i];
                        const numeroFilaExcel = i + 1;
                        const departamento = fila[0]?.toString().trim().replace(/_/g, ' ').toLowerCase() || '';
                        foundDepartamentos.add(departamento);
                        if (departamento && !departamentosNombres.has(departamento)) {
                            errores.push({
                                fila: numeroFilaExcel,
                                columna: 'A',
                                mensaje: `El departamento "${fila[0]}" no es válido para la columna de Departamentos.`,
                                hoja: 2,
                                campo: ''
                            });


                        }
                        const colegio = fila[2]?.toString().trim().toLowerCase() || '';
                        foundColegios.add(colegio);
                        if (colegio && !colegiosNombres.has(colegio)) {
                            errores.push({
                                fila: numeroFilaExcel,
                                columna: 'C',
                                mensaje: `El colegio "${fila[2]}" no es válido para la columna de Colegios.`,
                                hoja: 2,
                                campo: ''
                            });

                        }
                        const grado = fila[3]
                        if (grado !== null) {
                            const gradoCon = grado?.toString().trim().toLowerCase() || '';
                            foundGrados.add(gradoCon);
                            if (!gradosNombres.has(gradoCon)) {
                                errores.push({
                                    fila: numeroFilaExcel,
                                    columna: 'D',
                                    mensaje: `El grado "${gradoCon}" no es válido para la columna de Grados.`,
                                    hoja: 2,
                                    campo: ''
                                });
                            }
                        }
                        const pertenencia = fila[4]?.toString().trim().toLowerCase() || '';
                        foundPertenenciasSet.add(pertenencia);
                        if (pertenencia && !pertenencias.has(pertenencia)) {
                            errores.push({
                                fila: numeroFilaExcel,
                                columna: 'E',
                                mensaje: `La pertenencia "${pertenencia}" no es válida para la columna de Pertenencias.`,
                                hoja: 2,
                                campo: ''
                            });
                        }
                        for (let j = 6; j < 18; j++) {
                            const categoria = fila[j]
                            if (categoria !== null) {
                                const string = String(j - 5)
                                const categoria2 = categoria.trim();
                                const categorias = categoriasConAreaPorGrado.get(string);
                                const existeCategoria = categorias?.some(cat =>
                                    `${cat.areaNombre} - ${cat.nombre}`.toLowerCase() === categoria2.toLowerCase()
                                ) ?? false;
                                if (!existeCategoria) {
                                    errores.push({
                                        fila: numeroFilaExcel,
                                        columna: grados[j - 6].nombre,
                                        mensaje: `La categoría "${fila[j]}" no es válida para la columna de ${grados[j - 6].nombre}.`,
                                        hoja: 2,
                                        campo: ''
                                    });
                                } else {
                                    foundCategoriasSet.get(string)?.push(categoria2.toLowerCase());
                                }
                            }
                        }
                    }

                    const missingDepartamentos = Array.from(departamentosNombres).filter(dep => !foundDepartamentos.has(dep));
                    if (missingDepartamentos.length > 0) {
                        errores.push({
                            fila: 0,
                            columna: 'A',
                            mensaje: `En la columna A, Faltan los departamentos: ${missingDepartamentos.join(', ')}`,
                            hoja: 2,
                            campo: ''
                        });
                    }
                    const missingColegios = Array.from(colegiosNombres).filter(item => !foundColegios.has(item));
                    if (missingColegios.length > 0) {
                        errores.push({
                            fila: 0,
                            columna: 'C',
                            mensaje: `En la columna C, Faltan los colegios: ${missingColegios.join(', ')}`,
                            hoja: 2,
                            campo: ''
                        });
                    }
                    const missingGrados = Array.from(gradosNombres).filter(item => !foundGrados.has(item));
                    if (missingGrados.length > 0) {
                        errores.push({
                            fila: 0,
                            columna: 'D',
                            mensaje: `En la columna D, Faltan los grados: ${missingGrados.join(', ')}`,
                            hoja: 2,
                            campo: ''
                        });
                    }
                    const missingPertenencias = Array.from(pertenencias).filter(item => !foundPertenenciasSet.has(item));
                    if (missingPertenencias.length > 0) {
                        errores.push({
                            fila: 0,
                            columna: 'E',
                            mensaje: `En la columna E, Faltan las pertenencias: ${missingPertenencias.join(', ')}`,
                            hoja: 2,
                            campo: ''
                        });
                    }
                    for (let i = 0; i < grados.length; i++) {
                        const gradoKey = grados[i].id
                        const categoriasFound: string[] = foundCategoriasSet.get(gradoKey) || []
                        const categorias: CategoriaExtendida[] = categoriasConAreaPorGrado.get(gradoKey) || []

                        const faltantes: string[] = []
                        for (let j = 0; j < categorias.length; j++) {
                            const categoria = categorias[j]
                            const categoriaNombre = `${categoria.areaNombre} - ${categoria.nombre}`.toLowerCase();
                            const found = categoriasFound.includes(categoriaNombre)
                            if (!found) {
                                faltantes.push(categoriaNombre)
                            }
                        }
                        if (faltantes.length > 0) {
                            errores.push({
                                fila: 0,
                                columna: excelCol[i + 6].columna,
                                mensaje: `En la columna ${grados[i].nombre}, Faltan las categorías: ${faltantes.join(', ')}`,
                                hoja: 2,
                                campo: ''
                            });
                        }
                    }
                }
            }
            const hoja3Data = result.jsonData[2];
            if (hoja3Data && hoja3Data.length > 1) {
                const map = new Map<string, Provincia[]>(
                    departamentosProvincias.map(item => [item.nombre.toLocaleLowerCase(), item.provincias])
                );
                const headers = hoja3Data[0];
                const departamentos = [
                    { columna: 'A', header: 'Beni' },
                    { columna: 'B', header: 'Chuquisaca' },
                    { columna: 'C', header: 'Cochabamba' },
                    { columna: 'D', header: 'La Paz' },
                    { columna: 'E', header: 'Oruro' },
                    { columna: 'F', header: 'Pando' },
                    { columna: 'G', header: 'Potosi' },
                    { columna: 'H', header: 'Santa Cruz' },
                    { columna: 'I', header: 'Tarija' }
                ];
                let noHayUnDepartamento = false;
                for (let i = 0; i < headers.length; i++) {
                    const header = headers[i];
                    const departamentoNombre = header?.toLocaleLowerCase();
                    if (!departamentos.some(departamento => departamento.header.toLocaleLowerCase() === departamentoNombre)) {
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
                if (!noHayUnDepartamento) {
                    const foundProvincias: Map<string, string[]> = new Map<string, string[]>();
                    departamentos.forEach(d => foundProvincias.set(d.header.toLowerCase(), []));
                    for (let fila = 1; fila < hoja3Data.length; fila++) {
                        const numeroFilaExcel = fila + 1;
                        for (let columna = 0; columna < hoja3Data[fila].length; columna++) {
                            const key = departamentos[columna].header.toLowerCase();
                            const valor = hoja3Data[fila][columna]?.toLowerCase() || null;
                            const provincia = map.get(key);
                            if (valor !== null) {
                                const existeProvincia = provincia?.some(prov => {
                                    return prov.nombre.toLowerCase() === valor
                                });
                                if (!existeProvincia) {
                                    errores.push({
                                        fila: numeroFilaExcel,
                                        columna: departamentos[columna].columna,
                                        mensaje: `Provincia ${valor} no encontrada en el departamento ${key} `,
                                        hoja: 3,
                                        campo: departamentos[columna].header
                                    });
                                } else {
                                    const provincias = foundProvincias.get(key) || [];
                                    provincias.push(valor || '');
                                }
                            }
                        }
                    }
                    for (let i = 0; i < departamentos.length; i++) {
                        const departamentoKey = departamentos[i].header


                        const provinciasFound: string[] = foundProvincias.get(departamentoKey.toLowerCase()) || []
                        const provincias: Provincia[] = map.get(departamentoKey.toLowerCase()) || []

                        const faltantes: string[] = []
                        for (let j = 0; j < provincias.length; j++) {
                            const provincia = provincias[j]
                            const provinciaNombre = provincia.nombre;
                            const found = provinciasFound.includes(provinciaNombre.toLowerCase());
                            if (!found) {
                                faltantes.push(provinciaNombre)
                            }
                        }
                        if (faltantes.length > 0) {
                            errores.push({
                                fila: 0,
                                columna: departamentos[i].columna,
                                mensaje: `En la columna ${departamentos[i].columna}, Faltan las provincias: ${faltantes.join(', ')}`,
                                hoja: 3,
                                campo: ''
                            });
                        }
                    }
                }
            }
            setErroresDeFormato(errores);
        } catch (error) {
            setShowConfirmDialog(false);
            console.error('Error al procesar el archivo:', error);
            toast.error("Error al procesar el archivo."); 
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
                <ReturnComponent />
            </div>
            <h2 className="text-3xl font-bold text-center mb-8">Subir Plantilla de Excel para la Olimpiada</h2>
            <div className="w-full max-w-lg p-6 border rounded-lg shadow-md bg-card text-card-foreground space-y-5">
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
                                <LoadingAlert message="Espere por favor, estamos procesando para verificar que no existan errores..." />
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
                                                >{`En la [${error.columna}] de la fila [${error.fila}] de la hoja [${error.hoja}] tiene el siguiente error: ${error.mensaje}`}</ErrorCheckboxRow>
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
                                            ¿Estás seguro de que deseas subir "{fileToConfirm?.name}" para la olimpiada seleccionada?
                                            {oldFiles.length > 0 && (
                                                <span className="block text-indigo-500">
                                                    Se encontró una plantilla previa para esta olimpiada, si subes un nuevo archivo, se sobreescribirá.
                                                </span>
                                            )}
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
        </div>

    );
};

export default FileUploadFormato;
