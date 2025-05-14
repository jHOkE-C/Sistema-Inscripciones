"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus } from "lucide-react";
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
import { newValidarFila } from "./validations";
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
import { useNavigate } from "react-router-dom";

interface FileUploadModalProps {
    maxFiles?: number;
    maxSize?: number;
    accept?: string;
    onFilesChange?: (files: File[]) => void;
    triggerText?: string;
    title?: string;
    description?: string;
    olimpiada: Olimpiada;
    onSubmit?: () => void;
}

export default function FileUploadModal({
    maxFiles = 1,
    maxSize = 10,
    accept = ".xlsx,.xls",
    onFilesChange,
    triggerText = "Subir archivos",
    title = "Añadir archivo excel",
    description = "Selecciona un archivo de Excel de tu dispositivo o arrástralo y suéltalo aquí.",
    olimpiada,
    onSubmit = () => {},
}: FileUploadModalProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [open, setOpen] = useState(false);

    const { ci, codigo, codigo_lista } = useParams();
    const [loading, setLoading] = useState(false);
    const [errores, setErrores] = useState<ValidationError[]>([]);
    const [erroresDeFormatoExcel, setErroresDeFormatoExcel] = useState<
        ErroresDeFormato[]
    >([]);

    const [cargandoCategorias, setCargandoCategorias] = useState(false);

    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [colegios, setColegios] = useState<Colegio[]>([]);
    const [areasCategorias, setAreasCategorias] = useState<
        Map<string, CategoriaExtendida[]>
    >(new Map());

    const navigate = useNavigate()
    useEffect(() => {
        const fetchOlimpiadas = async () => {
            try {
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
                        Number(olimpiada.id)
                    );
                    const gradosCategoriasData = await getCategoriasOlimpiada(
                        Number(olimpiada.id)
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
                    console.log(areasMap);
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

    const newHandleProcesar = async () => {
        if (files.length === 0) return;

        const selectedFile = files[0];
        setLoading(true);

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
            console.log("errores", todosErrores);

            setErrores(todosErrores);
            setLoading(false);
            if (todosErrores.length > 0) return;
            inscribirPostulantes(postulantesConvertidos);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Error al procesar el archivo, " + error.message);
            } else {
                toast.error("Error al procesar el archivo, " + error);
            }
        } finally {
            setLoading(false);
        }
        if (errores.length > 0 || erroresDeFormatoExcel.length > 0) return;
    };

    function generarSufijo() {
        return Math.random().toString(36).substring(2, 10);
    }
    const inscribirPostulantes = async (postulantes: newPostulante[]) => {
        if (errores.length > 0) return;

        try {
            setLoading(true);
            const nombreLista = `excel${generarSufijo()}`;
            const payload = {
                ci: ci,
                nombre_lista: nombreLista,
                codigo_lista: codigo_lista || codigo,
                olimpiada_id: olimpiada.id,
                listaPostulantes: postulantes,
            };
            console.log("payload", payload);
            await axios.post<UploadResponse>(
                `${API_URL}/api/inscripciones/bulk`,
                payload
            );
            toast.success("Postulantes registrados exitosamente");
            onSubmit();
            setOpen(false);
            setFiles([]);
            if (codigo || codigo_lista) {
                navigate(`./${codigo || codigo_lista}`);
            }
        } catch (err: unknown) {
            console.log("Aqui", err);
            let errorMessage = "Error al procesar el archivo.";
            if (err instanceof AxiosError) {
                errorMessage = err.response?.data.mensaje;
                setLoading(false);
                setErrores(
                    err.response?.data.errores.map((error: string) => {
                        //"error en inscripciones de la fila 1 del estudiante con CI 66666666: Máximo 2 inscripciones permitidas"
                        const errorDividido = error.split(" ");
                        const campo = "Error";
                        const ci = errorDividido[11];
                        const fila = errorDividido[6];
                        const mensaje = error.split(":")[1];
                        return { campo, ci, fila, mensaje };
                    })
                );
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
        setOpen(false);
    };

    return (
        <>
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
                        {cargandoCategorias && (
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
                                            <Button
                                                disabled={
                                                    files.length === 0 ||
                                                    files.length > maxFiles
                                                }
                                                onClick={newHandleProcesar}
                                            >
                                                Inscribir Postulantes
                                            </Button>
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
                </DialogContent>
            </Dialog>
            <Dialog open={loading}>
                <DialogContent className="h-auto gap-2">
                    <DialogHeader>
                        <DialogTitle>Cargando</DialogTitle>
                        <DialogDescription>
                            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Dialog
                open={errores.length > 0 || erroresDeFormatoExcel.length > 0}
                onOpenChange={(open) => !open && setErrores([])}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Errores de formato</DialogTitle>
                        <div className="">
                            <p className="text-sm pb-4 text-foreground/70">
                                Se encontraron los siguientes errores en el
                                archivo.
                            </p>
                            <div className="max-h-96 overflow-y-auto space-y-2">
                                {erroresDeFormatoExcel.map((error, index) => (
                                    <ErrorCheckboxRow key={index}>
                                        El campo{" "}
                                        <span className="text-red-500">
                                            {error.columna}
                                        </span>{" "}
                                        en la fila {error.fila} en la hoja{" "}
                                        {error.hoja} tiene el siguiente error:{" "}
                                        {error.mensaje}
                                    </ErrorCheckboxRow>
                                ))}
                                {Object.entries(
                                    errores.reduce((acc, error) => {
                                        const key = `${error.ci}-${error.fila}`;
                                        if (!acc[key]) acc[key] = [];
                                        acc[key].push(error);
                                        return acc;
                                    }, {} as Record<string, (typeof errores)[0][]>)
                                ).map(([key, erroresGrupo]) => {
                                    const [ci, fila] = key.split("-");
                                    return (
                                        <div key={key} className="mb-3">
                                            <div className="font-semibold text-orange-500">
                                                Fila {fila} - CI {ci}
                                            </div>
                                            <ul className="ml-4 list-disc">
                                                {erroresGrupo.map(
                                                    (error, index) => (
                                                        <li
                                                            key={index}
                                                            className="text-foreground"
                                                        >
                                                            {error.campo}:{" "}
                                                            <span className="text-red-500">
                                                                {error.mensaje}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button onClick={() => setErrores([])}>Cerrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
