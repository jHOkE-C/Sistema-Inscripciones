// request.ts
import { API_URL } from "@/hooks/useApiRequest";

export async function request<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(API_URL + endpoint, options);

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.error || "Error desconocido");
    }

    return responseData;
}
