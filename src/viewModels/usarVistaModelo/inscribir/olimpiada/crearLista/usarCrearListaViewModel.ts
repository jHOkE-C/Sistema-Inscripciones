import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { crearListaPostulante, getListasPostulantes } from "@/models/api/postulantes";
import type { ListaPostulantes } from "@/views/inscribir/columns";
import type { ColumnDef } from "@tanstack/react-table";
import { columns } from "@/views/inscribir/columns";
import { toast } from "sonner";

export const usarCrearListaViewModel = () => {
  const [data, setData] = useState<ListaPostulantes[]>([]);
  const [openFormResponsable, setOpenFormResponsable] = useState(false);
  const [loading, setLoading] = useState(false);
  const { ci, olimpiada_id } = useParams();

  useEffect(() => {
    if (ci && ci.length >= 7 && ci.length <= 10) fetchData();
  }, []);

  const refresh = async () => {
    if (!ci || !olimpiada_id) return;
    setLoading(true);
    try {
      const { data } = await getListasPostulantes(ci);
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

  const crearLista = async () => {
    if (!ci || !olimpiada_id) return;
    setLoading(true);
    try {
      await crearListaPostulante({
        ci,
        olimpiada_id,
      });
      await refresh();
      toast.success("La inscripcion se creó correctamente.");
    } catch {
      toast.error("No se pudo registrar la inscripcion. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const isValidCI = ci && ci.length >= 7 && ci.length <= 10;

  return {
    data,
    openFormResponsable,
    setOpenFormResponsable,
    loading,
    isValidCI,
    columnsWithActions,
    crearLista
  };
}; 