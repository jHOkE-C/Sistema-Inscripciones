import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getListasPostulantes } from "@/models/api/postulantes";
import type { ListaPostulantes } from "@/views/inscribir/columns";
import type { ColumnDef } from "@tanstack/react-table";
import { columns } from "@/views/inscribir/columns";

export const useListasPageViewModel = () => {
  const [data, setData] = useState<ListaPostulantes[]>([]);
  const [openFormResponsable, setOpenFormResponsable] = useState(false);
  const [loading, setLoading] = useState(false);
  const { ci, olimpiada_id } = useParams();

  useEffect(() => {
    if (ci && ci.length >= 7 && ci.length <= 10) fetchData();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const { data } = await getListasPostulantes(ci!);
      setData(data.filter(({ olimpiada_id: id }) => id == olimpiada_id));
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