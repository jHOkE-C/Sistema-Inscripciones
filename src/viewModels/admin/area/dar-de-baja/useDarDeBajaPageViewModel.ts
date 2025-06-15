import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import { toast } from "sonner";

export interface Area {
    id: number;
    nombre: string;
    vigente: boolean;
}

export const useDarDeBajaPageViewModel = () => {
    const [areas, setAreas] = useState<Area[]>([]);
    const [disabledAreas, setDisabledAreas] = useState<Area[]>([]);
    const [selected, setSelected] = useState<Area | null>(null);
    const [action, setAction] = useState<"deactivate" | "activate" | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchAreas = async () => {
        try {
            const { data } = await axios.get<Area[]>(`${API_URL}/api/areas`);
            setAreas(data.filter((a) => a.vigente));
            setDisabledAreas(data.filter((a) => !a.vigente));
        } catch (e) {
            console.error(e);
            toast.error("Error al cargar áreas");
        }
    };

    useEffect(() => {
        fetchAreas();
    }, []);

    const openDialog = (area: Area, act: "deactivate" | "activate") => {
        setSelected(area);
        setAction(act);
        setDialogOpen(true);
    };

    const handleConfirm = async () => {
        if (!selected || !action) return;

        try {
            if (action === "deactivate") {
                await axios.put(
                    `${API_URL}/api/areas/${selected.id}/deactivate`
                );
                toast.success(`Se dio de baja el área "${selected.nombre}"`);
                setAreas((prev) => prev.filter((a) => a.id !== selected.id));
                setDisabledAreas((prev) => [...prev, selected]);
            } else {
                await axios.put(`${API_URL}/api/areas/${selected.id}/activate`);
                toast.success(`Se habilitó el área "${selected.nombre}"`);
                setDisabledAreas((prev) =>
                    prev.filter((a) => a.id !== selected.id)
                );
                setAreas((prev) => [...prev, selected]);
            }
        } catch (e: unknown) {
            console.error(e instanceof Error && e.message);
            toast.error(
                action === "deactivate"
                    ? "Ocurrió un error al dar de baja el área"
                    : "Ocurrió un error al habilitar el área"
            );
        } finally {
            setDialogOpen(false);
            setSelected(null);
            setAction(null);
        }
    };

    return {
        areas,
        disabledAreas,
        selected,
        action,
        dialogOpen,
        setDialogOpen,
        openDialog,
        handleConfirm
    };
}; 