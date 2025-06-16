import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import type { Olimpiada } from "@/models/interfaces/versiones.type";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const useOlimpiadasCarouselViewModel = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [olimpiadas, setOlimpiadas] = useState<Olimpiada[]>([]);

    useEffect(() => {
        const fetchOlimpiadas = async () => {
            const response = await axios.get<Olimpiada[]>(
                `${API_URL}/api/olimpiadas/hoy`
            );
            if (Array.isArray(response.data)) {
                setOlimpiadas(response.data);
            } else {
                setOlimpiadas([]);
            }
        };
        fetchOlimpiadas();
        setIsMounted(true);
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(`${dateString}T12:00:00`);
        return format(date, "d 'de' MMMM, yyyy", { locale: es });
    };

    const sortOlimpiadas = (olimpiadas: Olimpiada[]) => {
        return olimpiadas.sort((a, b) => {
            const aHasInscripcion = a.fase?.fase.nombre_fase
                .toLowerCase()
                .includes("inscripción")
                ? 1
                : 0;
            const bHasInscripcion = b.fase?.fase.nombre_fase
                .toLowerCase()
                .includes("inscripción")
                ? 1
                : 0;
            return bHasInscripcion - aHasInscripcion;
        });
    };

    return {
        isMounted,
        olimpiadas: sortOlimpiadas(olimpiadas),
        formatDate
    };
}; 