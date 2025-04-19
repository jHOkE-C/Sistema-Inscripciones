"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { API_URL } from "@/hooks/useApiRequest";
import { getCategoriaAreaPorGradoOlimpiada, Categoria } from "@/api/areas";
import { grados, Departamento, Provincia, Colegio, ExcelPostulante, ValidationError, CategoriaExtendida, Postulante } from './types';
import { validarCamposRequeridos, validarFila } from './validations';
import { AlertComponent } from "@/components/AlertComponent";
import FileUpload from "./fileUpload";

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

interface FileUploadModalProps {
  maxFiles?: number;
  maxSize?: number; // in MB
  accept?: string;
  onFilesChange?: (files: File[]) => void;
  triggerText?: string;
  title?: string;
  description?: string;
}

export default function FileUploadModal({
  maxFiles = 1, // Default to 1 file maximum
  maxSize = 10, // 10MB default
  accept = ".xlsx,.xls",
  onFilesChange,
  triggerText = "Subir archivos",
  title = "Añadir archivo excel",
  description = "Selecciona un archivo de Excel de tu dispositivo o arrástralo y suéltalo aquí.",
}: FileUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  
  // Estados adicionales de excel.tsx
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
            const deptResponse = await fetch(`${API_URL}/api/departamentos`);
            const deptData = await deptResponse.json();
            setDepartamentos(deptData);
            const provResponse = await fetch(`${API_URL}/api/provincias`);
            const provData = await provResponse.json();
            setProvincias(provData);
            const colResponse = await fetch(`${API_URL}/api/colegios`);
            const colData = await colResponse.json();
            setColegios(colData);
            setCargandoCategorias(true);
        } catch (error) {
            console.error('Error al cargar olimpiadas:', error);
        } finally {
            setLoading(false);
        }
    };

    fetchOlimpiadas();
  }, []);

  useEffect(() => {
    if (loading || !open || !cargandoCategorias) return;
    const fetchData = async () => {
        try {
            const areasConCategorias = await fetch(`${API_URL}/api/areas/categorias/olimpiada/${olimpiada[0].id}`);
            const areasConCategoriasData = await areasConCategorias.json() as AreaConCategorias[];
            const areasMap = new Map<string, CategoriaExtendida[]>();
            for (const grado of grados) {
                const categorias = await getCategoriaAreaPorGradoOlimpiada(grado.id, olimpiada[0].id.toString());
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
        } catch (error) {
            console.error('Error al cargar datos de validación:', error);
        } finally {
            setCargandoCategorias(false);
        }
    };

    fetchData();
  }, [open]);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  };

  const handleProcesar = async () => {
    if (files.length === 0) return;
    
    const selectedFile = files[0];
    console.log('Archivo seleccionado:', selectedFile?.name, selectedFile?.type);
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
        reader.readAsArrayBuffer(selectedFile);
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
  };

  const handleConfirm = async () => {
    if (errores.length > 0) return;
    
    try {
        setLoading(true);
        setAlert({
            title: "Éxito",
            description: "Postulantes registrados exitosamente",
            variant: "default"
        });
        console.log(postulantes);
        handleCancel();
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

  const handleCancel = () => {
    setFiles([]);
    setErrores([]);
    setPostulantes([]);
    setShowDialog(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
                    {alert && <AlertComponent {...alert} onClose={() => setAlert(null)} />}
                    
                    {!cargandoCategorias && (
                        <>
                            <FileUpload 
                                maxFiles={maxFiles}
                                maxSize={maxSize}
                                accept={accept}
                                onFilesChange={handleFilesChange}
                            />
                            
                            <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                              <Button variant="outline"
                                  onClick={() => handleCancel()}
                              >
                                  Cancelar
                              </Button>
                              <Button 
                                  disabled={files.length === 0 || files.length > maxFiles}
                                  onClick={handleProcesar}
                              >
                                  Confirmar
                              </Button>
                            </DialogFooter>
                            
                            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                                <DialogContent className="max-h-[80vh]">                                    
                                    <DialogTitle>
                                       {errores.length > 0 ? "Errores de formato" : "Archivo listo para ser procesado"}
                                     </DialogTitle>
                                     {errores.length > 0 ? (
                                         <div className="max-h-[80vh] overflow-y-auto">
                                           
                                              {errores.map((error, index) => (
                                                  <div key={index} className="flex items-center justify-between text-sm text-red-500">
                                                      <div>
                                                          {`El campo [${error.campo}] en la fila [${error.fila}] del CI [${error.ci}] tiene el siguiente error: ${error.mensaje}`}
                                                      </div>
                                                      <input type="checkbox" />
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
                                            onClick={handleConfirm}
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
      </DialogContent>
    </Dialog>
  );
}
