import type { ListaPostulantes } from "@/pages/inscribir/columns";
import { request } from "./request";

interface Values {
    [key: string]: string | number | boolean;
}

export const postDataPostulante = async (values: Values): Promise<void> => {
    console.log("Formulario enviado con datos:", values);
};
export const getListasPostulantes = async (
    uuid: string
): Promise<ListaPostulantes[]> => {
    return request<ListaPostulantes[]>("/api/listas/responsable/" + uuid, {
        method: "GET",
    });
};

export const crearListaPostulante = async (data: {
    uuid: string;
    nombre_lista: string;
}) => {
    return request<{ message: string; codigo_lista: string }>("/api/listas", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
    });
};
