import { request } from "./request";
interface LoginValues {
    nombre_usuario: string;
    password: string;
}

interface LoginResponse {
    usuario: string;
    token: string;
}

export const login = async (values: LoginValues): Promise<LoginResponse> => {
    return await request<LoginResponse>("/api/login", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(values),
    });
};
