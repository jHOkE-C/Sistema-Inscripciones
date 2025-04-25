import axios from "axios";
import { API_URL } from "@/hooks/useApiRequest";

import { Versiones } from "../Versiones";
import { useEffect, useState } from "react";
import type { Version } from "../page";

const Page = () => {
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
            <div className="flex flex-col min-h-screen">
                <div className="w-full p-4 md:w-4/5 mx-auto">
                    <h2 className="text-2xl font-bold text-center py-4">
                        Versiones de la Olimpiada
                    </h2>
                    {versiones.length > 0 ? (
                        <Versiones versiones={versiones} />
                    ) : (
                        <p className="text-center text-gray-500">
                            No hay versiones disponibles aún.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Page;
