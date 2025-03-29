import { useState, useCallback } from "react";

export const API_URL = import.meta.env.VITE_API_URL;

export function useApiRequest<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const request = useCallback(
    async (
      endpoint: string,
      method: string = "GET",
      body?: unknown,
      headers: Record<string, string> = {}
    ): Promise<{ data: T | null; error: string | null }> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}${endpoint}`, {
          method,
          body: body ? JSON.stringify(body) : undefined,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
        });
        if (!res.ok) {
          // Intentamos obtener el error devuelto por el servidor
          const errorText = await res.text();
          throw new Error(`Error ${res.status}: ${res.statusText} - ${errorText}`);
        }
        const result: T = await res.json();
        setData(result);
        return { data: result, error: null };
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        return { data: null, error: err instanceof Error ? err.message : "An unknown error occurred" };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { request, loading, error, data };
}
