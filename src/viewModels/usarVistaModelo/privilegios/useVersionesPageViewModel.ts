import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import { VersionFilter, Olimpiada } from "@/models/interfaces/versiones.type";

export interface VersionesPageProps {
    title: string;
    returnTo?: string;
    queVersiones?: VersionFilter[];
    filter?: (value: Olimpiada, index: number, array: Olimpiada[]) => unknown;
    container?: ((version: Olimpiada) => React.ReactNode) | React.ReactNode;
}

export function useVersionesPageViewModel({
    queVersiones = [],
    filter,
}: VersionesPageProps) {
    const [versiones, setVersiones] = useState<Olimpiada[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (queVersiones.length === 0) {
                const { data } = await axios.get<Olimpiada[]>(
                    `${API_URL}/api/olimpiadas/conFases`
                );
                console.log("Data fetched:", data);
                if (filter) {
                    setVersiones(data.filter(filter));
                } else {
                    setVersiones(data);
                }
            } else {
                const { data: todasLasVersiones } = await axios.post<Olimpiada[]>(
                    `${API_URL}/api/olimpiadas/por-tipos`,
                    { tipos: queVersiones }
                );
                console.log(todasLasVersiones);
                setVersiones(todasLasVersiones);
            }
        } catch (error) {
            console.error("Error fetching versiones:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        versiones,
        loading
    };
}
