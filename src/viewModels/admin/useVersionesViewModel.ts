import { useState, useMemo } from "react";
import { Olimpiada } from "@/models/interfaces/versiones.type";

interface VersionesProps {
    versiones: Olimpiada[];
    onVersionCardClick?: (id: number, nombre: string) => void; // Changed id to number
    container?: ((version: Olimpiada) => React.ReactNode) | React.ReactNode;
}

export function useVersionesViewModel({ versiones }: VersionesProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [sortConfig, setSortConfig] = useState<{
        key: "nombre" | "fecha_inicio" | "fecha_fin" | "gestion" | "duracion"; // Explicitly defined sortable keys
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

            let valA: string | number | Date | undefined;
            let valB: string | number | Date | undefined;

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

    const handleSort = (key: "nombre" | "fecha_inicio" | "fecha_fin" | "gestion" | "duracion") => { // Explicitly defined sortable keys
        setSortConfig((prevConfig) => ({
            key, // No need for explicit cast if key is already of the correct type
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

    return {
        searchTerm,
        setSearchTerm,
        selectedYear,
        setSelectedYear,
        sortConfig,
        handleSort,
        uniqueYears,
        processedVersiones,
        calculateDurationDisplay
    };
}
