import type { ListaPostulantes } from "@/pages/inscribir/columns";
import { request } from "./request";

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
        "/api/listas/responsables/" + ci + "/listas",
        {
            method: "GET",
        }
    );
};

export const crearListaPostulante = async (data: {
    ci: string;
    nombre_lista: string;
}) => {
    console.log(data);
    return request<{ message: string; codigo_lista: string }>("/api/listas", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
    });
};
