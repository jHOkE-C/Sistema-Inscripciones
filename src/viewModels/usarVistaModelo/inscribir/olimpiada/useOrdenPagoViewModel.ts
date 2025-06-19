import { useState } from "react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import { descargarPDF, generarOrden } from "@/viewModels/utils/pdf";
import { apiClient } from "@/models/api/request";

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

export function useOrdenPagoViewModel(codigo_lista: string) {
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
            setPdfBlob(
                new Blob([pdf as BlobPart], { type: "application/pdf" })
            );
            setPdf(pdf);
        } catch {
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
        const rawValue = e.target.value;
        const upperValue = rawValue.toUpperCase();
        const filteredValue = upperValue.replace(/[^A-Z0-9]/g, "");
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
            setLoading(false);
            return;
        }
        const data = {
            codigo_lista,
            nombre_responsable: nombre,
            emitido_por: "Sistema OhSansi",
            nitci: nitci,
        };
        const crearOrden = async () => {
            setLoading(true);
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
                if (error instanceof AxiosError) {
                    toast.error(error.message);
                }
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
    };

    return {
        formOpen,
        setFormOpen,
        pdfOpen,
        setPdfOpen,
        nombre,
        setNombre,
        nitci,
        setNitCi,
        error,
        setError,
        loading,
        setLoading,
        pdf,
        setPdf,
        pdfBlob,
        setPdfBlob,
        datosPrevios,
        setDatosPrevios,
        fetchDatosPrevios,
        fetchOrden,
        handleNombreChange,
        handleNitCiChange,
        handleSubmit,
        handleDownload,
        onClick,
    };
}
