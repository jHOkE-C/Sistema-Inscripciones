"use client";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";
import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Download, CheckCircle2, PenBox } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/hooks/useApiRequest";
import { toast } from "sonner";
import { descargarPDF, generarOrden } from "@/utils/pdf";
import type { Olimpiada } from "@/pages/admin/version/[id]/types";
import { Document, Page, pdfjs } from "react-pdf";
interface Props {
    codigo_lista: string;
    olimpiada?: Olimpiada;
}
import { isMobile } from "react-device-detect";
import { apiClient } from "@/api/request";

export interface Orden {
    id: string;
    n_orden: string;
    codigo_lista: string;
    fecha_emision: string;
    precio_unitario: string;
    monto: string;
    estado: string;
    cantidad_inscripciones: number;
    nombre_responsable?: string;
    emitido_por: string;
    nitci: string;
    unidad: string;
    concepto: string;
    niveles_competencia: string[];
}
export interface DatosPrevios {
    codigo_lista: string;
    monto: number;
    estado: string;
    cantidad_inscripciones: number;
}
export default function OrdenPago({ codigo_lista }: Props) {
    const [formOpen, setFormOpen] = useState(false);
    const [pdfOpen, setPdfOpen] = useState(false);
    const [nombre, setNombre] = useState("");
    const [nitci, setNitCi] = useState("");
    const [error, setError] = useState<{ nombre?: string; nitCi?: string }>({});
    const [loading, setLoading] = useState(false);
    const [pdf, setPdf] = useState<Uint8Array>();
    const [pdfBlob, setPdfBlob] = useState<Blob>();

    const [datosPrevios, setDatosPrevios] = useState<DatosPrevios>();

    const fetchDatosPrevios = async () => {
        try {
            const response = await apiClient.get<DatosPrevios>(
                "/api/ordenes-pago/datos-previos/" + codigo_lista
            );
            setDatosPrevios(response);
            setFormOpen(true);
        } catch {
            toast.error("Ocurrio un error");
        }
    };

    const fetchOrden = async () => {
        try {
            const { data } = await axios.get<Orden>(
                `${API_URL}/api/ordenes-pago/lista/${codigo_lista}`
            );
            const pdf = await generarOrden({
                cantidad: data.cantidad_inscripciones,
                ci: data.nitci,
                concepto: data.concepto,
                emitido_por: data.emitido_por,
                importe: data.monto,
                n_orden: data.n_orden,
                nombre_responsable: data.nombre_responsable,
                precio_unitario: data.precio_unitario,
                unidad: data.unidad,
                fecha_emision: data.fecha_emision,
            });
            setPdfOpen(true);
            setPdfBlob(new Blob([pdf as BlobPart], { type: "application/pdf" }));
            setPdf(pdf);
        } catch {
            //toast.error("Hubo un error al cargar la orden.");
            await fetchDatosPrevios();
        }
    };

    const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNombre(e.target.value);
        if (e.target.value.trim() !== "") {
            setError((prev) => ({ ...prev, nombre: undefined }));
        }
    };

    const handleNitCiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Convertir a mayúsculas y eliminar caracteres no permitidos
        const rawValue = e.target.value;
        const upperValue = rawValue.toUpperCase();

        // Filtrar solo letras mayúsculas y números
        const filteredValue = upperValue.replace(/[^A-Z0-9]/g, "");

        // Validar longitud máxima
        if (filteredValue.length <= 10) {
            setNitCi(filteredValue);
            setError((prev) => ({ ...prev, nitCi: undefined }));
        } else {
            setNitCi(filteredValue.slice(0, 10));
            setError((prev) => ({
                ...prev,
                nitCi: "El NIT/CI debe tener máximo 10 caracteres",
            }));
        }
    };

    const handleSubmit = () => {
        setLoading(true);
        const newErrors: { nombre?: string; nitCi?: string } = {};

        if (nombre.trim() === "") {
            newErrors.nombre = "Por favor ingrese el nombre";
        }

        if (nitci.trim() === "") {
            newErrors.nitCi = "Por favor ingrese un NIT/CI";
        }

        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }
        const data = {
            codigo_lista,
            nombre_responsable: nombre,
            emitido_por: "Sistema OhSansi",
            nitci: nitci,
        };

        const crearOrden = async () => {
            //generarOrden()
            console.log("payload",data)
            try {
                const response = await axios.post(
                    `${API_URL}/api/ordenes-pago`,
                    data
                );
                setFormOpen(false);
                setPdfOpen(true);
                console.log("Orden creada:", response.data);
            } catch (error) {
                console.error("Error al crear la orden:", error);
            }
            await fetchOrden();
            setLoading(false);
        };

        crearOrden();
    };

    const handleDownload = async () => {
        try {
            if (pdf) descargarPDF(pdf);
        } catch (error) {
            console.error("Error al descargar el PDF:", error);
        }

        setPdfOpen(false);
        setNombre("");
        setNitCi("");
        setError({});
    };

    const onClick = async () => {
        await fetchOrden();
        //setFormOpen(true);
    };

    return (
        <div>
            <Button onClick={onClick} variant="link">
                Generar orden de pago
            </Button>

            {/* Modal del formulario */}
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-center">
                            Generar Orden de Pago
                        </DialogTitle>
                    </DialogHeader>

                    <DialogDescription asChild>
                        <div className="grid gap-5 py-4">
                            <div className="grid grid-cols-2 gap-3 p-4 rounded-lg border">
                                <div className="font-medium">Código de inscripción:</div>
                                <div className="font-semibold">
                                    {codigo_lista}
                                </div>

                                <div className="font-medium">Monto:</div>
                                <div className="font-semibold">
                                    {datosPrevios?.monto || "0"} Bs.
                                </div>

                                <div className="font-medium">Estado:</div>
                                <div className="font-semibold capitalize">
                                    {datosPrevios?.estado}
                                </div>

                                <div className="font-medium">
                                    Inscripciones:
                                </div>
                                <div className="font-semibold">
                                    {datosPrevios?.cantidad_inscripciones}
                                </div>

                                
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-2">
                                <Label htmlFor="nombre">Sr./Sra.</Label>
                                <Input
                                    id="nombre"
                                    value={nombre}
                                    onChange={handleNombreChange}
                                    placeholder="Ingrese el nombre completo"
                                />
                                {error.nombre && (
                                    <div className="flex items-center text-sm text-red-500 mt-1">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {error.nombre}
                                    </div>
                                )}

                                <Label htmlFor="nitCi">NIT/CI</Label>
                                <Input
                                    id="nitCi"
                                    value={nitci}
                                    onChange={handleNitCiChange}
                                    placeholder="Ingrese NIT/CI"
                                    maxLength={10}
                                />
                                {error.nitCi && (
                                    <div className="flex items-center text-sm text-red-500 mt-1">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {error.nitCi}
                                    </div>
                                )}
                            </form>
                        </div>
                    </DialogDescription>

                    <DialogFooter className="gap-3 sm:gap-0 space-x-2">
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? "Procesando..." : "Continuar"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setFormOpen(false)}
                        >
                            Cancelar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de la orden de pago (PDF) */}
            <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
                <DialogContent className="sm:min-w-[650px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-center flex items-center justify-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            Orden de Pago Generada
                        </DialogTitle>
                    </DialogHeader>

                    {pdfBlob && (
                        <Document file={pdfBlob}>
                            <Page
                                pageNumber={1}
                                className="shadow-lg mx-auto"
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                scale={isMobile ? 0.5 : 1}
                            />
                        </Document>
                    )}
                    <div className="flex justify-between w-full">
                        <Button onClick={handleDownload} className="">
                            <Download className="mr-2 h-4 w-4" />
                            Descargar PDF
                        </Button>
                        <Button
                            variant={"secondary"}
                            onClick={() => {
                                setPdfOpen(false);
                                fetchDatosPrevios()
                       
                            }}
                            className=""
                        >
                            <PenBox className="mr-2 h-4 w-4" />
                            Modificar Orden
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
