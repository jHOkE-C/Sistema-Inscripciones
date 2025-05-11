"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { API_URL } from "@/hooks/useApiRequest";
import {
    CategoriaExtendida,
    grados,
    ExcelPostulante,
    Postulante,
    UploadResponse,
    type newExcelPostulante,
    type newPostulante,
} from "@/interfaces/postulante.interface";
import {
    Departamento,
    Provincia,
    Colegio,
} from "@/interfaces/ubicacion.interface";
import {
    ValidationError,
    ErroresDeFormato,
} from "@/interfaces/error.interface";
import { ErrorCheckboxRow } from "@/components/ErrorCheckboxRow";
import { newValidarFila, validarFila } from "./validations";
import FileUpload from "../../../../../components/fileUpload";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { HoverCard, HoverCardTrigger } from "@radix-ui/react-hover-card";
import { HoverCardContent } from "@/components/ui/hover-card";
import LoadingAlert from "@/components/loading-alert";
import { useParams } from "react-router-dom";
import { Olimpiada } from "@/types/versiones.type";
import { ExcelParser } from "@/lib/ExcelParser";
import {
    getAreasConCategorias,
    getCategoriasOlimpiada,
} from "@/api/categorias";

interface FileUploadModalProps {
    maxFiles?: number;
    maxSize?: number;
    accept?: string;
    onFilesChange?: (files: File[]) => void;
    triggerText?: string;
    title?: string;
    description?: string;
    olimpiadaP: Olimpiada[];
}

