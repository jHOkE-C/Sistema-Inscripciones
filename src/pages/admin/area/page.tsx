import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import FormAddArea from "./FormAddArea";
import ListArea, { type Area } from "./ListArea";
import { useApiRequest } from "@/hooks/useApiRequest";
import { AlertComponent } from "@/components/AlertComponent";

export const Page = () => {
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

    useEffect(() => {
        request("GET");
    }, [request]);

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
        await request("POST", data);
        if (error) {
            showAlert("Error", "No se pudo agregar el área", "destructive");
        } else {
            showAlert(
                "Área creada",
                "Se agregó el área correctamente",
                "default"
            );
        }
    };

    const handleDeleteArea = async (id: number) => {
        await request("DELETE", undefined, `/${id}`);
        if (error) {
            showAlert("Error", "No se pudo eliminar el área", "destructive");
        } else {
            showAlert(
                "Área eliminada",
                "Se eliminó el área correctamente",
                "default"
            );
            refreshAreas();
        }
    };

    return (
        <div className="w-4/5 mx-auto mt-10">
            <Card>
                <CardTitle>
                    <h1 className="text-4xl font-bold text-center py-5">
                        Gestión de Áreas
                    </h1>
                </CardTitle>
                <CardContent>
                    <FormAddArea onAdd={handleAddArea} />
                    <ListArea
                        areas={areas}
                        loading={loading}
                        error={error}
                        onDelete={handleDeleteArea}
                    />
                </CardContent>
            </Card>
            {alert && (
                <AlertComponent {...alert} onClose={() => setAlert(null)} />
            )}
        </div>
    );
};

export default Page;
