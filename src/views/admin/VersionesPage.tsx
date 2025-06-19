"use client";

import { Versiones } from "@/views/admin/Versiones";
import Footer from "@/components/Footer";
import ReturnComponent from "@/components/ReturnComponent";
import Loading from "@/components/Loading";
import Header from "@/components/Header";
import { useVersionesPageViewModel, type VersionesPageProps } from "@/viewModels/usarVistaModelo/privilegios/useVersionesPageViewModel";

export default function VersionesPage({
    title,
    returnTo = "/admin",
    queVersiones = [],
    filter,
    textoBoton,
}: VersionesPageProps) {
    const { versiones, loading } = useVersionesPageViewModel({
        title,
        queVersiones,
        filter,
    });

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <Header/>
            <ReturnComponent to={returnTo} />
            <div className="flex flex-col min-h-screen">
                <div className="w-full pt-4 pb-4 md:w-5/6 mx-auto">
                
                    <h2 className="text-4xl font-bold text-center py-4">
                        {title}
                    </h2>
                    {versiones.length > 0 ?
                        (
                            <Versiones versiones={versiones} textoBoton={textoBoton} />
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
