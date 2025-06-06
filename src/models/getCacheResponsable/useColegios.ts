import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { request } from "@/models/api/request";
import { type Colegio } from "@/models/api/areas";

export const useColegios = (options?: UseQueryOptions<Colegio[], Error>) => {
  return useQuery<Colegio[], Error>({
    queryKey: ["colegios"],
    staleTime: 1000 * 60 * 60,     // 60minutos sin marcarse como "stale"
    gcTime: 1000 * 60 * 60,       // 60minutos antes de purgar el cache
    refetchOnWindowFocus: false,
    queryFn: () =>
      request<Colegio[]>(`/api/colegios`),
    ...options,
  });
};
