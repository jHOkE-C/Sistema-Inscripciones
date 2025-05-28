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
import { getInscritosPorLista, postDataPostulante } from "@/api/postulantes";

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

import DialogPostulante from "@/components/DialogPostulante";
import type { postulanteSchema } from "@/components/FormPostulante";
import type { z } from "zod";
import ShareUrl from "@/pages/inscribir/ShareUrl";
import type { Postulante } from "./columns";
import { Check } from "lucide-react";

export default function Page() {
    const [data, setData] = useState<Postulante[]>([]);
    const { codigo_lista } = useParams();
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editar, setEditar] = useState(false);
    useEffect(() => {
        fetchData();
    }, []);
    if (!codigo_lista) return;
    const refresh = async () => {
        const data = await getInscritosPorLista(codigo_lista);
        setData(data.data);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getInscritosPorLista(codigo_lista);

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

    const onSubmit = async (data: z.infer<typeof postulanteSchema>) => {
        if (loading) return;
        setLoading(true);
        try {
            await postDataPostulante({ ...data, codigo_lista: codigo_lista });
            toast.success("El postulante fue registrado exitosamente");
            //setShowForm(false);
            refresh();
        } catch (e) {
            toast.error(
                e instanceof Error ? e.message : "Hubo un error desconocido"
            );
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
                                    <DialogPostulante onSubmit={onSubmit} />
                                )}
                                <ButtonFinalizarRegistro
                                    show={editar && data.length > 0}
                                    codigo_lista={codigo_lista}
                                />
                            </div>
                            <Table>
                                {data.length === 0 && (
                                    <TableCaption>
                                        No existen postulantes registrados a
                                        esta inscripción
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
                <ShareUrl />
            </div>
        </>
    );
}

export const ButtonFinalizarRegistro = ({
    show,
    codigo_lista,
    onFinish,
}: {
    show: boolean;
    codigo_lista: string;
    onFinish?: () => void;
}) => {
    const { olimpiada_id, ci } = useParams();
    const navigate = useNavigate();
    const terminarRegistro = async () => {
        try {
            await cambiarEstadoLista(codigo_lista, "Pago Pendiente");
            if (onFinish) {
                onFinish();
            } else {
                navigate(`/inscribir/${olimpiada_id}/${ci}`);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Ocurrio un error inesperado");
            }
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {show && (
                    <Button>
                        <Check />
                        Finalizar registro
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        ¿Esta seguro que deseas finalizar el registro?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción bloqueará la adición de postulantes futura
                        en esta inscripcion
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={terminarRegistro}>
                        Continuar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
