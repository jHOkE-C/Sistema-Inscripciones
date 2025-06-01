import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { DataTable } from "../../../TableList";
import { columns, ListaPostulantes } from "../../../columns";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ShareUrl from "../../../ShareUrl";
import { getListasPostulantes } from "@/api/postulantes";
import FormResponsable from "../../../FormResponsable";
import NotFoundPage from "../../../../404";
import Loading from "@/components/Loading";
import ReturnComponent from "@/components/ReturnComponent";


import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import OrdenPago from "../orden-pago";
import DescargarPlantilla from "@/components/DescargarPlantilla";
import { useOlimpiada } from "@/hooks/getCacheResponsable/useOlimpiadas";
const Page = () => {
    const [data, setData] = useState<ListaPostulantes[]>([]);
    const [openFormResponsable, setOpenFormResponsable] = useState(false);
    const [loading, setLoading] = useState(false);
    const { ci, olimpiada_id } = useParams();
    const { data: olimpiada, isLoading: olimpiadaLoading, isError: olimpiadaError } = useOlimpiada(Number(olimpiada_id));

    useEffect(() => {
        if (ci && ci.length >= 7 && ci.length <= 10) fetchData();
    }, []);

    useEffect(() => {
        if (olimpiadaError) {
            console.error("Error al obtener olimpiada");
        }
    }, [olimpiadaError]);

    if (!ci || ci.length < 7 || ci.length > 10) {
        return <NotFoundPage />;
    }
    if (!olimpiada_id || olimpiadaLoading) return <Loading />;

    const refresh = async () => {
        setLoading(true);
        try {
            const { data } = await getListasPostulantes(ci);
            const filtrados = data.filter(
                ({ olimpiada_id: id }) => id == olimpiada_id
            );
            console.log(filtrados);
            const excel = filtrados.filter(
                ({ estado }) => estado == "Preinscrito"
            );
            setData(excel);
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
        {
            id: "acciones",
            header: "Acciones",
            cell: ({ row }) =>
                row.original.estado === "Pago Pendiente" ? (
                    <OrdenPago codigo_lista={row.getValue("codigo_lista")} />
                ) : (
                    <Link
                        to={`/inscribir/${olimpiada_id}/${ci}/${row.getValue(
                            "codigo_lista"
                        )}`}
                    >
                        <Button variant={"link"}>Abrir inscripcion</Button>
                    </Link>
                ),
        },
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
                                Incripciones de Postulantes
                            </h2>
                        </CardTitle>
                        <CardContent className="space-y-5 justify-between">
                            <div className="flex justify-between">
                                {olimpiada && (
                                    <DescargarPlantilla olimpiada={olimpiada} />
                                )}
                                {/* <InscribirExcel /> */}
                            </div>
                            <DataTable
                                goToCode
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
