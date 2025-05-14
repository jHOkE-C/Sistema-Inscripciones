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
export const pagarLista = async (codigo: string, n_orden: string, fecha: string) => {
    return await request(`/api/ordenes-pago/pagar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recibo_caja: n_orden, fecha, codigo_lista: codigo }),
    });
};
