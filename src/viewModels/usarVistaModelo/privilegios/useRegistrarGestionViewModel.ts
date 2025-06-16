import { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import { toast } from "sonner";

interface RegistrarGestionProps {
    refresh: () => void;
}

export function useRegistrarGestionViewModel({ refresh }: RegistrarGestionProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [managementPeriod, setManagementPeriod] = useState("");
    const [startDate, setStartDate] = useState<Date>(
        new Date(new Date().setHours(0, 0, 0, 0))
    );
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const currentYear = new Date().getFullYear();
    const [precio, setPrecio] = useState<string | number>(15);
    const [limite, setLimite] = useState<string>("1");
    const [descripcion, setDescripcion] = useState<string>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const start = startDate ? format(startDate, "yyyy-MM-dd") : null;
        const end = endDate ? format(endDate, "yyyy-MM-dd") : null;
        try {
            const data = {
                nombre: name,
                gestion: managementPeriod,
                fecha_inicio: start,
                fecha_fin: end,
                precio_inscripcion: precio,
                limite_inscripciones: limite,
                descripcion_convocatoria: descripcion,
            };
            console.log(data);
            const response = await axios.post(`${API_URL}/api/olimpiadas`, data);
            console.log(response);

            setName("");
            setManagementPeriod("");
            setStartDate(new Date());
            setEndDate(undefined);
            setOpen(false);
            refresh();
            toast.success("La Olimpiada se creó correctamente.");
        } catch {
            toast.error("No se pudo registrar la gestion. Intente nuevamente");
        }
    };

    useEffect(() => {
        setEndDate(undefined);
    }, [startDate]);

    return {
        open,
        setOpen,
        name,
        setName,
        managementPeriod,
        setManagementPeriod,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        currentYear,
        precio,
        setPrecio,
        limite,
        setLimite,
        descripcion,
        setDescripcion,
        handleSubmit
    };
} 