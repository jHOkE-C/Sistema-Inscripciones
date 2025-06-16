import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getInscritosPorLista } from "@/models/api/postulantes";

export interface Postulante {
    id: string;
    nombres: string;
    apellidos: string;
    fecha_nacimiento: string;
    provincia_id: string;
    email: string;
    ci: string;
    curso: string;
    area: string;
    categoria: string;
}

export const useListaViewModel = () => {
    const [data, setData] = useState<Postulante[]>([]);
    const { codigo_lista } = useParams();
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (codigo_lista) {
            fetchData();
        }
    }, [codigo_lista]);

    const fetchData = async () => {
        if (!codigo_lista) return;
        
        setLoading(true);
        try {
            const data = await getInscritosPorLista(codigo_lista);
            setData(data.data);
            setNotFound(false);
        } catch {
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        notFound
    };
}; 