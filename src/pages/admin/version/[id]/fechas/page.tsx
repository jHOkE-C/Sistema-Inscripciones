import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios, { type AxiosError } from "axios";
import { differenceInCalendarDays, addDays } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft } from "lucide-react";
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
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { formatDate, type Cronograma, type OlimpiadaData } from "../types";
import { API_URL } from "@/hooks/useApiRequest";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
const CronogramaDefecto: Cronograma[] = [
    {
        tipo_plazo: "Preparacion",
        fecha_fin: "",
        fecha_inicio: "",
    },
    {
        tipo_plazo: "Lanzamiento",
        fecha_fin: "",
        fecha_inicio: "",
    },
    {
        tipo_plazo: "Inscripcion",
        fecha_fin: "",
        fecha_inicio: "",
    },
    {
        tipo_plazo: "Pre Clasificacion",
        fecha_fin: "",
        fecha_inicio: "",
    },
    {
        tipo_plazo: "Final",
        fecha_fin: "",
        fecha_inicio: "",
    },
    {
        tipo_plazo: "Premiacion",
        fecha_fin: "",
        fecha_inicio: "",
    },
];

export default function Page() {

    const nav = useNavigate();
    const { id } = useParams();

    const [data, setData] = useState<OlimpiadaData | null>(null);
    const [loading, setLoading] = useState(true);
    const [openPopover, setOpenPopover] = useState<string | null>(null);

    // cronogramas locales para edición
    const [cronos, setCronos] = useState<Cronograma[]>(CronogramaDefecto);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const res = await axios.get<OlimpiadaData>(
                `${API_URL}/api/olimpiadas/${id}/cronogramas`
            );
            setData(res.data);
            if (res.data.olimpiada.cronogramas.length > 0) {
                setCronos(res.data.olimpiada.cronogramas);
            } else {
                CronogramaDefecto[0].fecha_inicio =
                    res.data.olimpiada.fecha_inicio;
                setCronos(CronogramaDefecto);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }

    if (loading) return <p>Cargando...</p>;
    if (!data) return <p>No se encontró la olimpiada</p>;

    const { olimpiada } = data;
    console.log(olimpiada.fecha_fin);
    const vStart = new Date(olimpiada.fecha_inicio);
    const vEnd = addDays(new Date(olimpiada.fecha_fin), 1);

    // al seleccionar fecha en el calendario
    function onSelectDate(
        index: number,
        date: Date,
        tipo: string,
        field: "fecha_inicio" | "fecha_fin"
    ) {
        console.log("selected", date);
        setCronos((prev) =>
            prev.map((c, i) => {
                if (c.tipo_plazo === tipo) {
                    return {
                        ...c,
                        [field]: date.toISOString().split("T")[0], // Guardar en formato YYYY-MM-DD
                    };
                }
                // auto-asignar fecha_inicio de la siguiente fase
                if (field === "fecha_fin" && i === index + 1) {
                    return {
                        ...c,
                        fecha_inicio: addDays(date, 1)
                            .toISOString()
                            .split("T")[0], // Guardar en formato YYYY-MM-DD
                    };
                }
                return c;
            })
        );
        // cerramos el popover
    }

    function validateAll() {
        for (let i = 0; i < cronos.length; i++) {
            const c = cronos[i];
            const start = new Date(c.fecha_inicio);
            const end = new Date(c.fecha_fin);
            // fechas válidas y ordenadas
            if (!c.fecha_inicio || !c.fecha_fin) {
                toast.error(
                    "Todas las fases deben tener fecha de inicio y fin."
                );
                return false;
            }
            if (differenceInCalendarDays(end, start) <= 0) {
                toast.error(
                    `La fecha fin de ${c.tipo_plazo} debe ser posterior a la de inicio.`
                );
                return false;
            }
            if (start < vStart || end > vEnd) {
                toast.error(
                    `${c.tipo_plazo} debe estar dentro del rango de la versión.`
                );
                return false;
            }
            // no solapamiento con fase anterior
            if (i > 0) {
                const prevEnd = new Date(cronos[i - 1].fecha_fin);
                if (start < prevEnd) {
                    toast.error(
                        `${c.tipo_plazo} se solapa con la fase anterior.`
                    );
                    return false;
                }
            }
        }
        return true;
    }

    async function onSave() {
        cronos[0].fecha_inicio = olimpiada.fecha_inicio;
        const data = { id_olimpiada: olimpiada.id, cronogramas: cronos };
        console.log(data);
        if (!validateAll()) return;
        try {
            await axios.post(`${API_URL}/api/cronogramas/fases`, data);
            toast.success("Se registró el rango de fechas exitosamente.");
            nav(`/admin/version/${id}`);
        } catch(e) {

            const errorMessage = (e as AxiosError<{ error?: string }>).response?.data?.error || "Error al guardar. Inténtalo de nuevo.";
            toast.error(errorMessage);
        }
    }
    const getTipoPlazoLabel = (text: string) => {
        return text
            .split(" ")
            .map((t) => t.at(0)?.toUpperCase() + t.slice(1) + " ");
    };

    return (
        <>
            <div className="pl-4 pt-4">
                <Link to="/admin" className="">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-1 mb-4"
                    >
                        <ChevronLeft className="h" />
                        Volver
                    </Button>
                </Link>
            </div>
            <div className="container mx-auto p-6">
               
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle>
                            <h1 className="text-2xl font-bold ">
                                Definicion de Fases de Version de Olimpiada
                            </h1>
                        </CardTitle>
                        <CardDescription>
                            <h2 className="text-xl font-semibold ">
                                {olimpiada.nombre} – {olimpiada.gestion}
                            </h2>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4  p-4 bg-gray-50 rounded-lg">
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
                    </CardContent>
                </Card>

                <Card>
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
                                    return (
                                      <TableRow key={c.tipo_plazo}>
                                        <TableCell>
                                          <Badge variant="outline">
                                            {getTipoPlazoLabel(c.tipo_plazo)}
                                          </Badge>
                                        </TableCell>

                                        <TableCell>
                                          <span>
                                            {c.fecha_inicio
                                              ? formatDate(c.fecha_inicio)
                                              : `seleccione la fecha fin de ${
                                                  cronos[index - 1].tipo_plazo
                                                }`}
                                          </span>
                                        </TableCell>
                                        <TableCell>
                                          <Popover
                                            open={openPopover === c.tipo_plazo}
                                            onOpenChange={(open) =>
                                              setOpenPopover(
                                                open ? c.tipo_plazo : null
                                              )
                                            }
                                          >
                                            <PopoverTrigger asChild>
                                              <Button
                                                disabled={!c.fecha_inicio}
                                                variant="link"
                                                size="sm"
                                                className="flex items-center font-normal"
                                              >
                                                <CalendarIcon className="w-4 h-4 mr-1" />
                                                {c.fecha_fin
                                                  ? formatDate(c.fecha_fin)
                                                  : "Seleccione una fecha"}
                                              </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0 pl-4">
                                                <Calendar
                                                    mode="single"
                                                    locale={es}
                                                    defaultMonth={c.fecha_inicio ? new Date(c.fecha_inicio) : undefined}
                                                    selected={c.fecha_fin ? new Date(c.fecha_fin) : undefined}
                                                    onSelect={(d) => {
                                                        if (d) {
                                                            onSelectDate(
                                                                index,
                                                                d,
                                                                c.tipo_plazo,
                                                                "fecha_fin"
                                                            );
                                                            setOpenPopover(null);
                                                        }
                                                    }}
                                                    disabled={(
                                                        date
                                                    ) => {
                                                        const minEnd =
                                                            new Date(
                                                                c.fecha_inicio
                                                            );
                                                        return (
                                                            date <
                                                                minEnd ||
                                                            date <
                                                                vStart ||
                                                            date > vEnd
                                                        );
                                                    }}
                                                    initialFocus
                                                  
                                                   
                                                />
                                            </PopoverContent>
                                          </Popover>
                                        </TableCell>
                                        <TableCell>
                                          {c.fecha_inicio && c.fecha_fin
                                            ? differenceInCalendarDays(
                                                new Date(c.fecha_fin),
                                                new Date(c.fecha_inicio)
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
        </>
    );
}
