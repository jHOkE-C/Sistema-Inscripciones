import { request } from "./request";

export interface Area {
    id: string;
    nombre: string;
}

export const getAreaPorGrado = async (grado: string): Promise<Area[]> => {
    return await request<Area[]>(`/api/curso/${grado}/areas`);
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
