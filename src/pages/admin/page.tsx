"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import GestionRegistration from "./RegistrarGestion";
import { Versiones } from "./Versiones";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "@/hooks/useApiRequest";

export type Version = {
    id: number;
    nombre: string;
    gestion: string;
    fecha_inicio: string;
    fecha_fin: string;
    created_at: string;
    updated_at: string;
};

const Admin = () => {
    const [versiones, setData] = useState<Version[]>([]);

    const getData = async () => {
        axios
            .get<Version[]>(`${API_URL}/api/olimpiadas`)
            .then((response) => {
                setData(response.data);
                console.log(response.data);
            })
            .catch((error: unknown) => {
                console.error("Error fetching versiones:", error);
            });
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <div className="w-4/5 mx-auto ">
                <h1 className="text-4xl font-bold text-center py-5">
                    Administración de Sistema Oh!Sansi
                </h1>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl flex items-center gap-x-2">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ">
                                <Settings className="h-5 w-5 text-primary" />
                            </div>
                            Gestion de Olimpiada
                        </CardTitle>
                        <CardDescription>
                            Configura la gestion de olimpiadas Oh!Sansi
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Administra y configura las gestiones necesarias para
                            llevar a cabo las olimpiadas de manera eficiente.
                        </p>
                    </CardContent>
                    <CardFooter className="grid space-y-2">
                        <GestionRegistration refresh={() => getData()} />
                        <Link to="/admin/area">
                            <Button
                                className="ml-auto text-sm font-medium w-44"
                                variant={"outline"}
                            >
                                Gestionar Areas
                            </Button>
                        </Link>
                        <Link to="/admin/categorias">
                            <Button
                                className="ml-auto text-sm font-medium w-44"
                                variant={"outline"}
                            >
                                Gestionar Categorias
                            </Button>
                        </Link>
                        <Link to="/admin/area">
                            <Button
                                className="ml-auto text-sm font-medium w-44"
                                variant={"outline"}
                            >
                                Gestionar Postulantes
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
                <Versiones versiones={versiones} />
            </div>
        </>
    );
};

export default Admin;
