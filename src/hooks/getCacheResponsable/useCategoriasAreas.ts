import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { request } from "@/api/request";
import { type Categoria } from "@/api/areas";

export const useAreasConCategorias = (olimpiadaId: number, options?: UseQueryOptions<Categoria[], Error>) => {
    return useQuery<Categoria[], Error>({
        queryKey: ["areasConCategorias", olimpiadaId],
        staleTime: 1000 * 60 * 2, // 2 minutos sin marcarse como "stale"
        gcTime: 1000 * 60 * 10, // 10 minutos antes de purgar el cache
        refetchOnWindowFocus: false,
        queryFn: () =>
            request<Categoria[]>(`/api/categorias/areas/olimpiada/${olimpiadaId}`),
        ...options,
    });
};
