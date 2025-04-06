// request.ts
import { API_URL } from "@/hooks/useApiRequest";

export async function request<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    if (import.meta.env.DEV) {
        console.log(`%c[Request] → ${url}`, "color: blue");
        console.log("%c[Options]", "color: cyan", options);
    }

    let response: Response;
    try {
        response = await fetch(url, options);
    } catch (err) {
        console.error("%c[Network Error]", "color: red", err);
        throw new Error("Error de red. Verifica tu conexión o la URL.");
    }

    let responseData;
    try {
        responseData = await response.json();
    } catch (err) {
        console.error("%c[JSON Parse Error]", "color: red", err);
        throw new Error("La respuesta no es un JSON válido.");
    }

    if (import.meta.env.DEV) {
        console.log("%c[Response Status]", "color: green", response.status);
        console.log("%c[Response Data]", "color: magenta", responseData);
    }

    if (!response.ok) {
        const message =
            responseData?.error || "Error desconocido del servidor.";
        console.error("%c[Request Failed]", "color: red", message);
        throw new Error(message);
    }

    return responseData;
}
