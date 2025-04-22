import type { Olimpiada } from "@/pages/carousel"
import { request } from "./request"

export const getOlimpiada= async (id:string)=>{
    return await request<Olimpiada>("/api/olimpiadas/"+id)
}