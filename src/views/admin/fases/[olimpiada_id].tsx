import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, { type AxiosError } from "axios";
import { differenceInCalendarDays } from "date-fns";

import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { API_URL } from "@/viewModels/hooks/useApiRequest.tsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    formatDate,
    type Cronograma,
    type OlimpiadaData,
} from "@/models/interfaces/types";
import DatePickerPopover from "@/components/DatePickerPopover";
import ReturnComponent from "@/components/ReturnComponent";
import Loading from "@/components/Loading";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/models/api/request";
import NotFoundPage from "@/views/404";
import { cn } from "@/lib/utils";

interface Fase {
    id: string;
    nombre_fase: string;
}

export default function Page() {
    const nav = useNavigate();
    const { olimpiada_id } = useParams();

    const [data, setData] = useState<OlimpiadaData | null>(null);
    const [loading, setLoading] = useState(true);
    const [openAdd, setOpenAdd] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedIdFases, setSelectedTipos] = useState<string[]>([]);

    const [cronos, setCronos] = useState<Cronograma[]>([]);
    const [errors, setErrors] = useState<{ start: boolean; end: boolean }[]>(
        []
    );
    //const [fases_borrar,setFasesBorrar] = useState([])
    //    const [removedTipos, setRemovedTipos] = useState<string[]>([]);
    const [fases, setFases] = useState<Fase[]>([]);

    useEffect(() => {
        refresh();
    }, []);

    async function refresh() {
        try {
            const res = await axios.get<OlimpiadaData>(
                `${API_URL}/api/olimpiadas/${olimpiada_id}/cronogramas`
            );
            setData(res.data);
            const cronogramas = res.data.olimpiada.cronogramas;

            if (cronogramas.length > 0) {
                setCronos(cronogramas);
            }

            const fases = await axios.get<Fase[]>(`${API_URL}/api/fases`);
            setFases(fases.data);

            const selected = cronogramas.map(({ id_fase }) => id_fase);

            setSelectedTipos(selected);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }

    if (loading) return <Loading />;
    if (!data) return <NotFoundPage />;

    const { olimpiada } = data;
    const vStart = parseLocalDate(olimpiada.fecha_inicio);
    const vEnd = parseLocalDate(olimpiada.fecha_fin);

    // al seleccionar fecha en el calendario
    function onSelectDate(
        date: Date,
        tipo: string,
        field: "fecha_inicio" | "fecha_fin"
    ) {
        setCronos((prev) =>
            prev.map((c) => {
                if (c.fase.nombre_fase === tipo) {
                    return {
                        ...c,
                        [field]: date.toISOString().split("T")[0], // Guardar en formato YYYY-MM-DD
                    };
                }

                return c;
            })
        );
        // cerramos el popover
    }
    function parseLocalDate(dateString: string): Date {
        const [year, month, day] = dateString.split("-").map(Number);
        // monthIndex = month - 1
        return new Date(year, month - 1, day);
    }
    function validateAll(): boolean {
        const newErrors: { start: boolean; end: boolean }[] = [];
        let valid = true;

        for (let i = 0; i < cronos.length; i++) {
            const c = cronos[i];
            const start = c.fecha_inicio
                ? parseLocalDate(c.fecha_inicio)
                : null;
            const end = c.fecha_fin ? parseLocalDate(c.fecha_fin) : null;
            const phaseName = c.fase.nombre_fase;
            const errorFlags = { start: false, end: false };

            if (!start || !end) {
                if (!start) {
                    errorFlags.start = true;
                    toast.error(
                        `La fase "${phaseName}" necesita fecha de inicio.`
                    );
                }
                if (!end) {
                    errorFlags.end = true;
                    toast.error(
                        `La fase "${phaseName}" necesita fecha de fin.`
                    );
                }
                valid = false;
            } else {
                console.log(`Phase: ${phaseName}`);
                console.log(`start: ${start?.toISOString()}, vStart: ${vStart.toISOString()}`);
                console.log(`end: ${end?.toISOString()}, vEnd: ${vEnd.toISOString()}`);
                console.log(`start.getTime(): ${start?.getTime()}, vStart.getTime(): ${vStart.getTime()}`);
                console.log(`end.getTime(): ${end?.getTime()}, vEnd.getTime(): ${vEnd.getTime()}`);

                if (start.getTime() < vStart.getTime()) {
                    errorFlags.start = true;
                    toast.error(
                        `La fecha de inicio de "${phaseName}" está antes del rango válido.`
                    );
                    valid = false;
                }
                if (end > vEnd) {
                    errorFlags.end = true;
                    toast.error(
                        `La fecha de fin de "${phaseName}" excede el rango permitido.`
                    );
                    valid = false;
                }
                console.log(
                    "diferencias",
                    differenceInCalendarDays(end, start)
                );
                if (differenceInCalendarDays(end, start) < 0) {
                    errorFlags.start = true;
                    errorFlags.end = true;
                    toast.error(
                        `En "${phaseName}", la fecha de fin debe ser posterior a la de inicio.`
                    );
                    valid = false;
                }
                if (i > 0) {
                    const prevPhase = cronos[i - 1].fase.nombre_fase;
                    const prevEnd = parseLocalDate(cronos[i - 1].fecha_fin);
                    if (start < prevEnd) {
                        errorFlags.start = true;
                        // Marca también el end de la fase anterior
                        newErrors[i - 1] = newErrors[i - 1] || {
                            start: false,
                            end: false,
                        };
                        newErrors[i - 1].end = true;
                        toast.error(
                            `La fase "${phaseName}" se solapa con la fase anterior "${prevPhase}".`
                        );
                        valid = false;
                    }
                }
            }

            newErrors[i] = errorFlags;
        }

        setErrors(newErrors);
        return valid;
    }

    async function onSave() {
        console.log("onSave");
        console.log(cronos);
        const payload = {
            id_olimpiada: olimpiada.id,
            cronogramas: cronos,
            //            removed: removedTipos,
        };
        // console.log(data);
        if (!validateAll()) return;
        try {
            console.log(payload);
            await axios.put(`${API_URL}/api/cronogramas/fases/fechas`, payload);
            toast.success(
                "Se registraron las fases y sus respectivas fechas exitosamente."
            );
            nav(`/admin/`);
        } catch (e) {
            const errorMessage =
                (e as AxiosError<{ error?: string }>).response?.data?.error ||
                "Error al guardar. Inténtalo de nuevo.";
            toast.error(errorMessage);
        }
    }
    function toggleTipo(id_fase: string) {
        if (id_fase == "1" && selectedIdFases.includes(id_fase)) {
            toast.info("no se puede quitar la fase de Preparación");
            return;
        }
        setSelectedTipos((prev) => {
            return prev.includes(id_fase)
                ? prev.filter((t) => t !== id_fase)
                : [...prev, id_fase];
        });
    }
    const idFasesCronogramas = cronos.map(({ id_fase }) => id_fase);
    const agregar = selectedIdFases.filter(
        (id) => !idFasesCronogramas.includes(id)
    );
    const eliminar = idFasesCronogramas.filter(
        (id) => !selectedIdFases.includes(id)
    );

    async function changePhase(confirm?: boolean) {
        setLoading(true);
        try {
            //selected tipos - cronogramas
            //cronogramas - selected tipos
            if (!confirm && eliminar.length > 0) {
                setOpenConfirm(true);
                return;
            }

            const data = {
                id_olimpiada: olimpiada_id,
                fases_agregar: agregar,
                fases_borrar: eliminar,
            };

            await apiClient.put("/api/cronogramas/fases/olimpiada", data);
            refresh();
            setOpenConfirm(false);
            setOpenAdd(false);
        } catch {
            toast.error("Ocurrio un error al agregar fases");
        } finally {
            setLoading(false);
        }
        // const toAdd = selectedTipos.filter(
        //     (tp) => !cronos.some((c) => c.fase.nombre_fase === tp)
        // );
        // const toRemove = cronos.filter(
        //     (c) => !selectedTipos.includes(c.tipo_plazo)
        // );

        // if (toAdd.length === 0 && toRemove.length === 0) {
        //     toast.error("No hay cambios en las fases seleccionadas.");
        //     return;
        // }

        // if (toAdd.length > 0) {
        //     const newPhases = toAdd.map((tp) => ({
        //         tipo_plazo: tp,
        //         fecha_inicio: "",
        //         fecha_fin: "",
        //     }));
        //     setCronos((prev) =>
        //         [...newPhases, ...prev].sort(
        //             (a, b) =>
        //                 fases.indexOf(a.tipo_plazo) -
        //                 fases.indexOf(b.tipo_plazo)
        //         )
        //     );
        //     setErrors((prev) => [
        //         ...newPhases.map(() => ({ start: false, end: false })),
        //         ...prev,
        //     ]);
        //     setRemovedTipos((prev) => prev.filter((rt) => !toAdd.includes(rt)));
        // }

        // if (toRemove.length > 0) {
        //     setCronos((prev) =>
        //         prev.filter((c) => selectedTipos.includes(c.tipo_plazo))
        //     );
        //     setErrors((prev) =>
        //         prev.filter((_, index) =>
        //             selectedTipos.includes(cronos[index].tipo_plazo)
        //         )
        //     );
        //     setRemovedTipos((prev) => [
        //         ...prev,
        //         ...toRemove.map((c) => c.tipo_plazo),
        //     ]);
        // }

        // setOpenAdd(false);
    }

    const getTipoPlazoLabel = (text: string) => {
        return text
            .split(" ")
            .map((t) => t.at(0)?.toUpperCase() + t.slice(1) + " ");
    };

    const FasesActualesPasadas = cronos.filter(
        ({ fecha_inicio }) => new Date(fecha_inicio) < new Date()
    );
    const idsFasesActualesPasadas = FasesActualesPasadas.map(
        ({ id_fase }) => id_fase
    );

    return (
        <>
            <ReturnComponent />
            <div className="container mx-auto p-6">
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle>
                            <h2 className="text-2xl font-bold ">
                                Definición de Fases de Version de Olimpiada
                            </h2>
                        </CardTitle>
                        <CardDescription>
                            <h2 className="text-xl font-semibold ">
                                {olimpiada.nombre} – {olimpiada.gestion}
                            </h2>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4  p-4 bg-background rounded-lg">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Fecha de inicio:
                                    </p>
                                    <p className="font-medium">
                                        {formatDate(olimpiada.fecha_inicio)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Fecha de finalización:
                                    </p>
                                    <p className="font-medium">
                                        {formatDate(olimpiada.fecha_fin)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                                <DialogTrigger asChild>
                                    <Button size="sm">Agregar Fase</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md p-6 rounded-2xl shadow-lg">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Agregar Nuevas Fases
                                        </DialogTitle>
                                        <DialogDescription className="text-sm mt-2">
                                            <p className="italic">
                                                Las fases en curso o finalizadas
                                                están deshabilitadas.
                                            </p>
                                        </DialogDescription>
                                        <div className="text-sm mt-4">
                                            <p className="mb-2">
                                                Selecciona las fases que deseas
                                                añadir o eliminar:
                                            </p>
                                            <ul className="space-y-1 text-center">
                                                <li>
                                                    <span className="text-blue-600 font-medium">
                                                        Azul
                                                    </span>
                                                    <span className="ml-2">
                                                        Fases activas
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="text-green-600 font-medium">
                                                        Verde
                                                    </span>
                                                    <span className="ml-2">
                                                        Fases a agregar
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="text-red-600 font-medium">
                                                        Rojo
                                                    </span>
                                                    <span className="ml-2">
                                                        Fases a eliminar
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </DialogHeader>
                                    <div className="p-2 space-y-2">
                                        {fases.map((tp) => (
                                            <div
                                                key={tp.id}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    disabled={
                                                        (tp.id == "1" &&
                                                            selectedIdFases.includes(
                                                                tp.id
                                                            )) ||
                                                        idsFasesActualesPasadas.includes(
                                                            tp.id
                                                        )
                                                    }
                                                    id={tp.id}
                                                    checked={selectedIdFases.includes(
                                                        tp.id
                                                    )}
                                                    onCheckedChange={() =>
                                                        toggleTipo(tp.id)
                                                    }
                                                />
                                                <Label
                                                    htmlFor={tp.id}
                                                    className={cn(
                                                        cronos.find(
                                                            ({ id_fase }) =>
                                                                tp.id == id_fase
                                                        )
                                                            ? "text-red-600"
                                                            : "",
                                                        cronos.find(
                                                            ({ id_fase }) =>
                                                                tp.id != id_fase
                                                        ) &&
                                                            selectedIdFases.includes(
                                                                tp.id
                                                            )
                                                            ? "text-green-600"
                                                            : "",
                                                        cronos.find(
                                                            ({ id_fase }) =>
                                                                tp.id == id_fase
                                                        ) &&
                                                            selectedIdFases.includes(
                                                                tp.id
                                                            )
                                                            ? "text-blue-600"
                                                            : "",

                                                        "ml-4"
                                                    )}
                                                >
                                                    {tp.nombre_fase}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => setOpenAdd(false)}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            onClick={() => changePhase(false)}
                                        >
                                            Guardar
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>

                <Card className="">
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fase</TableHead>
                                    <TableHead>Fecha inicio</TableHead>
                                    <TableHead>Fecha de finalización</TableHead>
                                    <TableHead>Duración</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cronos.map((c, index) => {
                                    const hasError = errors[index];
                                    return (
                                        <TableRow key={c.fase.nombre_fase}>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {getTipoPlazoLabel(
                                                        c.fase.nombre_fase
                                                    )}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <DatePickerPopover
                                                    className={
                                                        hasError?.start
                                                            ? "text-red-500"
                                                            : ""
                                                    }
                                                    onSelect={(d) => {
                                                        if (d) {
                                                            onSelectDate(
                                                                d,
                                                                c.fase
                                                                    .nombre_fase,
                                                                "fecha_inicio"
                                                            );
                                                            setErrors(
                                                                (
                                                                    prevErrors
                                                                ) => {
                                                                    const updatedErrors =
                                                                        [
                                                                            ...prevErrors,
                                                                        ];
                                                                    updatedErrors[
                                                                        index
                                                                    ] = {
                                                                        ...updatedErrors[
                                                                            index
                                                                        ],
                                                                        start: false,
                                                                    };
                                                                    return updatedErrors;
                                                                }
                                                            );
                                                        }
                                                    }}
                                                    selectedDate={
                                                        c.fecha_inicio
                                                            ? parseLocalDate(
                                                                  c.fecha_inicio
                                                              )
                                                            : null
                                                    }
                                                    minDate={
                                                        index > 0 &&
                                                        cronos[index - 1]
                                                            .fecha_fin
                                                            ? parseLocalDate(
                                                                  cronos[
                                                                      index - 1
                                                                  ].fecha_fin
                                                              )
                                                            : parseLocalDate(
                                                                  olimpiada.fecha_inicio
                                                              )
                                                    }
                                                    maxDate={
                                                        c.fecha_fin
                                                            ? parseLocalDate(
                                                                  c.fecha_fin
                                                              )
                                                            : parseLocalDate(
                                                                  olimpiada.fecha_fin
                                                              )
                                                    }
                                                    //fix temporal
                                                    disabled={index > 0 &&!cronos[index - 1].fecha_fin}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <DatePickerPopover
                                                    className={
                                                        hasError?.end
                                                            ? "text-red-500"
                                                            : ""
                                                    }
                                                    onSelect={(d) => {
                                                        if (d) {
                                                            onSelectDate(
                                                                d,
                                                                c.fase
                                                                    .nombre_fase,
                                                                "fecha_fin"
                                                            );
                                                            setErrors(
                                                                (
                                                                    prevErrors
                                                                ) => {
                                                                    const updatedErrors =
                                                                        [
                                                                            ...prevErrors,
                                                                        ];
                                                                    updatedErrors[
                                                                        index
                                                                    ] = {
                                                                        ...updatedErrors[
                                                                            index
                                                                        ],
                                                                        end: false,
                                                                    };
                                                                    return updatedErrors;
                                                                }
                                                            );
                                                        }
                                                    }}
                                                    selectedDate={
                                                        c.fecha_fin
                                                            ? parseLocalDate(
                                                                  c.fecha_fin
                                                              )
                                                            : null
                                                    }
                                                    minDate={
                                                        c.fecha_inicio
                                                            ? parseLocalDate(
                                                                  c.fecha_inicio
                                                              )
                                                            : parseLocalDate(
                                                                  olimpiada.fecha_inicio
                                                              )
                                                    }
                                                    maxDate={parseLocalDate(
                                                        olimpiada.fecha_fin
                                                    )}
                                                    //fix temporal
                                                    disabled={!c.fecha_inicio}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {c.fecha_inicio && c.fecha_fin
                                                    ? differenceInCalendarDays(
                                                          new Date(c.fecha_fin),
                                                          new Date(
                                                              c.fecha_inicio
                                                          )
                                                      ) + 1
                                                    : "N/A"}{" "}
                                                días
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <div className="">
                            <Button onClick={onSave}>Guardar Cambios</Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>¿Estas seguro?</DialogTitle>
                        <DialogDescription>
                            Se eliminarán las siguientes fases y toda su
                            información relacionada:{" "}
                            <span className="font-bold">
                                {eliminar
                                    .map(
                                        (id) =>
                                            fases.find((f) => f.id === id)
                                                ?.nombre_fase
                                    )
                                    .join(", ")}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <p className="text-sm ">¿Desea continuar?</p>

                    <DialogFooter>
                        <Button
                            variant={"default"}
                            onClick={() => changePhase(true)}
                        >
                            Continuar
                        </Button>
                        <Button
                            variant={"secondary"}
                            onClick={() => {
                                setOpenConfirm(false);
                            }}
                        >
                            Cancelar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
