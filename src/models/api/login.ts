import { request } from "./solicitudes";
interface LoginValues {
  nombre_usuario: string;
  password: string;
}

interface LoginResponse {
  usuario: string;
  token: string;
  roles: string[];
  accesos: string[];
}

export const login = async (values: LoginValues): Promise<LoginResponse> => {
  return await request<LoginResponse>("/api/login", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(values),
  });
};
