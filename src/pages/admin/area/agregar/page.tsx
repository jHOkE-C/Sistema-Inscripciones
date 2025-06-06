import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { useApiRequest } from "@/viewModels/hooks/useApiRequest";
import { AlertComponent } from "@/components/AlertComponent";
import { crearArea, darDeBajaArea } from "@/models/api/areas";
import type { Area } from "../ListArea";
import FormAddArea from "../FormAddArea";
import ListArea from "../ListArea";
import { toast } from "sonner";
import Header from "@/components/Header";
import { rutasAdmin } from "../../rutas-admin";
import Footer from "@/components/Footer";
import ReturnComponent from "@/components/ReturnComponent";

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
            toast.success("El área de competencia se creó correctamente.");
            refreshAreas();
        } catch (error: unknown) 
        {
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

    return (
        <div className="flex flex-col min-h-screen">
        <Header rutas={rutasAdmin}/>
        <ReturnComponent to={`..\\..\\`}/>
            <div className="w-4/5 mx-auto my-6">
                
                <Card>
                    <CardTitle>
                        <h2 className="text-4xl font-bold text-center py-5">
                            Agregar Áreas
                        </h2>
                    </CardTitle>
                    <CardDescription className="mx-auto">
                        Agrega una nueva area para las olimpiadas Oh!SanSi
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
            <Footer />
        </div>
    );
};

export default Page;
