import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { AlertComponent } from "@/components/AlertComponent";
import { darDeBajaArea } from "@/api/areas";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import type { Area } from "../ListArea";

import ListArea from "../ListArea";
import { request } from "@/api/request";

export interface Olimpiada {
    id: string;
    nombre: string;
    gestion: string;
    vigente: boolean;
}

export const Page = () => {
    const [alert, setAlert] = useState<{
        title: string;
        description?: string;
        variant?: "default" | "destructive";
    } | null>(null);
    // const getOlimpiadas = async () => {
    //     const data = await request<Olimpiada[]>("/api/olimpiadas");
    //     setOlimpiadas(data);
    // };
    const [areas, setAreas] = useState<Area[]>([]);
    useEffect(() => {
        // getOlimpiadas();
        refreshAreas();
    }, [request]);
    const [error, setError] = useState<string | null>(null);

    const refreshAreas = async () => {
        try {
            const data = await request<Area[]>("/api/areas");
            setAreas(data);
        } catch (e) {
            setError(String(e));
        }
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
            await darDeBajaArea(id);
       
            showAlert(
                "Éxito",
                "Se dio de baja el área correctamente.",
                "default"
            );
            refreshAreas();
        } catch (e) {
            console.log("error");
            showAlert(
                "Error",
                e instanceof Error ? e.message : "Hubo un error",
                "destructive"
            );
        }
    };


    return (
        <>
            <div className="pt-4 px-4">
                <Link to="/admin/area">
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
                            error={error}
                            onDelete={handleDeleteArea}
                            eliminar
                        />
                    </CardContent>
                </Card>
                {alert?.description && (
                    <AlertComponent {...alert} onClose={() => setAlert(null)} />
                )}
            </div>
        </>
    );
};

export default Page;
