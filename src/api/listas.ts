import { request } from "./request";

export type EstadoLista =
    | "Preinscrito"
    | "Pago Pendiente"
    | "Inscripcion Completa";
export const cambiarEstadoLista = async (
    codigo: string,
    estado: EstadoLista
) => {
    return await request(`/api/listas/${codigo}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
    });
};
