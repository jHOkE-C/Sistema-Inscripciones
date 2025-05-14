"use client";

import { Versiones } from "../Versiones";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "@/hooks/useApiRequest";
import Footer from "@/components/Footer";
import ReturnComponent from "@/components/ReturnComponent";
import Loading from "@/components/Loading";
import { Version } from "@/types/versiones.type";
import ModalPdf from "./modalPdf";
import { Button } from "@/components/ui/button";

const Admin = () => {
    const [versiones, setData] = useState<Version[]>([]);
    const [olimpiada, setOlimpiada] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedGestion, setSelectedGestion] = useState<string | null>(null);
    const [nombreOlimpiada, setNombreOlimpiada] = useState<string>("");

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

    const handleAbrirModalConGestion = (gestionId: string, nombre: string) => {
        console.log("gestionId", gestionId);
        console.log("nombre", nombre);
        setSelectedGestion(gestionId);
        setNombreOlimpiada(nombre);
        setIsModalOpen(true);
        
    };

    if (olimpiada) {
        return <Loading />;
    }
    return (
        <>
            <ReturnComponent  />
            <div className="flex flex-col min-h-screen">
                <div className="w-full p-4 md:w-4/5 mx-auto">
                    <h1 className="text-4xl font-bold text-center py-4">
                        Seleccione una olimpiada para Generar el Reporte deseado
                    </h1>
                    {versiones.length > 0 ? (
                        <Versiones
                            versiones={versiones}
                            container={(version: Version) => (
                                <div className="flex justify-center">
                                    <Button onClick={() => handleAbrirModalConGestion(version.id.toString(), version.nombre)}>
                                        Generar Reporte
                                    </Button>
                                </div>
                            )}
                        />
                    ) : (
                        <p className="text-center text-gray-500">
                            No hay versiones disponibles aún.
                        </p>
                    )}
                </div>
                <Footer />
            </div>
            {selectedGestion && (
                <ModalPdf
                    gestion={selectedGestion}
                    isOpen={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    nombreOlimpiada={nombreOlimpiada}
                />
            )}
        </>
    );
};

export default Admin;
