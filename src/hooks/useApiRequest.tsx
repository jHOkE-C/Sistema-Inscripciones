import { useState, useCallback } from "react";

export const API_URL = import.meta.env.VITE_API_URL;

export function useApiRequest<T>(baseEndpoint: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  // Función para obtener datos (GET)
  const fetchData = useCallback(
    async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}${baseEndpoint}`);
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const result: T = await res.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocurrió un error inesperado");
      } finally {
        setLoading(false);
      }
    },
    [baseEndpoint]
  );

  // Función genérica para peticiones (GET, POST, DELETE, PUT)
  const request = useCallback(
    async (method: string, body?: unknown, suffix: string = "") => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}${baseEndpoint}${suffix}`, {
          method,
          headers: { "Content-Type": "application/json" },
          body: body ? JSON.stringify(body) : undefined,
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        // Recargar datos después de la operación
        await fetchData();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocurrió un error inesperado");
      } finally {
        setLoading(false);
      }
    },
    [baseEndpoint, fetchData]
  );

  return { data, error, loading, fetchData, request };
}
