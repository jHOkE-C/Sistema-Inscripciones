import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CreateList } from "./CreateList";
import { DataTable } from "./TableList";
import { columns, ListaPostulantes } from "./columns";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShareUrl from "./ShareUrl";
import { getListasPostulantes } from "@/api/postulantes";
import FormRepresentante from "./FormRepresentante";
import { getRepresentante } from "@/api/representantes";
import NotFoundPage from "../404";

const Page = () => {
    const [data, setData] = useState<ListaPostulantes[]>([]);
    const { ci } = useParams();
    const [openFormRepresentante, setOpenFormRepresentante] = useState(false);
    useEffect(() => {
        fetchData();
    }, []);

    if (!ci || ci.length < 7) {
        return <NotFoundPage />;
    }

    const refresh = async () => {
        const data = await getListasPostulantes(ci);

        setData(data);
    };
    const fetchData = async () => {
        try {
            const representante = await getRepresentante(ci);
            if (!representante) {
                setOpenFormRepresentante(true);
                return;
            }
            refresh();
        } catch {
            console.error("Error al obtener las listas de postulantes");
        }
    };

    return (
        <>
            {openFormRepresentante && (
                <FormRepresentante
                    onClose={() => setOpenFormRepresentante(false)}
                />
            )}
            <div className="min-h-screen py-10">
                <div className="container mx-auto ">
                    <Card>
                        <CardTitle>
                            <h1 className="text-2xl font-bold text-center">
                                Listas de Postulantes
                            </h1>
                        </CardTitle>
                        <CardContent className="space-y-5">
                            <CreateList
                                refresh={fetchData}
                                number={data.length}
                            />
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
