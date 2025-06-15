import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import { Version, VersionFilter } from "@/models/interfaces/versiones.type";

export interface VersionesPageProps {
    title: string;
    returnTo?: string;
    queVersiones?: VersionFilter[];
    filter?: (value: Version, index: number, array: Version[]) => unknown;
    container?: ((version: Version) => React.ReactNode) | React.ReactNode;
}

export function useVersionesPageViewModel({
    queVersiones = [],
    filter,
}: VersionesPageProps) {
    const [versiones, setVersiones] = useState<Version[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (queVersiones.length === 0) {
                const { data } = await axios.get<Version[]>(
                    `${API_URL}/api/olimpiadas`
                );
                if (filter) {
                    setVersiones(data.filter(filter));
                } else {
                    setVersiones(data);
                }
            } else {
                const hayPasadas = queVersiones.includes("pasadas");
                const hayFuturas = queVersiones.includes("futuras");
                const fasesSolicitadas = queVersiones.filter(
                    (f) => f !== "pasadas" && f !== "futuras"
                );
                const hayFases = fasesSolicitadas.length > 0;

                const peticiones: Promise<AxiosResponse<Version[]>>[] = [];
                if (hayPasadas) {
                    peticiones.push(
                        axios.get<Version[]>(
                            `${API_URL}/api/olimpiadas/pasadas`
                        )
                    );
                }
                if (hayFuturas) {
                    peticiones.push(
                        axios.get<Version[]>(
                            `${API_URL}/api/olimpiadas/futuras`
                        )
                    );
                }
                if (hayFases) {
                    peticiones.push(
                        axios.post<Version[]>(
                            `${API_URL}/api/olimpiadas/por-fases`,
                            { fases: fasesSolicitadas }
                        )
                    );
                }

                const respuestas = await Promise.all(peticiones);
                const todasLasVersiones = respuestas.flatMap((r) => r.data);
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