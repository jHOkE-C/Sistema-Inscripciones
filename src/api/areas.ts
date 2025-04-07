import { request } from "./request";

export interface Area {
    id: string;
    nombre: string;
}
export interface Categoria {
    id: string;
    maximo_grado: number;
    minimo_grado: number;
    nombre: string;
    areas: Area[];
}

export const getCategoriaAreaPorGrado = async (
    grado: string
) => {
    return await request<Categoria[]>(`/api/categorias/areas/curso/${grado}`);
};

export const crearArea = async (data: { nombre: string }) => {
    return await request("/api/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
};

export const eliminarArea = async (id: number) => {
    return await request(`/api/areas/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
};
