import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { useApiRequest } from "@/hooks/useApiRequest";
import { AlertComponent } from "@/components/AlertComponent";
import { eliminarArea } from "@/api/areas";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import type { Area } from "../ListArea";

import ListArea from "../ListArea";

export const Page = () => {
    const {
        data: areas,
        loading,
        error,
        request,
    } = useApiRequest<Area[]>("/api/areas/categorias");
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

    const handleDeleteArea = async (id: number) => {
        try {
            await eliminarArea(id);
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
                            Dar Áreas de baja
                        </h1>
                    </CardTitle>
                    <CardDescription className="mx-auto">
                        Da de baja un area para las olimpiadas
                    </CardDescription>
                    <CardContent>
                        <ListArea
                            areas={areas}
                            loading={loading}
                            error={error}
                            onDelete={handleDeleteArea}
                            eliminar
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
