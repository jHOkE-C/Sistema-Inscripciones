import { API_URL } from "@/hooks/useApiRequest";

export async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    if (import.meta.env.DEV) {
        // Agrupamos los detalles de la solicitud y la respuesta en un solo objeto
        const requestDetails = {
            request: {
                url,
                options
            },
            response: {
                status: null,
                data: null,
                error: null
            }
        };
        
        // Mostrar la solicitud
        console.log(`%c[Request] →`, "color: blue", requestDetails.request);
    }

    let response: Response;
    let responseData: T;

    try {
        // Realizamos la solicitud fetch
        response = await fetch(url, options);

        // Intentamos parsear la respuesta como JSON
        responseData = await response.json();

        // Si la solicitud fue exitosa, mostramos los detalles
        if (import.meta.env.DEV) {
            const requestDetails = {
                request: {
                    url,
                    options
                },
                response: {
                    status: response.status,
                    data: responseData,
                    error: null
                }
            };
            console.log(`%c[Response] →`, "color: magenta", requestDetails.response);
        }

        // Comprobamos si la respuesta no es satisfactoria
        if (!response.ok) {
            const message =
                (responseData as { error?: string })?.error || "Error desconocido del servidor.";
            throw new Error(message);
        }

    } catch (err) {
        if (import.meta.env.DEV) {
            const requestDetails = {
                request: {
                    url,
                    options
                },
                response: {
                    status: null,
                    data: null,
                    error: err instanceof Error ? err.message : "Unknown error"
                }
            };
            console.error(`%c[Request Failed] →`, "color: red", requestDetails);
        }
        throw new Error(err instanceof Error ? err.message : "Error desconocido");
    }

    return responseData;
}
