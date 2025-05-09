"use client";

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
import { AlertCircle, FileText, Download, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/hooks/useApiRequest";
import { toast } from "sonner";
import { generarOrden } from "@/utils/pdf";

interface Props {
    codigo: string;
}

interface Orden {
    codigo_lista: string;
    monto: number;
    estado: string;
    cantidad_inscripciones: number;
}

export default function OrdenPago({ codigo }: Props) {
    const [formOpen, setFormOpen] = useState(false);
    const [pdfOpen, setPdfOpen] = useState(false);
    const [nombre, setNombre] = useState("");
    const [nitCi, setNitCi] = useState("");
    const [error, setError] = useState<{ nombre?: string; nitCi?: string }>({});
    const [loading, setLoading] = useState(false);
    const datos = {
        codigo_lista: "",
        monto: 0,
        estado: "",
        cantidad_inscripciones: 0,
    };
    const [datosPago, setDatosPago] = useState<Orden>(datos);

    const fetchOrden = async () => {
        try {
            const { data } = await axios.get<Orden>(
                `${API_URL}/api/ordenes-pago/generate/${codigo}`
            );
            setDatosPago(data);
        } catch (err) {
            toast.error("Hubo un error al cargar la orden.");
            console.error(err);
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
        const newErrors: { nombre?: string; nitCi?: string } = {};

        if (nombre.trim() === "") {
            newErrors.nombre = "Por favor ingrese el nombre";
        }

        if (nitCi.trim() === "") {
            newErrors.nitCi = "Por favor ingrese un NIT/CI";
        }

        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }

        // Simular petición al backend
        setLoading(true);
        const data = {
            codigo_lista: datosPago.codigo_lista,
            estado: datosPago.estado,
            senior: nombre,
            emitido_por: "Sistema",
            nitci: nitCi,
        };
        console.log(data);

        const crearOrden = async () => {
            try {
                const response = await axios.post(
                    `${API_URL}/api/ordenes-pago`,
                    data
                );
                setLoading(false);
                setFormOpen(false);
                setPdfOpen(true);
                console.log("Orden creada:", response.data);
            } catch (error) {
                console.error("Error al crear la orden:", error);
            }
        };

        crearOrden();
    };

    const handleDownload = async () => {
        generarOrden()
        // try {
        //     const response = await axios.get(
        //         `${API_URL}/api/ordenes-pago/${datosPago.codigo_lista}/export`,
        //         {
        //             responseType: "blob", // 👈 importante para manejar el PDF
        //         }
        //     );

        //     const url = window.URL.createObjectURL(new Blob([response.data]));
        //     const link = document.createElement("a");
        //     link.href = url;
        //     link.setAttribute("download", "orden-pago.pdf"); // puedes cambiar el nombre del archivo
        //     document.body.appendChild(link);
        //     link.click();
        //     link.remove();
        //     window.URL.revokeObjectURL(url);
        // } catch (error) {
        //     console.error("Error al descargar el PDF:", error);
        // }

        setPdfOpen(false);
        setNombre("");
        setNitCi("");
        setError({});
    };

    const onClick = async () => {
        await fetchOrden();
        setFormOpen(true);
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
                                <div className="font-medium">Código lista:</div>
                                <div className="font-semibold">
                                    {datosPago.codigo_lista}
                                </div>

                                <div className="font-medium">Monto:</div>
                                <div className="font-semibold">
                                    {datosPago.monto} Bs.
                                </div>

                                <div className="font-medium">Estado:</div>
                                <div className="font-semibold capitalize">
                                    {datosPago.estado}
                                </div>

                                <div className="font-medium">
                                    Inscripciones:
                                </div>
                                <div className="font-semibold">
                                    {datosPago.cantidad_inscripciones}
                                </div>
                            </div>

                            <div className="space-y-2">
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
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nitCi">NIT/CI</Label>
                                <Input
                                    id="nitCi"
                                    value={nitCi}
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
                            </div>
                        </div>
                    </DialogDescription>

                    <DialogFooter className="gap-3 sm:gap-0 space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setFormOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? "Procesando..." : "Continuar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de la orden de pago (PDF) */}
            <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-center flex items-center justify-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            Orden de Pago Generada
                        </DialogTitle>
                    </DialogHeader>

                    <DialogDescription>
                        <div className="flex flex-col items-center py-6">
                            {/* Miniatura del PDF */}
                            <div className="border rounded-md p-4 w-full max-w-xs bg-white shadow-md mb-4">
                                <div className="flex justify-center mb-3">
                                    <FileText className="h-12 w-12 text-gray-500" />
                                </div>

                                {/* Simulación visual del contenido del PDF */}
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    <div className="flex justify-between mt-4">
                                        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                                        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                                    </div>
                                </div>

                                <div className="mt-4 text-center text-sm text-gray-500">
                                    <p className="font-semibold">
                                        Orden de Pago
                                    </p>
                                    <p>Sr./Sra.: {nombre}</p>
                                    <p>NIT/CI: {nitCi}</p>
                                </div>
                            </div>

                            <Button onClick={handleDownload} className="w-full">
                                <Download className="mr-2 h-4 w-4" />
                                Descargar PDF
                            </Button>
                        </div>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
    );
}
