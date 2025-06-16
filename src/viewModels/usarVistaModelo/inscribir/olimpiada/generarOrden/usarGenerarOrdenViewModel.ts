import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getListasPostulantes } from "@/models/api/postulantes";
import type { ListaPostulantes } from "@/views/inscribir/columns";
import type { ColumnDef } from "@tanstack/react-table";
import { columns } from "@/views/inscribir/columns";

export const useGenerarOrdenViewModel = () => {
  const [data, setData] = useState<ListaPostulantes[]>([]);
  const { ci, olimpiada_id } = useParams();
  const [openFormResponsable, setOpenFormResponsable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ci && ci.length >= 7 && ci.length <= 10) fetchData();
  }, []);

  const refresh = async () => {
    if (!ci || !olimpiada_id) return;
    setLoading(true);
    try {
      const { data } = await getListasPostulantes(ci);
      const filtrados = data.filter(
        ({ olimpiada_id: id, estado }) =>
          id == olimpiada_id && estado == "Pago Pendiente"
      );
      setData(filtrados);
    } catch {
      setOpenFormResponsable(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      await refresh();
    } catch {
      console.error("Error al obtener las inscripciones de postulantes");
    }
  };

  const columnsWithActions: ColumnDef<ListaPostulantes, unknown>[] = [
    ...columns,
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        return row.original.estado === "Pago Pendiente" ? "Orden de Pago" : "Abrir Incripción";
      }
    }
  ];

  const isValidCI = ci && ci.length >= 7 && ci.length <= 10;

  return {
    data,
    openFormResponsable,
    setOpenFormResponsable,
    loading,
    isValidCI,
    columnsWithActions
  };
}; 