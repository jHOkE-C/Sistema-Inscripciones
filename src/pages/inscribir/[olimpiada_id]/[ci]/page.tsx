import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CreateList } from "../../CreateList";
import { DataTable } from "../../TableList";
import { columns, ListaPostulantes } from "../../columns";
import React, { Suspense, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ShareUrl from "../../ShareUrl";
import { getListasPostulantes } from "@/api/postulantes";
import FormResponsable from "../../FormResponsable";
import NotFoundPage from "../../../404";
import Loading from "@/components/Loading";
import ReturnComponent from "@/components/ReturnComponent";
const FileUploadModal = React.lazy(
    () => import("../../viaExcel/file-upload-modal")
);
import { Download } from "lucide-react";
import Footer from "@/components/Footer";
import { API_URL } from "@/hooks/useApiRequest";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import OrdenPago from "./orden-pago";
//import type { Olimpiada } from "@/pages/carousel";
//import { getOlimpiada } from "@/api/olimpiada";

type Olimpiada = {
    id: number;
    nombre: string;
    gestion: string;
    fecha_inicio: string;
    fecha_fin: string;
    vigente: boolean;
    url_plantilla: string;
};

const Page = () => {
    const [data, setData] = useState<ListaPostulantes[]>([]);
    const { ci, olimpiada_id } = useParams();
    const [openFormResponsable, setOpenFormResponsable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [olimpiada, setOlipiada] = useState<Olimpiada>();

    const getData = async () => {
        //if (!olimpiada_id || !ci) return;
        try {
            const response = await axios.get<Olimpiada>(
                `${API_URL}/api/olimpiadas/${1}`
            );
            setOlipiada(response.data);
            console.log(response.data);
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        getData();
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
            setData(data.filter(({ olimpiada_id: id }) => id == '1'));
        } catch {
            setOpenFormResponsable(true);
        } finally {
            setLoading(false);
        }
    };
    const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const url = `${API_URL}/storage/${olimpiada?.url_plantilla}`;
        console.log(url);
        const link = document.createElement("a");
        link.href = url;
        link.download = "lista-postulantes.xlsx";
        link.click();
    };
    const fetchData = async () => {
        try {
            refresh();
        } catch {
            console.error("Error al obtener las listas de postulantes");
        }
    };
    
    const columnsWithActions: ColumnDef<ListaPostulantes, unknown>[] = [
        ...columns,
        {
            id: "acciones",
            header: "Acciones",
            cell: ({ row }) =>
                row.original.estado === "Pago Pendiente" ? (
                    <OrdenPago codigo={row.getValue("codigo_lista")}/>
                ) : (
                    <Link
                        to={`/inscribir/${olimpiada_id}/${ci}/${row.getValue(
                            "codigo_lista"
                        )}`}
                    >
                        <Button variant={"link"}>Abrir lista</Button>
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
                <ReturnComponent to={`/`} />
            </div>

            <div className="m py-5">
                <div className="container mx-auto ">
                    <Card className="border-0 shadow-white">
                        <CardTitle>
                            <h1 className="text-3xl font-bold text-center">
                                Listas de Postulantes
                            </h1>
                        </CardTitle>
                        <CardContent className="space-y-5 justify-between">
                            <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
                                {olimpiada?.url_plantilla && (
                                    <button
                                        onClick={(e) => handleDownload(e)}
                                        className="text-sm inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors hover:underline underline-offset-2"
                                    >
                                        <Download className="h-4 w-4" />
                                        <span>
                                            Descargar plantilla de Excel
                                        </span>
                                    </button>
                                )}
                                <div className="flex gap-2 items-center">
                                    <Suspense fallback={<Loading />}>
                                        <FileUploadModal
                                            maxFiles={1}
                                            maxSize={10}
                                            accept=".xlsx,.xls"
                                            onFilesChange={(files) =>
                                                console.log(
                                                    "Files changed:",
                                                    files
                                                )
                                            }
                                            triggerText="Añadir archivo Excel"
                                            title="Añadir archivo Excel"
                                            description="Selecciona un archivo de Excel de tu dispositivo o arrástralo y suéltalo aquí."
                                            olimpiadaP={
                                                olimpiada ? [olimpiada] : []
                                            }
                                        />
                                    </Suspense>

                                    <CreateList
                                        refresh={fetchData}
                                        number={data.length + 1}
                                    />
                                </div>
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
