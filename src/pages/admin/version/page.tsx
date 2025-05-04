"use client";

import { Versiones } from "../Versiones";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "@/hooks/useApiRequest";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import { Version } from "@/types/versiones.type";
import Header from "@/components/Header";
import { rutasAdmin } from "../rutas-admin";


const Admin = () => {
    const [versiones, setData] = useState<Version[]>([]);
    const [olimpiada, setOlimpiada] = useState<boolean>(false);

    const getData = async () => {
        setOlimpiada(true);
        axios
            .get<Version[]>(`${API_URL}/api/olimpiadas`)
            .then((response) => {
                setData(response.data);
            })
            .catch((error: unknown) => {
                console.error("Error fetching versiones:", error);
            })
            .finally(() => {
                setOlimpiada(false);
            });
    };

    useEffect(() => {
        getData();
    }, []);

    if (olimpiada) {
        return <Loading />;
    }
    return (
        <>
            <Header rutas={rutasAdmin}/>
            <div className="flex flex-col min-h-screen">
                <div className="w-full p-4 md:w-4/5 mx-auto">
                    <h1 className="text-4xl font-bold text-center py-4">
                        Seleccione una olimpiada para ver mas detalles
                    </h1>
                    {versiones.length > 0 ? (
                        <Versiones versiones={versiones} />
                    ) : (
                        <p className="text-center text-gray-500">
                            No hay versiones disponibles aún.
                        </p>
                    )}
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Admin;
