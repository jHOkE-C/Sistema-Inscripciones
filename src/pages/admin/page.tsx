"use client";

import { Versiones } from "./Versiones";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "@/hooks/useApiRequest";
import Botones from "./botones";
import Footer from "@/components/Footer";

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
            <div className="w-full p-4 md:w-4/5 mx-auto ">
                <h1 className="text-4xl font-bold text-center py-4">
                    Panel de Administración
                </h1>
               <Botones getData={() => getData()}/>
                <h2 className="text-2xl font-bold text-center py-4">
                    Versiones de la Olimpiada
                </h2>
                <Versiones versiones={versiones} />
            </div>
                <Footer />
        </>
    );
};

export default Admin;
