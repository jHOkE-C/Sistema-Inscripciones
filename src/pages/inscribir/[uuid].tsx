import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CreateList } from "./CreateList";
import { DataTable } from "./TableList";
import { columns, ListaPostulantes } from "./columns";
import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import ShareUrl from "./ShareUrl";
import { getListasPostulantes } from "@/api/postulantes";

const Page = () => {
    const [data, setData] = useState<ListaPostulantes[]>([]);
    const { uuid } = useParams();

    const fetchData = async () => {
        try {
            if (!uuid) {
                throw new Error("UUID no encontrado en la URL");
            }
            const data = await getListasPostulantes(uuid);
            setData(data);
        } catch {
            console.error("Error al obtener las listas de postulantes");
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="min-h-screen py-10">
                <div className="container mx-auto ">
                    <Card>
                        <CardTitle>
                            <h1 className="text-2xl font-bold text-center">
                                Listas de Postulantes
                            </h1>
                        </CardTitle>
                        <CardContent className="space-y-5">
                            <CreateList refresh={fetchData} number={data.length} />
                            <DataTable columns={columns} data={data} />
                        </CardContent>
                    </Card>
                </div>
                <ShareUrl />
            </div>
        </>
    );
};

export default Page;
