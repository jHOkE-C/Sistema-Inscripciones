import Footer from "@/components/Footer";
import ReturnComponent from "@/components/ReturnComponent";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { columns, type ListaPostulantes } from "@/pages/inscribir/columns";
import ShareUrl from "@/pages/inscribir/ShareUrl";
import { DataTable } from "@/pages/inscribir/TableList";
import type { ColumnDef } from "@tanstack/react-table";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFoundPage from "@/pages/404";
import { crearListaPostulante, getListasPostulantes } from "@/api/postulantes";
import Loading from "@/components/Loading";
import FormResponsable from "@/pages/inscribir/FormResponsable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Page = () => {
    const [data, setData] = useState<ListaPostulantes[]>([]);

    const [openFormResponsable, setOpenFormResponsable] = useState(false);
    const [loading, setLoading] = useState(false);
    const { ci, olimpiada_id } = useParams();
    useEffect(() => {
        if (ci && ci.length >= 7 && ci.length <= 10) fetchData();
    }, []);

    if (!ci || ci.length < 7 || ci.length > 10) {
        return <NotFoundPage />;
    }
    if (!olimpiada_id) return;

    const refresh = async () => {
        setLoading(true);
        try {
            const { data } = await getListasPostulantes(ci);
            setData(data.filter(({ olimpiada_id: id }) => id == olimpiada_id));
        } catch {
            setOpenFormResponsable(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            refresh();
        } catch {
            console.error("Error al obtener las inscripciones de postulantes");
        }
    };

    const columnsWithActions: ColumnDef<ListaPostulantes, unknown>[] = [
        ...columns,
    ];

    if (loading) return <Loading />;
    if (openFormResponsable)
        return (
            <FormResponsable
                onClose={() => {
                    setOpenFormResponsable(false);
                }}
            />
        );
    const crearLista = async () => {
        setLoading(true);
        try {
            await crearListaPostulante({
                ci,
                olimpiada_id,
            });
            refresh();
            toast.success("La inscripcion se creó correctamente.");
        } catch {
            toast.error("No se pudo registrar la inscripcion. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex flex-col min-h-screen">
            <div className="p-2">
                <ReturnComponent />
            </div>
            <div className="m py-5">
                <div className="container mx-auto ">
                    <Card className="border-0 shadow-white">
                        <CardTitle>
                            <h2 className="text-3xl font-bold text-center">
                                Listas de Postulantes
                            </h2>
                        </CardTitle>
                        <CardContent className="space-y-5 justify-between">
                            <div className="flex gap-2 items-center justify-end">
                                <Button onClick={crearLista}>
                                    Crear Lista
                                </Button>
                            </div>
                            <DataTable
                                columns={columnsWithActions}
                                data={data}
                            />
                        </CardContent>
                    </Card>
                </div>
                <ShareUrl />
            </div>

            <Footer />
        </div>
    );
};

export default Page;
