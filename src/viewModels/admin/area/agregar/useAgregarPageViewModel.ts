import { useState } from "react";
import { useApiRequest } from "@/viewModels/hooks/useApiRequest";
import { crearArea, darDeBajaArea } from "@/models/api/areas";
import type { Area } from "@/models/api/areas";
import { toast } from "sonner";

export const useAgregarPageViewModel = () => {
    const {
        data: areas,
        loading,
        error,
        request,
    } = useApiRequest<Area[]>("/api/areas");

    const [alert, setAlert] = useState<{
        title: string;
        description?: string;
        variant?: "default" | "destructive";
    } | null>(null);

    const refreshAreas = async () => {
        await request("GET");
    };

    const showAlert = (
        title: string,
        description?: string,
        variant?: "default" | "destructive"
    ) => {
        setAlert({ title, description, variant });
    };

    const handleAddArea = async (data: { nombre: string }) => {
        try {
            await crearArea(data);
            toast.success("El área de competencia se creó correctamente.");
            refreshAreas();
        } catch (error: unknown) {
            toast.error(
                error instanceof Error && error.message
                    ? error.message
                    : "El registro no se guardó, inténtelo de nuevo"
            );
        }
    };

    const handleDeleteArea = async (id: number) => {
        try {
            await darDeBajaArea(id);
            showAlert(
                "Éxito",
                "El área de competencia se eliminó correctamente.",
                "default"
            );
            refreshAreas();
        } catch {
            showAlert(
                "Error",
                "Hubo un error al eliminar el área, inténtelo de nuevo",
                "destructive"
            );
        }
    };

    return {
        areas,
        loading,
        error,
        alert,
        setAlert,
        handleAddArea,
        handleDeleteArea,
        request
    };
}; 