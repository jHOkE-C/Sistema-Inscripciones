import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { request } from "@/models/api/solicitudes";
import { type Departamento } from "@/models/interfaces/ubicaciones";

export const useDepartamentosWithProvinces = (
  options?: UseQueryOptions<Departamento[], Error>
) => {
  return useQuery<Departamento[], Error>({
    queryKey: ["departamentosWithProvinces"],
    staleTime: 1000 * 60 * 60, // 60 minutos sin marcarse como "stale"
    gcTime: 1000 * 60 * 60, // 60 minutos antes de purgar el cache
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await request<Departamento[]>(
        `/api/departamentos/with-provinces`
      );
      return response;
    },
    ...options,
  });
};
