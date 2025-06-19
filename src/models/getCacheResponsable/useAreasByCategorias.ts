import { useQuery } from "@tanstack/react-query";
import { request } from "@/models/api/solicitudes";
import type { Area, Categoria } from "@/models/api/areas";

interface AreaWithCategories extends Area {
  categorias?: Categoria[];
}

export const getAreasByCategorias = async (
  olimpiadaId: number
): Promise<AreaWithCategories[]> => {
  return await request<AreaWithCategories[]>(
    `/api/areas/categorias/olimpiada/${olimpiadaId}`
  );
};

export const useAreasByCategorias = (olimpiadaId: number) => {
  return useQuery<AreaWithCategories[], Error>({
    queryKey: ["areasByCategorias", olimpiadaId],
    queryFn: () => getAreasByCategorias(olimpiadaId),
  });
};
