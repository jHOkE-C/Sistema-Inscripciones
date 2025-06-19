"use client";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

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
import type { Olimpiada } from "@/models/interfaces/types";
import { Document, Page, pdfjs } from "react-pdf";
import { isMobile } from "react-device-detect";
import { useOrdenPagoViewModel } from "@/viewModels/usarVistaModelo/inscribir/olimpiada/useOrdenPagoViewModel";

interface Props {
    codigo_lista: string;
    olimpiada?: Olimpiada;
}

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
    const {
        formOpen,
        setFormOpen,
        pdfOpen,
        setPdfOpen,
        nombre,
        nitci,
        error,
        loading,
        pdfBlob,
        datosPrevios,
        fetchDatosPrevios,
        handleNombreChange,
        handleNitCiChange,
        handleSubmit,
        handleDownload,
        onClick,
    } = useOrdenPagoViewModel(codigo_lista);

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
                                <div className="font-medium">
                                    Código de inscripción:
                                </div>
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
                                fetchDatosPrevios();
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