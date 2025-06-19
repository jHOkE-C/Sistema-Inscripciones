import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInscritosPorLista } from "@/models/api/postulantes";
import { toast } from "sonner";
import { cambiarEstadoLista } from "@/models/api/listas";
import { apiClient } from "@/models/api/solicitudes";
import { useOlimpiada } from "@/models/getCacheResponsable/useOlimpiadas";
import type { Postulante } from "@/models/interfaces/columnas";
import type { StepData } from "@/components/StepFormPostulante";

export const useCodigoListaViewModel = () => {
  const [data, setData] = useState<Postulante[]>([]);
  const { codigo_lista, olimpiada_id, ci } = useParams();
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editar, setEditar] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const navigate = useNavigate();

  const {
    data: olimpiada,
    isLoading: olimpiadaLoading,
    isError: olimpiadaError,
  } = useOlimpiada(Number(olimpiada_id));

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (olimpiadaError) {
      console.error("Error al obtener olimpiada");
    }
  }, [olimpiadaError]);

  const refresh = async () => {
    const data = await getInscritosPorLista(codigo_lista!);
    console.log("nuevos datos", data.data);
    setData(data.data);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getInscritosPorLista(codigo_lista!);
      setData(data.data);
      console.log(data.estado, data.estado !== "Preinscrito");
      setEditar(data.estado === "Preinscrito");
      setNotFound(false);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: StepData) => {
    const date = data.fecha_nacimiento;
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
    const payload = {
      ...data,
      codigo_lista,
      fecha_nacimiento: formattedDate,
    };
    console.log("payload", payload);
    try {
      await apiClient.post("/api/inscripciones", payload);
      toast.success("Postulante inscrito correctamente");
      await refresh();
    } catch (e: unknown) {
      throw e instanceof Error ? e : new Error(String(e));
    }
    setOpenForm(false);
  };

  const terminarRegistro = async () => {
    try {
      await cambiarEstadoLista(codigo_lista!, "Pago Pendiente");
      navigate(`/inscribir/${olimpiada_id}/${ci}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ocurrio un error inesperado");
      }
    }
  };

  return {
    data,
    notFound,
    loading,
    editar,
    openForm,
    setOpenForm,
    olimpiada,
    olimpiadaLoading,
    onSubmit,
    terminarRegistro,
  };
};
