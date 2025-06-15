import { apiClient, request } from "./request";

export const registrarResponsable = async (values: {
    ci: string;
    email: string;
    nombre_completo: string;
    telefono: string;
}) => {
    return await request<{ token: string; message: string; uuid: string }>(
        "/api/responsables",
        {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(values),
        }
    );
};
type Responsable = {
    id: number;
    nombre_completo: string;
    ci: string;
    email: string;
    telefono: string;
    created_at?: string;
    updated_at?: string;
};

export const getResponsable = async (
    ci: string
) => {
    return await apiClient.get<{ data: Responsable }>(
        "/api/responsables/ci/" + ci
    );
};
