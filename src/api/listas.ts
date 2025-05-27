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
export const pagarLista = async (codigo: string, n_orden: string, fecha: string, ordenPago: string) => {

    const fechaNormalizada = normalizarFecha(fecha);
    console.log({recibo_caja: n_orden, fecha:fechaNormalizada, codigo_lista: codigo, n_orden_pago: ordenPago});
    return await request(`/api/ordenes-pago/pagar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recibo_caja: n_orden, fecha:fechaNormalizada, codigo_lista: codigo, n_orden_pago: ordenPago }),
    });
};

const normalizarFecha = (fecha: string): string => {
  const [dd, mm, yyyy] = fecha.split("-");
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
};