export default function FileUploadModal({
    maxFiles = 1,
    maxSize = 10,
    accept = ".xlsx,.xls",
    onFilesChange,
    triggerText = "Subir archivos",
    title = "Añadir archivo excel",
    description = "Selecciona un archivo de Excel de tu dispositivo o arrástralo y suéltalo aquí.",
    olimpiadaP = [],
}: FileUploadModalProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [open, setOpen] = useState(false);

    const { ci } = useParams();
    const [loading, setLoading] = useState(true);
    const [errores, setErrores] = useState<ValidationError[]>([]);
    const [erroresDeFormatoExcel, setErroresDeFormatoExcel] = useState<
        ErroresDeFormato[]
    >([]);
    const [showDialog, setShowDialog] = useState(false);
    const [postulantes, setPostulantes] = useState<newPostulante[]>([]);
    const [cargandoCategorias, setCargandoCategorias] = useState(false);
    const [olimpiada, setOlimpiada] = useState<Olimpiada[]>([]);

    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [colegios, setColegios] = useState<Colegio[]>([]);
    const [areasCategorias, setAreasCategorias] = useState<
        Map<string, CategoriaExtendida[]>
    >(new Map());

    useEffect(() => {
        const fetchOlimpiadas = async () => {
            try {
                setOlimpiada(olimpiadaP);

                const deptResponse = await axios.get(
                    `${API_URL}/api/departamentos`
                );
                setDepartamentos(deptResponse.data);
                const provResponse = await axios.get(
                    `${API_URL}/api/provincias`
                );
                setProvincias(provResponse.data);
                const colResponse = await axios.get(`${API_URL}/api/colegios`);
                setColegios(colResponse.data);

                setCargandoCategorias(true);
            } catch (error) {
                console.error("Error al cargar olimpiadas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOlimpiadas();
    }, []);

    useEffect(() => {
        if (!loading && open && cargandoCategorias) {
            const fetchData = async () => {
                try {
                    const areasConCategoriasData = await getAreasConCategorias(
                        Number(olimpiada[0].id)
                    );
                    const gradosCategoriasData = await getCategoriasOlimpiada(
                        Number(olimpiada[0].id)
                    );
                    const areasMap = new Map<string, CategoriaExtendida[]>();

                    grados.forEach((grado, index) => {
                        const categorias = gradosCategoriasData[index] || [];
                        const categoriasConArea: CategoriaExtendida[] =
                            categorias.map((cat) => {
                                const area = areasConCategoriasData.find((a) =>
                                    a.categorias.some((c) => c.id === cat.id)
                                );

                                return {
                                    ...cat,
                                    areaId: area?.id ?? 0,
                                    areaNombre: area?.nombre ?? "Desconocida",
                                };
                            });
                        areasMap.set(grado.id, categoriasConArea);
                    });
                    setAreasCategorias(areasMap);
                } catch (error) {
                    console.error(
                        "Error al cargar datos de validación:",
                        error
                    );
                } finally {
                    setCargandoCategorias(false);
                }
            };

            fetchData();
        }
    }, [loading, open, cargandoCategorias]);

    const handleFilesChange = (newFiles: File[]) => {
        setFiles(newFiles);
        if (onFilesChange) {
            onFilesChange(newFiles);
        }
    };
    const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    const handleProcesar = async () => {
        if (files.length === 0) return;

        const selectedFile = files[0];
        setLoading(true);
        setShowDialog(true);
        await sleep(1);
        try {
            const { jsonData, erroresDeFormato: formatoErrors } =
                await ExcelParser(selectedFile);
            setErroresDeFormatoExcel(formatoErrors);
            if (formatoErrors.length > 0) {
                setLoading(false);
                return;
            }

            let encontroFilaVacia = false;
            const postulantesData: ExcelPostulante[] = jsonData[0]
                .slice(1)
                .filter((fila) => {
                    if (encontroFilaVacia) return false;

                    const filaVacia = fila.every(
                        (campo) =>
                            campo === null ||
                            (typeof campo === "string" && campo.trim() === "")
                    );

                    if (filaVacia) {
                        encontroFilaVacia = true;
                        return false;
                    }

                    return true;
                })
                .map((fila) => ({
                    nombres: fila[0]?.toString().trim() || "",
                    apellidos: fila[1]?.toString().trim() || "",
                    ci: fila[2]?.toString().trim() || "",
                    fecha_nacimiento: fila[3]?.toString().trim() || "",
                    correo_electronico: fila[4]?.toString().trim() || "",
                    departamento: fila[5]?.toString().trim() || "",
                    provincia: fila[6]?.toString().trim() || "",
                    colegio: fila[7]?.toString().trim() || "",
                    grado: fila[8]?.toString().trim() || "",
                    telefono_referencia: fila[9]?.toString().trim() || "",
                    telefono_pertenece_a: fila[10]?.toString().trim() || "",
                    correo_referencia: fila[11]?.toString().trim() || "",
                    correo_pertenece_a: fila[12]?.toString().trim() || "",
                    area_categoria1: fila[13]?.toString().trim() || "",
                    area_categoria2: fila[14]?.toString().trim() || "",
                }));

            if (postulantesData.length === 0) {
                throw new Error("No hay postulantes en el archivo");
            }

            const todosErrores: ValidationError[] = [];
            const postulantesConvertidos: Postulante[] = [];
            postulantesData.forEach((fila, index) => {
                const erroresFila = validarFila(
                    fila,
                    index + 2,
                    departamentos,
                    provincias,
                    colegios,
                    areasCategorias,
                    postulantesConvertidos
                );
                todosErrores.push(...erroresFila);
            });
            console.log("postulantes convertidos:", postulantesConvertidos);

            //setPostulantes(postulantesConvertidos);
            setLoading(false);
            setErrores(todosErrores);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Error al procesar el archivo, " + error.message);
            } else {
                toast.error("Error al procesar el archivo, " + error);
            }
            setShowDialog(false);
        } finally {
            setLoading(false);
        }
    };
    const newHandleProcesar = async () => {
        if (files.length === 0) return;

        const selectedFile = files[0];
        setLoading(true);
        setShowDialog(true);
        try {
            const { jsonData, erroresDeFormato: formatoErrors } =
                await ExcelParser(selectedFile);
            setErroresDeFormatoExcel(formatoErrors);
            if (formatoErrors.length > 0) {
                setLoading(false);
                return;
            }

            let encontroFilaVacia = false;
            const postulantesData: newExcelPostulante[] = jsonData[0]
                .slice(1)
                .filter((fila) => {
                    if (encontroFilaVacia) return false;

                    const filaVacia = fila.every(
                        (campo) =>
                            campo === null ||
                            (typeof campo === "string" && campo.trim() === "")
                    );

                    if (filaVacia) {
                        encontroFilaVacia = true;
                        return false;
                    }

                    return true;
                })
                .map((fila) => {
                    let inscripciones: string[] = [];
                    for (let index = 13; index < fila.length; index++) {
                        inscripciones = [
                            ...inscripciones,
                            fila[index]?.toString().trim() || "",
                        ];
                    }

                    return {
                        nombres: fila[0]?.toString().trim() || "",
                        apellidos: fila[1]?.toString().trim() || "",
                        ci: fila[2]?.toString().trim() || "",
                        fecha_nacimiento: fila[3]?.toString().trim() || "",
                        correo_electronico: fila[4]?.toString().trim() || "",
                        departamento: fila[5]?.toString().trim() || "",
                        provincia: fila[6]?.toString().trim() || "",
                        colegio: fila[7]?.toString().trim() || "",
                        grado: fila[8]?.toString().trim() || "",
                        telefono_referencia: fila[9]?.toString().trim() || "",
                        telefono_pertenece_a: fila[10]?.toString().trim() || "",
                        correo_referencia: fila[11]?.toString().trim() || "",
                        correo_pertenece_a: fila[12]?.toString().trim() || "",
                        inscripciones: [
                            ...new Set(
                                inscripciones.filter(
                                    (inscripcion) => inscripcion
                                )
                            ),
                        ],
                    };
                });

            if (postulantesData.length === 0) {
                throw new Error("No hay postulantes en el archivo");
            }

            const todosErrores: ValidationError[] = [];
            const postulantesConvertidos: newPostulante[] = [];
            postulantesData.forEach((fila, index) => {
                const erroresFila = newValidarFila(
                    fila,
                    index + 2,
                    departamentos,
                    provincias,
                    colegios,
                    areasCategorias,
                    postulantesConvertidos
                );
                todosErrores.push(...erroresFila);
            });
            console.log("postulantes convertidos", postulantesConvertidos);

            setPostulantes(postulantesConvertidos);
            setLoading(false);
            setErrores(todosErrores);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Error al procesar el archivo, " + error.message);
            } else {
                toast.error("Error al procesar el archivo, " + error);
            }
            setShowDialog(false);
        } finally {
            setLoading(false);
        }
    };

    function generarSufijo() {
        return Math.random().toString(36).substring(2, 10);
    }
    const handleConfirm = async () => {
        if (errores.length > 0) return;

        try {
            setLoading(true);
            const nombreLista = `excel${generarSufijo()}`;
            const payload = {
                ci: ci,
                nombre_lista: nombreLista,
                olimpiada_id: olimpiada[0].id,
                listaPostulantes: postulantes,
            };
            console.log(payload);
            const response = await axios.post<UploadResponse>(
                `${API_URL}/api/inscripciones/bulk`,
                payload
            );
            //recordatorio
            console.log("Respuesta del servidor:", response.data);

            toast.success("Postulantes registrados exitosamente");
            setOpen(false);
            setFiles([]);
            setPostulantes([]);
            setShowDialog(false);
        } catch (err: unknown) {
            let errorMessage = "Error al procesar el archivo.";
            if (err instanceof AxiosError) {
                errorMessage = err.response?.data.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            } else {
                errorMessage = "Error Desconocido al procesar el archivo";
            }
            toast.error(errorMessage);
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
        <>
            <div className="hidden" onClick={() => handleProcesar()}></div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus /> {triggerText}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] md:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    <div className="">
                        {cargandoCategorias && olimpiada.length > 0 && (
                            <LoadingAlert message="Espere por favor, estamos cargando categorías y áreas..." />
                        )}

                        {!cargandoCategorias && (
                            <>
                                <FileUpload
                                    key={files[0]?.name}
                                    maxFiles={maxFiles}
                                    maxSize={maxSize}
                                    accept={accept}
                                    onFilesChange={handleFilesChange}
                                    filesRefresh={files}
                                />

                                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleCancel()}
                                    >
                                        Cancelar
                                    </Button>
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <div>
                                                <Button
                                                    disabled={
                                                        files.length === 0 ||
                                                        files.length > maxFiles
                                                    }
                                                    onClick={newHandleProcesar}
                                                >
                                                    Subir Archivo
                                                </Button>
                                            </div>
                                        </HoverCardTrigger>
                                        <HoverCardContent className=" p-2">
                                            <p className="text-sm text-zinc-500">
                                                No se ha seleccionado ningun
                                                archivo
                                            </p>
                                        </HoverCardContent>
                                    </HoverCard>
                                </DialogFooter>
                            </>
                        )}
                    </div>

                    <Dialog open={showDialog} onOpenChange={setShowDialog}>
                        <DialogContent className="h-auto gap-2">
                            {loading ? (
                                <>
                                    <DialogTitle>
                                        Procesando archivo
                                    </DialogTitle>
                                    <LoadingAlert message="Espere por favor, estamos procesando para verificar que no existan errores..." />
                                </>
                            ) : (
                                <>
                                    <DialogTitle>
                                        {errores.length > 0 ||
                                        erroresDeFormatoExcel.length > 0
                                            ? "Errores de formato"
                                            : "El archivo es válido"}
                                    </DialogTitle>
                                    {errores.length > 0 ||
                                    erroresDeFormatoExcel.length > 0 ? (
                                        <div className="">
                                            <p className="text-sm pb-4 text-foreground/70">
                                                Se encontraron errores en el
                                                archivo. puede usar los checkbox
                                                para marcar los errores que vas
                                                corrigiendo.
                                            </p>
                                            <div className="max-h-96 overflow-y-auto space-y-2">
                                                {erroresDeFormatoExcel.map(
                                                    (error, index) => (
                                                        <ErrorCheckboxRow
                                                            key={index}
                                                        >
                                                            El campo{" "}
                                                            <span className="text-red-500">
                                                                {error.columna}
                                                            </span>{" "}
                                                            en la fila{" "}
                                                            {error.fila} en la
                                                            hoja {error.hoja}{" "}
                                                            tiene el siguiente
                                                            error:{" "}
                                                            {error.mensaje}
                                                        </ErrorCheckboxRow>
                                                    )
                                                )}
                                                {Object.entries(
                                                    errores.reduce(
                                                        (acc, error) => {
                                                            const key = `${error.ci}-${error.fila}`;
                                                            if (!acc[key])
                                                                acc[key] = [];
                                                            acc[key].push(
                                                                error
                                                            );
                                                            return acc;
                                                        },
                                                        {} as Record<
                                                            string,
                                                            (typeof errores)[0][]
                                                        >
                                                    )
                                                ).map(([key, erroresGrupo]) => {
                                                    const [ci, fila] =
                                                        key.split("-");
                                                    return (
                                                        <div
                                                            key={key}
                                                            className="mb-3"
                                                        >
                                                            <div className="font-semibold text-orange-500">
                                                                Fila {fila} - CI{" "}
                                                                {ci}
                                                            </div>
                                                            <ul className="ml-4 list-disc">
                                                                {erroresGrupo.map(
                                                                    (
                                                                        error,
                                                                        index
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="text-foreground"
                                                                        >
                                                                            {
                                                                                error.campo
                                                                            }
                                                                            :{" "}
                                                                            <span className="text-red-500">

                                                                            {
                                                                              error.mensaje
                                                                            }
                                                                            </span>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <DialogFooter className="mt-4">
                                                <Button
                                                    onClick={() =>
                                                        setShowDialog(false)
                                                    }
                                                >
                                                    Cerrar
                                                </Button>
                                            </DialogFooter>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-sm pb-4 text-zinc-500">
                                                En el archivo no se encontraron
                                                errores. Presione aceptar para
                                                subir los postulantes.
                                            </p>
                                            <DialogFooter>
                                                <Button
                                                    disabled={
                                                        errores.length > 0 ||
                                                        erroresDeFormatoExcel.length >
                                                            0
                                                    }
                                                    onClick={handleConfirm}
                                                >
                                                    Aceptar
                                                </Button>
                                            </DialogFooter>
                                        </>
                                    )}
                                </>
                            )}
                        </DialogContent>
                    </Dialog>
                </DialogContent>
            </Dialog>
        </>
    );
}
