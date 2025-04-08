import type { ListaPostulantes } from "@/pages/inscribir/columns";
import { request } from "./request";

interface Values {
    [key: string]: string | number | boolean;
}

export const postDataPostulante = async (values: Values): Promise<void> => {
    console.log("Formulario enviado con datos:", values);
};
export const getListasPostulantes = async (
    ci: string
) => {
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
