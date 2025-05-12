import { apiClient } from "@/api/request";
import FormPostulante, {
    type postulanteSchema,
} from "@/components/FormPostulante";
import ReturnComponent from "@/components/ReturnComponent";
import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Dialog } from "@radix-ui/react-dialog";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { z } from "zod";
import { ButtonFinalizarRegistro } from "./[codigo_lista]";
import Loading from "@/components/Loading";
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
import { Copy, QrCodeIcon } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { QRCode } from "react-qrcode-logo";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { QRCodeCanvas } from "qrcode.react";

const Page = () => {
    const [openForm, setOpenForm] = useState(false);
    const [loading, setLoading] = useState(false);
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
        fetchData();
    }, []);

    if (!ci || !olimpiada_id) return <NotFoundPage />;
    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await getListasPostulantes(ci);
            const listas = data.filter(({ estado }) => estado == "Preinscrito");

            if (listas.length > 0) {
                setOpenOptions(true);
            } else {
                setOpenForm(true);
            }

            setListas(listas);
        } catch {
            toast.error("ocurrio un error al obtener las listas");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: z.infer<typeof postulanteSchema>) => {
        //crear lista
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
        setOpenConfirm(true);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(codigo_lista + "");
        setCopied(true);
    };
    if (loading) return <Loading />;
    return (
        <>
            <div>
                <ReturnComponent />
                <Dialog open={openOptions}>
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
                                Haga clic en una lista para continuar la
                                inscripcion incompleta
                            </DialogDescription>
                        </DialogHeader>
                        <div className="max-h-[300px] overflow-y-scroll">
                            <Table>
                                <TableHeader>
                                    <TableRow className="font-semibold">
                                        <TableCell className="">
                                            Código
                                        </TableCell>
                                        <TableCell className=" w-[200px]">
                                            Cantidad Postulantes
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="">
                                    {listas.map(
                                        (
                                            { codigo_lista, postulantes_count },
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
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={openForm} onOpenChange={setOpenForm}>
                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto ">
                        <DialogHeader>
                            <DialogTitle>Agregar Nuevo Postulante</DialogTitle>
                            <DialogDescription>
                                Ingresa los datos del nuevo postulante para las
                                olimpiadas ohSansi
                            </DialogDescription>
                        </DialogHeader>
                        <FormPostulante
                            onSubmit={onSubmit}
                            onCancel={() => {
                                setOpenForm(false);
                            }}
                        />
                    </DialogContent>
                </Dialog>
                <Dialog open={openConfirm}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                ¿Desea Registrar más postulantes?
                            </DialogTitle>
                            <DialogDescription>
                                Presione continuar para registrar mas
                                postulantes en una listas Presione finalizar
                                para terminar el registro
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
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
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog open={openCode} onOpenChange={setOpenCode}>
                    <DialogContent className="flex flex-col items-center p-4 ">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold mb-4">
                                Compartir Codigo de Inscripción
                            </DialogTitle>
                        </DialogHeader>

                        <p className="font-bold text-2xl">{codigo_lista}</p>
                        <Button
                            variant="outline"
                            onClick={handleCopy}
                            className="w-full mb-2"
                        >
                            <Copy className="w-5 h-5 mr-2" />
                            {copied ? "Copiado!" : "Copiar"}
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="w-full mb-2"
                        >
                            <Link
                                to={`https://wa.me/?text=${encodeURIComponent(
                                    codigo_lista + ""
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
                        <QRCode
                            value={codigo_lista}
                            logoImage="/logo_umss.png"
                            logoWidth={50}
                            logoPadding={2}
                            size={200}
                        />
                        {showQrCode && (
                            <Card className="w-full mt-4">
                                <CardTitle className="text-center">
                                    Escanea el código QR
                                </CardTitle>
                                <CardContent className="flex justify-center">
                                    <QRCodeCanvas
                                        value={codigo_lista + ""}
                                        size={200}
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};

export default Page;
