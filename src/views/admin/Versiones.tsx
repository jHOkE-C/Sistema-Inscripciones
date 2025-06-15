import {
    CalendarDays,
    Clock,
    Search,
    ListFilter,
    ArrowDownUp,
} from "lucide-react";
import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Version } from "@/models/interfaces/versiones.type";
import { Link } from "react-router-dom";
import { formatDate } from "../../models/interfaces/types";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useVersionesViewModel } from "@/viewModels/admin/useVersionesViewModel";

interface VersionesProps {
    versiones: Version[];
    container?: ((version: Version) => React.ReactNode) | React.ReactNode;
}

export function Versiones({
    versiones,
    container = null,
}: VersionesProps) {
    const {
        searchTerm,
        setSearchTerm,
        selectedYear,
        setSelectedYear,
        sortConfig,
        handleSort,
        uniqueYears,
        processedVersiones,
        calculateDurationDisplay
    } = useVersionesViewModel({ versiones });

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {processedVersiones.map((version) => (
                    <Card
                        key={version.id}
                        className="hover:shadow-lg transition-shadow duration-200"
                    >
                        <CardHeader>
                            <CardTitle className="text-xl">
                                {version.nombre}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <CalendarDays className="h-4 w-4 mr-2" />
                                    <span>
                                        {formatDate(version.fecha_inicio)} -{" "}
                                        {formatDate(version.fecha_fin)}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span>
                                        Duración:{" "}
                                        {calculateDurationDisplay(
                                            version.fecha_inicio,
                                            version.fecha_fin
                                        )}{" "}
                                        días
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline">
                                        Gestión {version.gestion}
                                    </Badge>
                                    <Badge
                                        variant={
                                            version.estado === "Activo"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {version.estado}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            {container ? (
                                typeof container === "function" ? (
                                    container(version)
                                ) : (
                                    container
                                )
                            ) : (
                                <Link
                                    to={`/admin/version/${version.id}`}
                                    className="w-full"
                                >
                                    <Button className="w-full">
                                        Ver Detalles
                                    </Button>
                                </Link>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
