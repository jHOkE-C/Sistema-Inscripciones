import React, { createContext, useContext, useState } from "react";
import {
    getAreasConCategorias,
    getCategoriasOlimpiada,
} from "@/api/categorias";
import { CategoriaExtendida, GRADOS } from "@/interfaces/postulante.interface";

interface CategoriasContextType {
    getAreasCategoriasPorOlimpiada: (
        olimpiadaId: number
    ) => Promise<Map<string, CategoriaExtendida[]>>;
    isLoading: boolean;
    error: string | null;
}

const CategoriasContext = createContext<CategoriasContextType | undefined>(
    undefined
);

const categoriasCache = new Map<number, Map<string, CategoriaExtendida[]>>();

export const CategoriasProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getAreasCategoriasPorOlimpiada = async (
        olimpiadaId: number
    ): Promise<Map<string, CategoriaExtendida[]>> => {
        if (categoriasCache.has(olimpiadaId)) {
            return categoriasCache.get(olimpiadaId) as Map<
                string,
                CategoriaExtendida[]
            >;
        }

        try {
            setIsLoading(true);
            setError(null);

            const areasConCategoriasData = await getAreasConCategorias(
                olimpiadaId
            );
            const gradosCategoriasData = await getCategoriasOlimpiada(
                olimpiadaId
            );

            const areasMap = new Map<string, CategoriaExtendida[]>();

            GRADOS.forEach((grado, index) => {
                const categorias = gradosCategoriasData[index] || [];
                const categoriasExtendidas: CategoriaExtendida[] = [];
                categorias.forEach((cat) => {
                    areasConCategoriasData.forEach((area) => {
                        if (area.categorias.find(({ id }) => id == cat.id)) {
                            const categoriaExtendida: CategoriaExtendida = {
                                ...cat,
                                areaId: area?.id ?? 0,
                                areaNombre: area?.nombre ?? "Desconocida",
                            };
                            categoriasExtendidas.push(categoriaExtendida);
                        }
                    });
                });

                areasMap.set(grado.id, categoriasExtendidas);
            });

            console.log("areas map", areasMap);

            categoriasCache.set(olimpiadaId, areasMap);

            return areasMap;
        } catch (error) {
            console.error("Error al cargar datos de categorías:", error);
            setError("Error al cargar datos de categorías y áreas");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        getAreasCategoriasPorOlimpiada,
        isLoading,
        error,
    };

    return (
        <CategoriasContext.Provider value={value}>
            {children}
        </CategoriasContext.Provider>
    );
};

export const useCategorias = () => {
    const context = useContext(CategoriasContext);
    if (context === undefined) {
        throw new Error(
            "useCategorias debe usarse dentro de un CategoriasProvider"
        );
    }
    return context;
};
