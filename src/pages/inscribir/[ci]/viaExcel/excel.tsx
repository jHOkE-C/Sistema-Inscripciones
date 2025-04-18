import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { grados, Departamento, Provincia, Colegio, ExcelPostulante, ValidationError, CategoriaExtendida, Postulante } from './types';
import { Loader2, Upload, FileSpreadsheet, Trash2} from "lucide-react";
import { API_URL } from "@/hooks/useApiRequest";
import { getCategoriaAreaPorGradoOlimpiada, Categoria } from "@/api/areas";
import Loading from "@/components/Loading";
import { validarCamposRequeridos, validarFila } from './validations';
import { Alert, AlertDescription } from "@/components/ui/alert";

import { AlertComponent } from "@/components/AlertComponent";

type AreaConCategorias = {
    id: number;
    nombre: string;
    categorias: Categoria[];
};
type Olimpiada = {
    id: number;
    nombre: string;
    gestion: string;
    fecha_inicio: string;
    fecha_fin: string;
    vigente: boolean;
};

export default function ExcelUploader() {
    
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [errores, setErrores] = useState<ValidationError[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [postulantes, setPostulantes] = useState<Postulante[]>([]);
    const [cargandoCategorias, setCargandoCategorias] = useState(false);
    const [olimpiada, setOlimpiada] = useState<Olimpiada[]>([]);
    const [alert, setAlert] = useState<{
        title: string;
        description?: string;
        variant?: "default" | "destructive";
    } | null>(null);
    
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [colegios, setColegios] = useState<Colegio[]>([]);
    const [areasCategorias, setAreasCategorias] = useState<Map<string, CategoriaExtendida[]>>(new Map());
    useEffect(() => {
        const fetchOlimpiadas = async () => {
            try {
                const olimpiadaResponse = await fetch(`${API_URL}/api/olimpiadas/hoy`);
                const olimpiadaData = await olimpiadaResponse.json();
                setOlimpiada(olimpiadaData);
                console.log(olimpiadaData);
                setCargandoCategorias(true);
                const deptResponse = await fetch(`${API_URL}/api/departamentos`);
                const deptData = await deptResponse.json();
                setDepartamentos(deptData);
                console.log('Departamentos:', deptData);
                const provResponse = await fetch(`${API_URL}/api/provincias`);
                const provData = await provResponse.json();
                setProvincias(provData);
                console.log('Provincias:', provData);
                const colResponse = await fetch(`${API_URL}/api/colegios`);
                const colData = await colResponse.json();
                setColegios(colData);
                console.log('Colegios:', colData);
            } catch (error) {
                console.error('Error al cargar olimpiadas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOlimpiadas();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!loading) return;

            try {
                const areasConCategorias = await fetch(`${API_URL}/api/areas/categorias/olimpiada/${olimpiada[0].id}`);
                const areasConCategoriasData = await areasConCategorias.json() as AreaConCategorias[];
                const areasMap = new Map<string, CategoriaExtendida[]>();
                for (const grado of grados) {
                    const categorias = await getCategoriaAreaPorGradoOlimpiada(grado.id, olimpiada[0].id.toString());
                    console.log(categorias);
                    const categoriasConArea: CategoriaExtendida[] = categorias.map((cat) => {
                        const area = areasConCategoriasData.find((a) =>
                            a.categorias.some((c) => c.id === cat.id)
                        );
                
                        return {
                            ...cat,
                            areaId: area?.id ?? 0,
                            areaNombre: area?.nombre ?? 'Desconocida',
                        };
                    });
                    areasMap.set(grado.id, categoriasConArea);
                }

                setAreasCategorias(areasMap);
                console.log(areasCategorias);
                console.log(areasMap);
            } catch (error) {
                console.error('Error al cargar datos de validación:', error);
            } finally {
                setCargandoCategorias(false);
            }
        };

        fetchData();
    }, [cargandoCategorias]);

    if (loading) {
        return <Loading />;
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                    file.type === 'application/vnd.ms-excel')) {
            const event = {
                target: {
                    files: [file]
                }
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            handleFileUpload(event);
        }
    };
    
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            setAlert({
                title: "Error",
                description: "Por favor, suba un archivo Excel (.xlsx o .xls)",
                variant: "destructive"
            });
            return;
        }
        setFile(file);
    };
    const handleProcesar = async () => {
        if (file === null) return;
        console.log('Archivo seleccionado:', file?.name, file?.type);
        setLoading(true);
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    if (!e.target?.result) {
                        throw new Error('No se pudo leer el archivo');
                    }

                    
                    const data = new Uint8Array(e.target.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { 
                        type: 'array',
                        cellDates: true,
                        cellNF: true,
                        cellText: false
                    });
                    if (!workbook.SheetNames.length) {
                        throw new Error('El archivo no contiene hojas');
                    }

                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    
                    
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { 
                        header: 1,
                        defval: null,
                        raw: false,
                        dateNF: 'dd/mm/yyyy'
                    }) as (string | null)[][];

                    
                    
                    const headers = jsonData[0].map(h => h?.toString() || '') as string[];
                    
                    
                    const camposFaltantes = validarCamposRequeridos(headers);
                    
                    if (camposFaltantes.length > 0) {
                        setErrores([{
                            campo: 'Archivo',
                            fila: 0,
                            ci: '',
                            mensaje: `Faltan las siguientes columnas: ${camposFaltantes.join(', ')}`
                        }]);
                        setShowDialog(true);
                        return;
                    }

                    let encontroFilaVacia = false;
                    const postulantesData: ExcelPostulante[] = jsonData.slice(1)
                        .filter((fila) => {
                            if (encontroFilaVacia) return false;
                            
                            const filaVacia = fila.every(campo => 
                                campo === null || 
                                (typeof campo === 'string' && campo.trim() === '')
                            );
                            
                            if (filaVacia) {
                                encontroFilaVacia = true;
                                return false;
                            }
                            
                            return true;
                        })
                        .map(fila => ({
                            nombres: fila[0]?.toString().trim() || '',
                            apellidos: fila[1]?.toString().trim() || '',
                            ci: fila[2]?.toString().trim() || '',
                            fecha_nacimiento: fila[3]?.toString().trim() || '',
                            correo_electronico: fila[4]?.toString().trim() || '',
                            departamento: fila[5]?.toString().trim() || '',
                            provincia: fila[6]?.toString().trim() || '',
                            colegio: fila[7]?.toString().trim() || '',
                            grado: fila[8]?.toString().trim() || '',
                            telefono_referencia: fila[9]?.toString().trim() || '',
                            telefono_pertenece_a: fila[10]?.toString().trim() || '',
                            correo_referencia: fila[11]?.toString().trim() || '',
                            correo_pertenece_a: fila[12]?.toString().trim() || '',
                            area_categoria1: fila[13]?.toString().trim() || '',
                            area_categoria2: fila[14]?.toString().trim() || ''
                        }));

                    if (postulantesData.length === 0) {
                        throw new Error('No se encontraron datos válidos en el archivo');
                    }
                    
                    const todosErrores: ValidationError[] = [];
                    const postulantesConvertidos: Postulante[] = [];
                    postulantesData.forEach((fila, index) => {
                        const erroresFila = validarFila(fila, index + 2, departamentos, provincias, colegios, areasCategorias, postulantesConvertidos);
                        todosErrores.push(...erroresFila);
                    });
                    
                    setPostulantes(postulantesConvertidos);
                    console.log('Postulantes convertidos:', postulantesConvertidos);
                    setErrores(todosErrores);
                    setShowDialog(true);
                } catch (error) {
                    console.error('Error al procesar el archivo:', error);
                    setAlert({
                        title: "Error",
                        description: error instanceof Error ? error.message : 'Error al procesar el archivo. Por favor, verifique el formato.',
                        variant: "destructive"
                    });
                }
            };
            reader.onerror = () => {
                setAlert({
                    title: "Error",
                    description: "Error al leer el archivo. Por favor, intente nuevamente.",
                    variant: "destructive"
                });
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Error al leer el archivo:', error);
            setAlert({
                title: "Error",
                description: "Error al leer el archivo. Por favor, intente nuevamente.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }
    const handleConfirmar = async () => {
        if (errores.length > 0) return;
        
        try {
            setLoading(true);
            setAlert({
                title: "Éxito",
                description: "Postulantes registrados exitosamente",
                variant: "default"
            });
            console.log(postulantes);
            setShowDialog(false);
            setPostulantes([]);
        } catch (error) {
            console.error('Error al registrar postulantes:', error);
            setAlert({
                title: "Error",
                description: "Error al registrar postulantes",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleEliminarError = (index: number) => {
        const nuevosErrores = [...errores];
        nuevosErrores.splice(index, 1);
        setErrores(nuevosErrores);
    };
    const handleDeleteFile = () => {
        setFile(null);
    };
    return (
        <div className="pl-4 pr-4">
            {alert && <AlertComponent {...alert} onClose={() => setAlert(null)} />}
            <div className="max-w-2xl mx-auto">
                <div className="flex flex-col space-y-4">
                    
                    
                    
                    
                    <p className="text-lg">Seleccione el archivo Excel con los postulantes</p>
                    <span className="text-sm text-gray-500">recuerde que puede descargar el excel con el formato aquí: 
                    <a href="https://ohsansi.up.railway.app/" className="text-blue-500 hover:text-blue-700">https://ohsansi.up.railway.app/</a></span>
                    
                    {!cargandoCategorias && olimpiada.length > 0 && (
                        <>
                            <div
                                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors hover:bg-zinc-50"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onClick={() => document.getElementById('excelInput')?.click()}
                            >
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="mt-4 flex text-sm leading-6 text-gray-600 flex-col">
                                    <label
                                        htmlFor="excelInput"
                                        className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary/80"
                                    >
                                        <span className=''>Subir un archivo</span>
                                        <input
                                            id="excelInput"
                                            type="file"
                                            accept=".xlsx,.xls"
                                            onChange={handleFileUpload}
                                            className="sr-only"
                                        />
                                    </label>
                                    <p className="pl-1">o arrástrelo y suéltelo aquí</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-600 mt-2">
                                    Solo archivos Excel (.xlsx, .xls)
                                </p>
                            </div>
                            
                            {file !== null && (
                                <>
                                    <p className="text-lg">Archivo seleccionado</p>
                                    <div className="flex justify-between text-sm text-gray-600 border-t border p-2 border-gray-400 rounded">
                                    <div className='flex items-center gap-2'>
                                        <FileSpreadsheet className="h-4 w-4" />
                                        <p>Archivo: {file?.name}</p>
                                        <p>{postulantes.length > 0 ? 'Excel con ' + postulantes.length + ' postulantes' : 'sin postulantes'}</p>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon"
                                            onClick={() => handleDeleteFile()}
                                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-end">
                            
                            <Button 
                                className='mr-2'
                                variant="outline" 
                                onClick={() => handleDeleteFile}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                
                                disabled = {file === null}
                                onClick={handleProcesar}
                            >
                                Confirmar
                            </Button>
                            </div>
                            
                            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                                <DialogHeader>
                                    <DialogTitle>
                                        {errores.length > 0 ? 
                                            <div className="space-y-2">
                                                
                                                <p className='text-red-500'>Se han detectado errores de formato en el archivo subido</p>
                                                {errores.map((error, index) => (
                                                    <div key={index} className="flex items-center justify-between text-sm text-red-500">
                                                        <div>
                                                            {`El campo [${error.campo}] en la fila [${error.fila}] del CI [${error.ci}] tiene el siguiente error: ${error.mensaje}`}
                                                        </div>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon"
                                                            onClick={() => handleEliminarError(index)}
                                                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                            : 
                                            ""
                                        }
                                    </DialogTitle>
                                </DialogHeader>
                                <DialogContent className="max-h-[80vh]">
                                    {errores.length > 0 ? (
                                        <div className="max-h-[80vh] overflow-y-auto">
                                            {errores.map((error, index) => (
                                                <div key={index} className="text-sm text-red-500">
                                                    {`El campo [${error.campo}] en la fila [${error.fila}] del CI [${error.ci}] tiene el siguiente error: ${error.mensaje}`}
                                                </div>
                                            ))}
                                            
                                        </div>
                                    ) : (
                                        <p className='pb-6 text-green-600'>El archivo está listo para ser procesado</p>    
                                    )}
                                    <DialogFooter>        
                                        <Button 
                                            variant="outline" 
                                            onClick={() => setShowDialog(false)}
                                        >
                                            Cancelar
                                        </Button>

                                        <Button 
                                            disabled = {errores.length > 0}
                                            onClick={handleConfirmar}
                                        >
                                            Confirmar
                                        </Button>                                        
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                    {cargandoCategorias && olimpiada.length > 0 && (
                        <Alert>
                            <AlertDescription className="flex items-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <p className='text-sm text-blue-500'>Espere por favor, estamos cargando categorías y áreas...</p>
                            </AlertDescription>
                        </Alert>
                    )}

                </div>
            </div>
        </div>
    );
}