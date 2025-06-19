import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInscritosPorLista } from "@/models/api/postulantes";
import { cambiarEstadoLista } from "@/models/api/listas";
import { toast } from "sonner";
import { useOlimpiada } from "@/models/getCacheResponsable/useOlimpiadas";
import { apiClient } from "@/models/api/solicitudes";
import type { Postulante } from "@/models/interfaces/columnas";
import type { StepData } from "@/components/StepFormPostulante";

export const useCodigoListaViewModel = () => {
  const [data, setData] = useState<Postulante[]>([]);
  const { codigo_lista, olimpiada_id, ci } = useParams();
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editar, setEditar] = useState(false);
  const {
    data: olimpiada,
    isLoading: olimpiadaLoading,
    isError: olimpiadaError,
  } = useOlimpiada(Number(olimpiada_id));
  const [openForm, setOpenForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (olimpiadaError) {
      console.error("Error al obtener olimpiada");
    }
  }, [olimpiadaError]);

  const refresh = async () => {
    if (!codigo_lista) return;
    const data = await getInscritosPorLista(codigo_lista);
    setData(data.data);
  };

  const fetchData = async () => {
    if (!codigo_lista) return;
    setLoading(true);
    try {
      const data = await getInscritosPorLista(codigo_lista);
      setData(data.data);
      setEditar(data.estado === "Preinscrito");
      setNotFound(false);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: StepData) => {
    if (!codigo_lista) return;
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
    try {
      await apiClient.post("/api/inscripciones", payload);
      toast.success("Postulante inscrito correctamente");
      await refresh();
    } catch (e: unknown) {
      throw e instanceof Error ? e : new Error(String(e));
    }
    setOpenForm(false);
  };

  const terminarRegistro = async (onFinish?: () => void) => {
    if (!codigo_lista || !olimpiada_id || !ci) return;
    try {
      await cambiarEstadoLista(codigo_lista, "Pago Pendiente");
      if (onFinish) {
        onFinish();
      } else {
        navigate(`/inscribir/${olimpiada_id}/${ci}`);
      }
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
    olimpiada,
    olimpiadaLoading,
    openForm,
    setOpenForm,
    onSubmit,
    terminarRegistro,
    fetchData,
  };
};
