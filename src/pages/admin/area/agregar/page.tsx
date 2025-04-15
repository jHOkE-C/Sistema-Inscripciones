import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { useApiRequest } from "@/hooks/useApiRequest";
import { AlertComponent } from "@/components/AlertComponent";
import { crearArea, darDeBajaArea } from "@/api/areas";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import type { Area } from "../ListArea";
import FormAddArea from "../FormAddArea";
import ListArea from "../ListArea";

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
        try {
            await crearArea(data);
            showAlert(
                "Exito",
                "El área de competencia se creo correctamente.",
                "default"
            );
            refreshAreas();
        } catch (error: unknown) {
            showAlert(
                "Error",
                error instanceof Error && error.message
                    ? error.message
                    : "El registro no se guardó, inténtelo de nuevo",
                "destructive"
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

    return (
        <>
            <div className="pt-4 px-4">
                <Link to="/admin">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-1 mb-4"
                    >
                        <ChevronLeft className="h" />
                        Volver
                    </Button>
                </Link>
            </div>
            <div className="w-4/5 mx-auto mt-10">
                <Card>
                    <CardTitle>
                        <h1 className="text-4xl font-bold text-center py-5">
                            Agregar Áreas
                        </h1>
                    </CardTitle>
                    <CardDescription className="mx-auto">
                        Agrega un nuevo area para las olimpiadas
                    </CardDescription>
                    <CardContent>
                        <FormAddArea onAdd={handleAddArea} />
                        <ListArea
                            areas={areas|| []}
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
        </>
    );
};

export default Page;
