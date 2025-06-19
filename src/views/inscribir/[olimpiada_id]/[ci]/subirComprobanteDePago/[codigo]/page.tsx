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
import { useNavigate, useParams } from "react-router-dom";
import { getInscritosPorLista } from "@/models/api/postulantes";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import NotFoundPage from "@/views/404";
import ReturnComponent from "@/components/ReturnComponent";
import { Button } from "@/components/ui/button";
import type { Postulante } from "../../../../../../models/interfaces/columns";

export default function Page() {
    const navigate = useNavigate();
    const [data, setData] = useState<Postulante[]>([]);
    const { codigo } = useParams();
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    if (!codigo) return;

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getInscritosPorLista(codigo);
            setData(data.data);
            setNotFound(false);
        } catch {
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    
    const navegarASubirComprobante = () => {
        navigate('subir');
        setLoading(true);
    };

    if (loading) return <Loading />;
    if (notFound) return <NotFoundPage />;
    return (
        <>
            <Header/>
            <ReturnComponent />
            <div className="flex justify-center w-full min-h-full pt-4">
                <div className="w-5/6 mx-auto ">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center">
                                Inscripciones de Postulantes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto space-y-5">
                            <div className="flex justify-between">
                                <Button onClick={navegarASubirComprobante}>
                                    Subir Comprobante de Pago
                                </Button>
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
