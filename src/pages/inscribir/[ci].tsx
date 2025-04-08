import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CreateList } from "./CreateList";
import { DataTable } from "./TableList";
import { columns, ListaPostulantes } from "./columns";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShareUrl from "./ShareUrl";
import { getListasPostulantes } from "@/api/postulantes";
import FormResponsable from "./FormResponsable";
import NotFoundPage from "../404";
import { AlertComponent } from "@/components/AlertComponent";
import Loading from "@/components/Loading";

const Page = () => {
    const [data, setData] = useState<ListaPostulantes[]>([]);
    const { ci } = useParams();
    const [openFormResponsable, setOpenFormResponsable] = useState(false);
    const [error, setError] = useState<string | null>();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (ci && ci.length >= 7 && ci.length <= 10) fetchData();
    }, []);

    if (!ci || ci.length < 7 || ci.length > 10) {
        return <NotFoundPage />;
    }

    const refresh = async () => {
        setLoading(true);
        try {
            const data = await getListasPostulantes(ci);
            console.log(data);
            setData(data.data);
        } catch {
            //setError(e instanceof Error ? e.message : "error desconocido");
            setOpenFormResponsable(true);
        } finally {
            setLoading(false);
        }
    };
    const fetchData = async () => {
        try {
            refresh();
        } catch {
            console.error("Error al obtener las listas de postulantes");
        }
    };
    if (loading) return <Loading />;
    return (
        <>
            {openFormResponsable && (
                <FormResponsable
                    onClose={() => {
                        setOpenFormResponsable(false);
                        setSuccess("¡Registro de Responsable Exitoso!");
                    }}
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
                                number={data.length + 1}
                            />
                            <DataTable columns={columns} data={data} />
                        </CardContent>
                    </Card>
                </div>
                <ShareUrl />
            </div>
            {error && (
                <AlertComponent
                    description={error}
                    variant="destructive"
                    onClose={() => setError(null)}
                />
            )}
            {success && (
                <AlertComponent
                    description={success}
                    onClose={() => setSuccess(null)}
                />
            )}
        </>
    );
};

export default Page;
