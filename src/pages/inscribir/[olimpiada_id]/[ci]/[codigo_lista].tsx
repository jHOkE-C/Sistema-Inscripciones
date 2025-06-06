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
import { cambiarEstadoLista } from "@/models/api/listas";
import ShareUrl from "@/pages/inscribir/ShareUrl";
import type { Postulante } from "../../../../models/interfaces/columns";
import { Check, PenBox } from "lucide-react";
import { apiClient } from "@/models/api/request";
import { useOlimpiada } from "@/models/getCacheResponsable/useOlimpiadas";
import StepFormPostulante, {
    type StepData,
} from "@/components/StepFormPostulante";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function Page() {
    const [data, setData] = useState<Postulante[]>([]);
    const { codigo_lista } = useParams();
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editar, setEditar] = useState(false);
    const { olimpiada_id, ci } = useParams();
    const { data: olimpiada, isLoading: olimpiadaLoading, isError: olimpiadaError } = useOlimpiada(Number(olimpiada_id));
    const [openForm, setOpenForm] = useState(false);
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (olimpiadaError) {
            console.error("Error al obtener olimpiada");
        }
    }, [olimpiadaError]);
    const refresh = async () => {
        const data = await getInscritosPorLista(codigo_lista!);
        console.log("nuevos datos", data.data);
        setData(data.data);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getInscritosPorLista(codigo_lista!);

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

    const onSubmit = async (data: StepData) => {
        const date = data.fecha_nacimiento;
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
            date.getMonth() + 1
        )
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}`;
        const payload = {
            ...data,
            codigo_lista,
            fecha_nacimiento: formattedDate,
        };
        console.log("payload", payload);
        try {
            await apiClient.post("/api/inscripciones", payload);
            toast.success("Postulante inscrito correctamente");
            await refresh();
        } catch (e: unknown) {
            throw e instanceof Error ? e : new Error(String(e));
        }
        setOpenForm(false);
    };

    if (loading) return <Loading />;
    if (notFound) return <NotFoundPage />;
    if (!codigo_lista || !ci || !olimpiada_id || olimpiadaLoading) return <Loading />;

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
                                    <Button
                                        className="text-sm"
                                        onClick={() => {
                                            setOpenForm(true);
                                        }}
                                    >
                                        <PenBox />
                                        <span className=" font-semibold text-wrap text-center">
                                            Inscribir Postulante
                                        </span>
                                    </Button>
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
                                        <TableRow key={inscripcion.area+inscripcion.categoria+""+inscripcion.id}>
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
            <Dialog open={openForm} onOpenChange={setOpenForm}>
                <DialogContent className=" md:max-w-4xl min-h-[500px] max-h-[90vh] overflow-y-auto ">
                    <DialogHeader>
                        <DialogTitle>Agregar Nuevo Postulante</DialogTitle>
                        <DialogDescription>
                            Ingresa los datos del nuevo postulante para las
                            olimpiadas ohSansi
                        </DialogDescription>
                        <StepFormPostulante
                            onSubmit={onSubmit}
                            olimpiada={olimpiada}
                        />
                    </DialogHeader>{" "}
                </DialogContent>{" "}
            </Dialog>
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
