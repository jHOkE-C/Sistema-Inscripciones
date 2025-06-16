"use client";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";
import type React from "react";

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
import { AlertCircle, Download } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import type { Olimpiada } from "@/models/interfaces/types";
import { isMobile } from "react-device-detect";
import { useOrdenPagoViewModel } from "@/viewModels/usarVistaModelo/inscribir/olimpiada/useOrdenPagoViewModel";

interface Props {
    codigo_lista: string;
    olimpiada?: Olimpiada;
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
        pdf,
        pdfBlob,
        datosPrevios,
        handleNombreChange,
        handleNitCiChange,
        handleSubmit,
        handleDownload,
        onClick
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
                                <div className="font-medium">Código de inscripción:</div>
                                <div className="font-semibold">{codigo_lista}</div>

                                <div className="font-medium">Monto:</div>
                                <div className="font-semibold">
                                    {datosPrevios?.monto || "0"} Bs.
                                </div>

                                <div className="font-medium">Estado:</div>
                                <div className="font-semibold capitalize">
                                    {datosPrevios?.estado}
                                </div>

                                <div className="font-medium">Inscripciones:</div>
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

                                <Label htmlFor="nitci">NIT/CI</Label>
                                <Input
                                    id="nitci"
                                    value={nitci}
                                    onChange={handleNitCiChange}
                                    placeholder="Ingrese el NIT/CI"
                                />
                                {error.nitCi && (
                                    <div className="flex items-center text-sm text-red-500 mt-1">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {error.nitCi}
                                    </div>
                                )}

                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full"
                                    >
                                        {loading ? "Generando..." : "Generar Orden"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </div>
                    </DialogDescription>
                </DialogContent>
            </Dialog>

            {/* Modal del PDF */}
            <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-center">
                            Orden de Pago
                        </DialogTitle>
                    </DialogHeader>

                    <DialogDescription asChild>
                        <div className="grid gap-5 py-4">
                            <div className="flex justify-center">
                                {pdf && (
                                    <Document
                                        file={pdfBlob}
                                        className="flex flex-col items-center"
                                    >
                                        <Page
                                            pageNumber={1}
                                            width={isMobile ? 300 : 600}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                        />
                                    </Document>
                                )}
                            </div>

                            <DialogFooter>
                                <Button
                                    onClick={handleDownload}
                                    className="w-full"
                                    variant="outline"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Descargar PDF
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
    );
}
