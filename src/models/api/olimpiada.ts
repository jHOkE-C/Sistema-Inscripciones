import type { Olimpiada } from "@/models/interfaces/versiones";
import { request } from "./solicitudes";

export const getOlimpiada = async (id: string) => {
  return await request<Olimpiada>("/api/olimpiadas/" + id);
};
