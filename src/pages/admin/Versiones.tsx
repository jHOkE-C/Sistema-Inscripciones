import {
    CalendarDays,
    Clock,
    Search,
    ListFilter,
    ArrowDownUp,
} from "lucide-react";
import { useState, useMemo } from "react";
import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Version } from "@/types/versiones.type";
import { Link } from "react-router-dom";
import { formatDate } from "./version/[id]/types";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface VersionesProps {
    versiones: Version[];
    onVersionCardClick?: (id: string, nombre: string) => void;
    container?: ((version: Version) => React.ReactNode) | React.ReactNode;
}

export function Versiones({
    versiones,
    onVersionCardClick,
    container = null,
}: VersionesProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Version | "duracion";
        direction: "asc" | "desc";
    }>({
        key: "fecha_inicio",
        direction: "desc",
    });

    const uniqueYears = useMemo(() => {
        const years = new Set(versiones.map((v) => v.gestion.toString()));
        return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
    }, [versiones]);

    const calculateDurationValue = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const processedVersiones = useMemo(() => {
        let filtered = [...versiones];

        // Filtrar por año
        if (selectedYear && selectedYear !== "all") {
            filtered = filtered.filter(
                (v) => v.gestion.toString() === selectedYear
            );
        }

        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (v) =>
                    v.nombre.toLowerCase().includes(lowerSearchTerm) ||
                    v.gestion.toString().toLowerCase().includes(lowerSearchTerm)
            );
        }

        filtered.sort((a, b) => {
            let valA, valB;

            if (sortConfig.key === "duracion") {
                valA = calculateDurationValue(a.fecha_inicio, a.fecha_fin);
                valB = calculateDurationValue(b.fecha_inicio, b.fecha_fin);
            } else {
                valA = a[sortConfig.key];
                valB = b[sortConfig.key];
            }

            if (typeof valA === "string" && typeof valB === "string") {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }

            if (
                sortConfig.key === "fecha_inicio" ||
                sortConfig.key === "fecha_fin"
            ) {
                valA = new Date(valA as string);
                valB = new Date(valB as string);
            }

            if (valA && valB) {
                if (valA < valB) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
            }
            return 0;
        });

        return filtered;
    }, [versiones, searchTerm, selectedYear, sortConfig]);

    const handleSort = (key: keyof Version | "duracion") => {
        setSortConfig((prevConfig) => ({
            key,
            direction:
                prevConfig.key === key && prevConfig.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    const calculateDurationDisplay = (startDate: string, endDate: string) => {
        const diffDays = calculateDurationValue(startDate, endDate);
        return diffDays;
    };

    return (
        <div>
            <div className="mb-6 p-4 bg-card border rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    {/* Search Input */}
                    <div>
                        <label
                            htmlFor="search"
                            className="block text-sm font-medium text-muted-foreground mb-1"
                        >
                            <Search className="inline-block h-4 w-4 mr-1" />
                            Buscar por Nombre o Gestión
                        </label>
                        <Input
                            id="search"
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Year Filter */}
                    <div>
                        <label
                            htmlFor="year-filter"
                            className="block text-sm font-medium text-muted-foreground mb-1"
                        >
                            <ListFilter className="inline-block h-4 w-4 mr-1" />
                            Filtrar por Año (Gestión)
                        </label>
                        <Select
                            value={selectedYear}
                            onValueChange={setSelectedYear}
                        >
                            <SelectTrigger id="year-filter" className="w-full">
                                <SelectValue placeholder="Todos los años" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Todos los años
                                </SelectItem>
                                {uniqueYears.map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort Options */}
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            <ArrowDownUp className="inline-block h-4 w-4 mr-1" />
                            Ordenar por
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={
                                    sortConfig.key === "nombre"
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => handleSort("nombre")}
                                size="sm"
                            >
                                Nombre{" "}
                                {sortConfig.key === "nombre" &&
                                    (sortConfig.direction === "asc"
                                        ? "A-Z"
                                        : "Z-A")}
                            </Button>
                            <Button
                                variant={
                                    sortConfig.key === "fecha_inicio"
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => handleSort("fecha_inicio")}
                                size="sm"
                            >
                                Fecha{" "}
                                {sortConfig.key === "fecha_inicio" &&
                                    (sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓")}
                            </Button>
                            <Button
                                variant={
                                    sortConfig.key === "gestion"
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => handleSort("gestion")}
                                size="sm"
                            >
                                Gestión{" "}
                                {sortConfig.key === "gestion" &&
                                    (sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓")}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {processedVersiones.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    No se encontraron versiones que coincidan con los filtros
                    aplicados.
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 py-2">
                {processedVersiones.map((event) => (
                    <Link
                        to={`${
                            typeof container === "function" ? "#" : event.id
                        }`}
                        key={event.id}
                        onClick={(e) => {
                            if (onVersionCardClick) {
                                e.preventDefault();
                                onVersionCardClick(
                                    event.id.toString(),
                                    event.nombre
                                );
                            }
                        }}
                    >
                        <Card
                            className={` h-full  border-2 transition-all duration-200 ease-in-out
                                transform  ${
                                    typeof container === "function"
                                        ? "cursor-default"
                                        : "hover:scale-105 hover:text-primary hover:border-primary"
                                }`}
                        >
                            <CardHeader>
                                <div className="flex items-center ml-5">
                                    <CardTitle className="text-xl">
                                        {event.nombre}
                                    </CardTitle>
                                    <Badge
                                        variant="outline"
                                        className="ml-2 whitespace-nowrap"
                                    >
                                        {event.gestion}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                {typeof container === "function"
                                    ? container(event)
                                    : container || (
                                          <>
                                              <div className="flex items-center gap-2">
                                                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                                  <div>
                                                      <p className="text-sm font-medium">
                                                          Fecha de inicio:
                                                      </p>
                                                      <p className="text-sm text-muted-foreground">
                                                          {formatDate(
                                                              event.fecha_inicio
                                                          )}
                                                      </p>
                                                  </div>
                                                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                                  <div>
                                                      <p className="text-sm font-medium">
                                                          Fecha de fin:
                                                      </p>
                                                      <p className="text-sm text-muted-foreground">
                                                          {formatDate(
                                                              event.fecha_fin
                                                          )}
                                                      </p>
                                                  </div>
                                              </div>
                                          </>
                                      )}
                            </CardContent>
                            <CardFooter className="border-t pt-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground ml-5">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                        Duración:{" "}
                                        {calculateDurationDisplay(
                                            event.fecha_inicio,
                                            event.fecha_fin
                                        )}{" "}
                                        días
                                    </span>
                                </div>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
