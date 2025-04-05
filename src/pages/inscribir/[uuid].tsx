import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CreateList } from "./CreateList";
import { DataTable } from "./TableList";
import { columns, ListaPostulantes } from "./columns";
import { useEffect, useState } from "react";
import { getListasPostulantes } from "@/utils/apiUtils";
import { useParams } from "react-router-dom";
import ShareUrl from "./ShareUrl";
const Page = () => {
    const [data, setData] = useState<ListaPostulantes[]>([]);
    const { uuid } = useParams();
    useEffect(() => {
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
        fetchData();
    }, []);

    return (
        <>
            <div className="container mx-auto my-10">
                <Card>
                    <CardTitle>
                        <h1 className="text-2xl font-bold text-center">
                            Listas de Postulantes
                        </h1>
                    </CardTitle>
                    <CardContent className="space-y-5">
                        <CreateList />
                        <DataTable columns={columns} data={data} />
                    </CardContent>
                </Card>
            </div>
            <ShareUrl/>
        </>
    );
};

export default Page;
