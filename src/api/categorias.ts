import { request } from './request';
import type { AreaConCategorias, Categoria } from '@/interfaces/postulante.interface';

export async function getAreasConCategorias(olimpiadaId: number): Promise<AreaConCategorias[]> {
  return await request<AreaConCategorias[]>(`/api/areas/categorias/olimpiada/${olimpiadaId}`);
}

export async function getCategoriasOlimpiada(olimpiadaId: number): Promise<Categoria[][]> {
  return await request<Categoria[][]>(`/api/categorias/olimpiada/${olimpiadaId}`);
}