import { request } from './request';
import type { Departamento, Provincia, Colegio } from '@/interfaces/ubicacion.interface';

export async function getDepartamentos(): Promise<Departamento[]> {
  return await request<Departamento[]>(`/api/departamentos`);
}

export async function getProvincias(): Promise<Provincia[]> {
  return await request<Provincia[]>(`/api/provincias`);
}

export async function getColegios(): Promise<Colegio[]> {
  return await request<Colegio[]>(`/api/colegios`);
}

export async function getDepartamentosWithProvinces(): Promise<Departamento[]> {
  return await request<Departamento[]>(`/api/departamentos/with-provinces`);
}