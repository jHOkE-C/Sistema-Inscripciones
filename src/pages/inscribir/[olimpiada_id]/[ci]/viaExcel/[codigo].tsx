import { useEffect, useState } from "react";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { getInscritosPorLista } from "@/models/api/postulantes";

import Loading from "@/components/Loading";
import NotFoundPage from "@/pages/404";
import ReturnComponent from "@/components/ReturnComponent";

import type { Postulante } from "../../../../../models/interfaces/columns";
import { ButtonFinalizarRegistro } from "../[codigo_lista]";

export default function Page() {
    const [data, setData] = useState<Postulante[]>([]);
    const { codigo } = useParams();
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editar, setEditar] = useState(false);
    useEffect(() => {
        fetchData();
    }, []);
    if (!codigo) return;

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getInscritosPorLista(codigo);
            setData(data.data);
            console.log(data.estado, data.estado !== "Preinscrito");
            setEditar(data.estado === "Preinscrito");
            setNotFound(false);
        } catch {
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;
    if (notFound) return <NotFoundPage />;

    return (
        <>
            <ReturnComponent />
            <div className="min-h-screen py-5">
                <div className="container mx-auto ">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center">
                                Inscripciones de Postulantes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto space-y-5">
                            <div className="flex justify-between">
                                {editar && (
                                    <>
                                        {/* <InscribirExcel
                                            onSubmit={() => fetchData()}
                                        /> */}
                                        <div></div>
                                        <ButtonFinalizarRegistro
                                            codigo_lista={codigo}
                                            show
                                            onFinish={() => fetchData()}
                                        />
                                    </>
                                )}
                            </div>
                            <Table>
                                {data.length === 0 && (
                                    <TableCaption>
                                        No existen postulantes registrados a
                                        esta inscripcion
                                    </TableCaption>
                                )}

                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombres</TableHead>
                                        <TableHead>Apellidos</TableHead>
                                        <TableHead>CI</TableHead>
                                        <TableHead>Area</TableHead>
                                        <TableHead>Categoria</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((inscripcion) => (
                                        <TableRow key={inscripcion.id}>
                                            <TableCell>
                                                {inscripcion.nombres}
                                            </TableCell>
                                            <TableCell>
                                                {inscripcion.apellidos}
                                            </TableCell>
                                            <TableCell>
                                                {inscripcion.ci}
                                            </TableCell>
                                            <TableCell>
                                                {inscripcion.area}
                                            </TableCell>
                                            <TableCell>
                                                {inscripcion.categoria}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
