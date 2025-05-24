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
import { getInscritosPorLista } from "@/api/postulantes";

import Loading from "@/components/Loading";
import NotFoundPage from "@/pages/404";
import ReturnComponent from "@/components/ReturnComponent";
import { Button } from "@/components/ui/button";
import type { Postulante } from "../../columns";

export default function Page() {
    const navigate = useNavigate();
    const [data, setData] = useState<Postulante[]>([]);
    const { codigo } = useParams();
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingNavegacion, setLoadingNavegacion] = useState(false);
    const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (loadingNavegacion) {
            intervalId = setInterval(() => {
                setTiempoTranscurrido(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [loadingNavegacion]);

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
        setLoadingNavegacion(true);
    };

    const mensajeLoading = () => {
        if (tiempoTranscurrido < 5) {
            return "Descargando dependencias, por favor espere...";
        } else if (tiempoTranscurrido < 10) {
            return "Descargando dependencias, por favor espere en 5s...";
        } else {
            return "Revise su conexión a internet";
        }
    };
    if (loading) return <Loading />;
    if (notFound) return <NotFoundPage />;
    if (loadingNavegacion) return <Loading textoLoading={mensajeLoading()} />;
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
