
import type { Olimpiada } from "@/models/types/versiones.type"
import { request } from "./request"

export const getOlimpiada= async (id:string)=>{
    return await request<Olimpiada>("/api/olimpiadas/"+id)
}