import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { differenceInCalendarDays, addDays } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Toaster, toast } from "sonner";
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
const CronogramaDefecto: Cronograma[] = [
    {
        tipo_plazo: "preparación",
        fecha_fin: "",
        fecha_inicio: "",
    },
    {
        tipo_plazo: "lanzamiento",
        fecha_fin: "",
        fecha_inicio: "",
    },
    {
        tipo_plazo: "inscripción",
        fecha_fin: "",
        fecha_inicio: "",
    },
    {
        tipo_plazo: "pre clasificación",
        fecha_fin: "",
        fecha_inicio: "",
    },
    {
        tipo_plazo: "final",
        fecha_fin: "",
        fecha_inicio: "",
    },
    {
        tipo_plazo: "premiación",
        fecha_fin: "",
        fecha_inicio: "",
    },
];

export default function Page() {
    const { id } = useParams();
    const nav = useNavigate();

    const [data, setData] = useState<OlimpiadaData | null>(null);
    const [loading, setLoading] = useState(true);

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
            if (res.data.olimpiada.cronogramas.length > 0){
                setCronos(res.data.olimpiada.cronogramas)
            }else{
                CronogramaDefecto[0].fecha_inicio = res.data.olimpiada.fecha_inicio
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
    const vStart = new Date(olimpiada.fecha_inicio);
    const vEnd = new Date(olimpiada.fecha_fin);

    // al seleccionar fecha en el calendario
    function onSelectDate(
        index: number,
        date: Date,
        tipo: string,
        field: "fecha_inicio" | "fecha_fin"
    ) {
        setCronos((prev) =>
            prev.map((c, i) => {
                if (c.tipo_plazo === tipo) {
                    return {
                        ...c,
                        [field]: date.toISOString().slice(0, 10),
                    };
                }
                // auto-asignar fecha_inicio de la siguiente fase
                if (field === "fecha_fin" && i === index + 1) {
                    return {
                        ...c,
                        fecha_inicio: date.toISOString().slice(0, 10),
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
            await axios.put(`${API_URL}/api/cronogramas`, cronos);
            toast.success("Se registró el rango de fechas exitosamente.");
            nav(`/admin/olimpiadas/${id}`);
        } catch {
            toast.error("Error al guardar. Inténtalo de nuevo.");
        }
    }
    const getTipoPlazoLabel = (text: string) => {
        return text
            .split(" ")
            .map((t) => t.at(0)?.toUpperCase() + t.slice(1) + " ");
    };

    return (
        <div className="container mx-auto p-6">
            <Toaster />

            <h1 className="text-2xl font-bold mb-4">
                {olimpiada.nombre} – {olimpiada.gestion}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
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
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fase</TableHead>
                        <TableHead>Inicio</TableHead>
                        <TableHead>Fin</TableHead>
                        <TableHead>Duracion</TableHead>
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

                                {/* Fecha inicio */}
                                <TableCell>
                                    <span>
                                    
                                        {c.fecha_inicio
                                            ? formatDate(c.fecha_inicio)
                                            : ""}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center"
                                            >
                                                <CalendarIcon className="w-4 h-4 mr-1" />
                                                {c.fecha_fin
                                                    ? formatDate(c.fecha_fin)
                                                    : "Seleccione fecha"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0">
                                            <Calendar
                                                mode="single"
                                                selected={new Date(c.fecha_fin)}
                                                onSelect={(d) =>
                                                    d &&
                                                    onSelectDate(
                                                        index,
                                                        d,
                                                        c.tipo_plazo,
                                                        "fecha_fin"
                                                    )
                                                }
                                                disabled={(date) => {
                                                    const minEnd = addDays(
                                                        new Date(
                                                            c.fecha_inicio
                                                        ),
                                                        1
                                                    );
                                                    return (
                                                        date < minEnd ||
                                                        date < vStart ||
                                                        date > vEnd
                                                    );
                                                }}
                                                initialFocus
                                                locale={es}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                                <TableCell>
                                    {c.fecha_inicio && c.fecha_fin
                                        ? differenceInCalendarDays(
                                              new Date(c.fecha_fin),
                                              new Date(c.fecha_inicio)
                                          )
                                        : "N/A"}{" "}
                                    días
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <div className="mt-6">
                <Button onClick={onSave}>Guardar Cambios</Button>
            </div>
        </div>
    );
}
