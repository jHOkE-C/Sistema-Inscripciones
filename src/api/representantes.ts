import { request } from "./request";

export const registrarRepresentante = async (values: {
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

export const getRepresentante = async (ci: string) => {
    return { nombre: "jose", email: "email@example.com", ci };
};
