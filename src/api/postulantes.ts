import type { ListaPostulantes } from "@/pages/inscribir/columns";
import { request } from "./request";
import type { Postulante } from "@/pages/inscribir/[olimpiada_id]/[ci]/columns";

export const postDataPostulante = async (
    values: Record<
        string,
        string | number | boolean | Date | { id_area: number; id_cat: number }[]
    >
) => {
    console.log(values);
    return await request("/api/inscripciones", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
    });
};
export const getListasPostulantes = async (ci: string) => {
    return request<{ data: ListaPostulantes[] }>(
        "/api/listas/responsable/" + ci,
        {
            method: "GET",
        }
    );
};

export const crearListaPostulante = async (data: {
    ci: string;
    olimpiada_id: string;
    nombre_lista: string;
}) => {
    console.log(data);
    return request<{ message: string; codigo_lista: string }>("/api/listas", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
    });
};

export const getInscritosPorLista = (codigo: string) => {
    return request<{ data: { inscripciones: Postulante[] } }>(
        "/api/listas/codigo/" + codigo,
        {
            method: "GET",
        }
    );
};
