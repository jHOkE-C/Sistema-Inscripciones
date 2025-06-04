import { useQuery } from "@tanstack/react-query";
import { request } from "@/api/request";
import type { Categoria } from "@/interfaces/postulante.interface";

export const getCategoriasOlimpiada = async (olimpiadaId: number): Promise<Categoria[][]> => {
  return await request<Categoria[][]>(`/api/categorias/olimpiada/${olimpiadaId}`);
};

export const useCategoriasOlimpiada = (olimpiadaId: number) => {
  return useQuery<Categoria[][], Error>({
    queryKey: ["categoriasOlimpiada", olimpiadaId],
    queryFn: () => getCategoriasOlimpiada(olimpiadaId),
  });
};
