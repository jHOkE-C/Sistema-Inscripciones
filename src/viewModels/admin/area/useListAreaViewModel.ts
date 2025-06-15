import { useState } from "react";
import { type Area } from "@/models/api/areas";

interface ListAreaProps {
    areas: Area[];
    onDelete: (id: number) => void;
}

export const useListAreaViewModel = ({ areas, onDelete }: ListAreaProps) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [areaSeleccionada, setAreaSeleccionada] = useState<Area | null>(null);

    const confirmarEliminacion = (area: Area) => {
        setAreaSeleccionada(area);
        setShowConfirm(true);
        areas.sort((a, b) => Number(b.vigente) - Number(a.vigente));
    };

    const eliminarArea = async () => {
        if (areaSeleccionada) await onDelete(Number(areaSeleccionada.id));
        setShowConfirm(false);
    };

    return {
        showConfirm,
        setShowConfirm,
        areaSeleccionada,
        confirmarEliminacion,
        eliminarArea
    };
}; 