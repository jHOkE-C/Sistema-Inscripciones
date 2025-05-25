import { apiClient } from "@/api/request";

import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Dialog } from "@radix-ui/react-dialog";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getListasPostulantes } from "@/api/postulantes";
import { ListaPostulantes } from "@/pages/inscribir/columns";
import NotFoundPage from "@/pages/404";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Copy, PenBox, QrCodeIcon } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { QRCode } from "react-qrcode-logo";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ButtonFinalizarRegistro } from "@/pages/inscribir/[olimpiada_id]/[ci]/[codigo_lista]";
import { type StepData } from "./StepFormPostulante";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog";
import type { Olimpiada } from "@/types/versiones.type";
import StepFormPostulante from "./StepFormPostulante";

const InscribirPostulante = ({ olimpiada }: { olimpiada?: Olimpiada }) => {
    const [openForm, setOpenForm] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [codigo_lista, setCodigoLista] = useState<string | undefined>();
    const [listas, setListas] = useState<ListaPostulantes[]>([]);
    const [openOptions, setOpenOptions] = useState(false);
    const [openCode, setOpenCode] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showQrCode, setShowQrCode] = useState(false);

    const { ci, olimpiada_id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        refresh();
    }, []);

    if (!ci || !olimpiada_id) return <NotFoundPage />;
    const refresh = async () => {
        try {
            const { data } = await getListasPostulantes(ci);
            const listas = data.filter(
                ({ estado, olimpiada_id: id }) =>
                    estado == "Preinscrito" && id == olimpiada_id
            );
            setListas(listas);
        } catch {
            toast.error("ocurrio un error al obtener las listas");
        }
    };

    const onSubmit = async (data: StepData) => {
        const { codigo_lista } = await apiClient.post<
            { codigo_lista: string },
            { ci: string; olimpiada_id: string }
        >("/api/listas", {
            ci,
            olimpiada_id,
        });
        console.log("lista creada", codigo_lista);
        await apiClient.post("/api/inscripciones", {
            ...data,
            codigo_lista,
        });
        setCodigoLista(codigo_lista);
        refresh();
        setOpenConfirm(true);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(codigo_lista + "");
        setCopied(true);
    };
    return (
        <>
            <Button
                className={`h-auto p-10 bg-teal-600 hover:bg-teal-700  text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg`}
                onClick={() => {
                    if (listas.length > 0) {
                        setOpenOptions(true);
                    } else {
                        setOpenForm(true);
                    }
                }}
            >
                <PenBox className="size-8 mb-1" />
                <span className="text-lg font-semibold text-wrap text-center">
                    Inscribir Postulante/s
                </span>
            </Button>
            <Dialog open={openOptions} onOpenChange={setOpenOptions}>
                <DialogContent className="sm:max-w-[700px] max-h-10/12 overflow-y-auto  ">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-bold text-center">
                            Inscripciones
                        </DialogTitle>
                        <Button
                            onClick={() => {
                                setOpenForm(true);
                            }}
                        >
                            Crear Una Nueva Inscripcion
                        </Button>
                        <DialogDescription>
                            Puede continuar inscribiendo en una de estas
                            inscripciones:
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[300px] overflow-y-scroll">
                        <Table>
                            <TableHeader>
                                <TableRow className="font-semibold">
                                    <TableCell className="">Código</TableCell>
                                    <TableCell className=" w-[200px]">
                                        Cantidad Postulantes
                                    </TableCell>
                                    <TableCell className=" w-[200px]">
                                        Fecha de Creacion
                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="">
                                {listas.map(
                                    (
                                        {
                                            codigo_lista,
                                            postulantes_count,
                                            created_at,
                                        },
                                        i
                                    ) => (
                                        <TableRow
                                            key={i}
                                            className="hover:bg-primary/80 hover:cursor-pointer hover:text-primary-foreground"
                                            onClick={() => {
                                                navigate(codigo_lista);
                                            }}
                                        >
                                            <TableCell>
                                                {codigo_lista}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {postulantes_count}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {created_at.toString()}
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={openForm} onOpenChange={setOpenForm}>
                <DialogContent className="md:max-w-[90vw] max-h-[90vh] overflow-y-auto ">
                    <DialogHeader>
                        <DialogTitle>Agregar Nuevo Postulante</DialogTitle>
                        <DialogDescription>
                            Ingresa los datos del nuevo postulante para las
                            olimpiadas ohSansi
                        </DialogDescription>
                    </DialogHeader>
                    <StepFormPostulante
                        onSubmit={onSubmit}
                        olimpiada={olimpiada}
                    />
                </DialogContent>
            </Dialog>
            <AlertDialog open={openConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Desea Registrar más postulantes?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Presione continuar para registrar mas postulantes en
                            una inscripcion Presione finalizar para terminar el
                            registro
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Link to={codigo_lista + ""}>
                            <Button>Continuar</Button>
                        </Link>
                        <ButtonFinalizarRegistro
                            codigo_lista={codigo_lista + ""}
                            show
                            onFinish={() => {
                                setOpenConfirm(false);
                                setOpenForm(false);
                                setOpenCode(true);
                            }}
                        />
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Dialog open={openCode} onOpenChange={setOpenCode}>
                <DialogContent className="flex flex-col items-center p-4 ">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold mb-4">
                            Este es su Codigo de Inscripción
                        </DialogTitle>
                    </DialogHeader>

                    <p className="font-bold text-6xl text-primary">
                        {codigo_lista}
                    </p>

                    <p>
                        le ofrecemos las distintas opciones para poder
                        guardarla:
                    </p>
                    <Button
                        variant="outline"
                        onClick={handleCopy}
                        className="w-full mb-2"
                    >
                        <Copy className="w-5 h-5 mr-2" />
                        {copied ? "Copiado!" : "Copiar"}
                    </Button>
                    <Button asChild variant="outline" className="w-full mb-2">
                        <Link
                            to={`https://wa.me/?text=${encodeURIComponent(
                                "Su codigo de inscripcion es el siguiente: *" +
                                    codigo_lista +
                                    "*"
                            )}`}
                            target="_blank"
                        >
                            <WhatsAppIcon className="w-5 h-5 mr-2 tex" />
                            WhatsApp
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setShowQrCode(!showQrCode)}
                        className="w-full mb-2"
                    >
                        <QrCodeIcon />
                        QR
                    </Button>

                    {showQrCode && (
                        <Card className="w-full mt-4">
                            <CardTitle className="text-center">
                                Escanea el código QR
                            </CardTitle>
                            <CardContent className="flex justify-center">
                                <QRCode
                                    value={
                                        "Su codigo de inscripcion es el siguiente: " +
                                        codigo_lista
                                    }
                                    logoImage="/logo_umss.png"
                                    logoWidth={50}
                                    logoPadding={2}
                                    size={250}
                                    ecLevel="H"
                                />
                            </CardContent>
                        </Card>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default InscribirPostulante;
