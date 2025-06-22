import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { request } from "@/models/api/solicitudes";
import { type Categoria } from "@/models/api/areas";

export const useAreasConCategorias = (
  olimpiadaId: number,
  options?: UseQueryOptions<Categoria[], Error>
) => {
  return useQuery<Categoria[], Error>({
    queryKey: ["areasConCategorias", olimpiadaId],
    staleTime: 1000 * 60 * 1, // 2 minutos sin marcarse como "stale"
    gcTime: 1000 * 60 * 1, // 10 minutos antes de purgar el cache
    refetchOnWindowFocus: false,
    queryFn: () =>
      request<Categoria[]>(`/api/categorias/areas/olimpiada/${olimpiadaId}`),
    ...options,
  });
};
