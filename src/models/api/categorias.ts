import { request } from "./solicitudes";
import type {
  AreaConCategorias,
  Categoria,
} from "@/models/interfaces/postulantes";

export async function getAreasConCategorias(
  olimpiadaId: number
): Promise<AreaConCategorias[]> {
  return await request<AreaConCategorias[]>(
    `/api/areas/categorias/olimpiada/${olimpiadaId}`
  );
}

export async function getCategoriasOlimpiada(
  olimpiadaId: number
): Promise<Categoria[][]> {
  return await request<Categoria[][]>(
    `/api/categorias/olimpiada/${olimpiadaId}`
  );
}
