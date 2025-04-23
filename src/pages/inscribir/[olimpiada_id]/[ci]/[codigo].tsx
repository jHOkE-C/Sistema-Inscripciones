import { useEffect, useState } from "react";
import FormPostulante from "../../FormPostulante";
import { type Postulante } from "./columns";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cambiarEstadoLista } from "@/api/listas";

export default function Page() {
    const navigate = useNavigate()
    const [data, setData] = useState<Postulante[]>([]);
    const { ci, codigo,olimpiada_id } = useParams();
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetchData();
    }, []);
    if (!codigo) return;
    const refresh = async () => {
        const data = await getInscritosPorLista(codigo);
        setData(data.data);
    };

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

    const terminarRegistro = async () => {
        console.log("terminando registro");
        try {
            await cambiarEstadoLista(codigo,"Pago Pendiente")
            navigate(`/inscribir/${olimpiada_id}/${ci}`)
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    };
    if (loading) return <Loading />;
    if (notFound) return <NotFoundPage />;

    return (
        <>
            <ReturnComponent to={`/inscribir/${ci}`} />
            <div className="min-h-screen py-5">
                <div className="container mx-auto ">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center">
                                Listado de Postulantes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto space-y-5">
                            <div className="flex justify-between">
                                <FormPostulante refresh={refresh} />

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button>Finalizar registro</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Esta seguro que deseas finalizar
                                                el registro?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta accion impedira el registro
                                                de nuevos postulantes a la lista
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={terminarRegistro}
                                            >
                                                Continuar
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <Table>
                                {data.length === 0 && (
                                    <TableCaption>
                                        No existen postulantes registrados a
                                        esta lista
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
