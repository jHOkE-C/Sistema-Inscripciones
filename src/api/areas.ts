
import { request } from "./request";

export interface Area {
    id: string;
    nombre: string;
    vigente: boolean;
    categorias?: Categoria[]
}
export interface Categoria {
    id: string;
    maximo_grado: number;
    minimo_grado: number;
    nombre: string;
    areas: Area[];
    areaId: number;
    areaNombre: string;
    vigente: boolean;
}
export interface Provincia {
    id: string;
    nombre: string;
    departamento_id: string;
}
export interface Departamento {
    id: string;
    nombre: string;
}
export interface Colegio {
    id: string;
    nombre: string;
}

export const getCategoriaAreaPorGrado = async (grado: string,olimpiada_id:string) => {
    return await request<Categoria[]>(`/api/categorias/areas/curso/${grado}/olimpiada/${olimpiada_id}`);
};

export const getCategoriaAreaPorGradoOlimpiada = async (
    grado: string,
    olimpiada: string
) => {
    return await request<Categoria[]>(
        `/api/categorias/areas/curso/${grado}/olimpiada/${olimpiada}`
    );
};
export const crearArea = async (data: { nombre: string }) => {
    return await request("/api/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
};

export const darDeBajaArea = async (id: number) => {
    return await request(`/api/areas/${id}/deactivate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
    });
};
