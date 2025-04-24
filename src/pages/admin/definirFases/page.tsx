"use client";

import { Versiones } from "./VersionSelect";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "@/hooks/useApiRequest";
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
      <div className="flex flex-col min-h-screen">
        <div className="w-full p-4 md:w-4/5 mx-auto">
          <h1 className="text-4xl font-bold text-center py-4">
            Seleccione una olimpiada para definir fases
          </h1>
          {versiones.length > 0 ? (
            <Versiones versiones={versiones} />
          ) : (
            <p className="text-center text-gray-500">No hay versiones disponibles aún.</p>
          )}
        </div>
        <Footer />
      </div>
    );
};

export default Admin;
