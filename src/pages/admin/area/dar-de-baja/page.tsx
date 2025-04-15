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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { request } from "@/api/request";
import { Label } from "@/components/ui/label";

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
    const [olimpiadas, setOlimpiadas] = useState<Olimpiada[]>([]);
    const getOlimpiadas = async () => {
        const data = await request<Olimpiada[]>("/api/olimpiadas");
        setOlimpiadas(data);
    };
    const [idOlimpiada, setOlimpiadaSeleccionada] = useState<string>();
    const [areas, setAreas] = useState<Area[]>([]);
    useEffect(() => {
        getOlimpiadas();
    }, [request]);
    const [error, setError] = useState<string | null>(null);

    const refreshAreas = async () => {
        try {
            const data = await request<Area[]>(
                "/api/areas/categorias/olimpiada/" + idOlimpiada
            );
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
            console.log("normal")
            showAlert(
                "Éxito",
                "El área de competencia se eliminó correctamente.",
                "default"
            );
            refreshAreas();
        } catch (e) {
            console.log("error")
            showAlert("Error", e instanceof Error ? e.message: "Hubo un error", "destructive");
        }
    };
    useEffect(() => {
        if (idOlimpiada) {
            refreshAreas();
        }
    }, [idOlimpiada]);

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
                        <div className="mx-auto">

                        <Label>seleccione una olimpiada</Label>
                        <Select
                            onValueChange={(value) => {
                                setOlimpiadaSeleccionada(value);
                            }}
                            >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Olimpiada" />
                            </SelectTrigger>
                            <SelectContent>
                                {olimpiadas.map(({ id, nombre }) => (
                                    <SelectItem value={id}>{nombre}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                                </div>
                    <CardContent>
                        {idOlimpiada ? (
                            <ListArea
                                areas={areas}
                                error={error}
                                onDelete={handleDeleteArea}
                                eliminar
                            />
                        ) : (
                            <p>Seleccione una olimpiada</p>
                        )}
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
