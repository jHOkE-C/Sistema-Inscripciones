"use client";

import { Versiones } from "@/pages/admin/Versiones";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "@/hooks/useApiRequest";
import Footer from "@/components/Footer";
import ReturnComponent from "@/components/ReturnComponent";
import Loading from "@/components/Loading";
import { Version, VersionFilter } from "@/types/versiones.type";
import Header from "@/components/Header";

export interface VersionesPageProps {
    title: string;
    returnTo?: string;
    queVersiones?: VersionFilter[];
    filter?: (value: Version, index: number, array: Version[]) => unknown;
    container?: ((version: Version) => React.ReactNode) | React.ReactNode;
}

export default function VersionesPage({
    title,
    returnTo = "/admin",
    queVersiones = [],
    filter,
    container,
}: VersionesPageProps) {
    const [versiones, setVersiones] = useState<Version[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        console.log(filter);
        setLoading(true);
        try {
            if (queVersiones.length === 0) {
                const { data } = await axios.get<Version[]>(
                    `${API_URL}/api/olimpiadas`
                );
                if (filter) {
                    setVersiones(data.filter(filter));
                } else {
                    setVersiones(data);
                }
            } else {
                const hayPasadas = queVersiones.includes("pasadas");
                const hayFuturas = queVersiones.includes("futuras");
                const fasesSolicitadas = queVersiones.filter(
                    (f) => f !== "pasadas" && f !== "futuras"
                );
                const hayFases = fasesSolicitadas.length > 0;

                const peticiones: Promise<AxiosResponse<Version[]>>[] = [];
                if (hayPasadas) {
                    peticiones.push(
                        axios.get<Version[]>(
                            `${API_URL}/api/olimpiadas/pasadas`
                        )
                    );
                }
                if (hayFuturas) {
                    peticiones.push(
                        axios.get<Version[]>(
                            `${API_URL}/api/olimpiadas/futuras`
                        )
                    );
                }
                if (hayFases) {
                    peticiones.push(
                        axios.post<Version[]>(
                            `${API_URL}/api/olimpiadas/por-fases`,
                            { fases: fasesSolicitadas }
                        )
                    );
                }

                const respuestas = await Promise.all(peticiones);
                const todasLasVersiones = respuestas.flatMap((r) => r.data);
                setVersiones(todasLasVersiones);
            }
        } catch (error) {
            console.error("Error fetching versiones:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    //por alguna razon si esta loading dentro  no aparece el 70% de las veces
    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <Header/>
            <ReturnComponent to={returnTo} />
            <div className="flex flex-col min-h-screen">
                <div className="w-full p-4 md:w-11/12 mx-auto">
                    <h1 className="text-4xl font-bold text-center py-4">
                        {title}
                    </h1>
                    {versiones.length > 0 ?
                        (
                            <Versiones versiones={versiones} container={container} />
                        ) 
                        : 
                        (
                            <p className="text-center text-gray-500">
                                No hay versiones en fase de Preparación o no hay
                                versiones disponibles aún .
                            </p>
                        )
                    }
                </div>
                <Footer />
            </div>
        </>
    );
}
