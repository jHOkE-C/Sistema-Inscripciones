import { API_URL } from "@/hooks/useApiRequest";

export async function request<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    const mergedOptions: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options?.headers || {}),
        },
    };

    if (import.meta.env.DEV) {
        // Agrupamos los detalles de la solicitud y la respuesta en un solo objeto
        const requestDetails = {
            request: {
                url,
                options: mergedOptions,
            },
            response: {
                status: null,
                data: null,
                error: null,
            },
        };
        // Mostrar la solicitud
        console.log(`%c[Request] →`, "color: blue", requestDetails.request);
    }

    let response: Response;
    let responseData: T;

    try {
        // Realizamos la solicitud fetch con opciones actualizadas
        response = await fetch(url, mergedOptions);

        // Intentamos parsear la respuesta como JSON
        responseData = await response.json();

        // Si la solicitud fue exitosa, mostramos los detalles
        if (import.meta.env.DEV) {
            const requestDetails = {
                request: {
                    url,
                    options: mergedOptions,
                },
                response: {
                    status: response.status,
                    data: responseData,
                    error: null,
                },
            };
            console.log(
                `%c[Response] →`,
                "color: magenta",
                requestDetails.response
            );
        }

        // Comprobamos si la respuesta no es satisfactoria
        if (!response.ok) {
            const message =
                (responseData as { error?: string })?.error ||
                "Error desconocido del servidor.";
            throw new Error(message);
        }
    } catch (err) {
        if (import.meta.env.DEV) {
            const requestDetails = {
                request: {
                    url,
                    options: mergedOptions,
                },
                response: {
                    status: null,
                    data: null,
                    error: err instanceof Error ? err.message : "Unknown error",
                },
            };
            console.error(`%c[Request Failed] →`, "color: red", requestDetails);
        }
        throw new Error(
            err instanceof Error ? err.message : "Error desconocido"
        );
    }

    return responseData;
}

export class ApiClient {
    constructor() {}
    get<T>(endpoint: string) {
        return request<T>(endpoint, { method: "GET" });
    }

    post<T,U>(endpoint: string, body: U) {
        return request<T>(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    put<T,U>(endpoint: string, body: U) {
        return request<T>(endpoint, {
            method: "PUT",
            body: JSON.stringify(body),
        });
    }

    delete<T>(endpoint: string) {
        return request<T>(endpoint, { method: "DELETE" });
    }
}

export const apiClient = new ApiClient();
