import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getInscritosPorLista,
  postDataPostulante,
} from "@/models/api/postulantes";
import { cambiarEstadoLista } from "@/models/api/listas";
import type { Postulante } from "@/models/interfaces/columnas";
import type { postulanteSchema } from "@/components/FormPostulante";
import type { z } from "zod";
import { toast } from "sonner";

export const usarCodigoViewModel = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Postulante[]>([]);
  const { ci, codigo, olimpiada_id } = useParams();
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editar, setEditar] = useState(false);

  useEffect(() => {
    if (codigo) fetchData();
  }, []);

  const refresh = async () => {
    if (!codigo) return;
    const data = await getInscritosPorLista(codigo);
    setData(data.data);
  };

  const fetchData = async () => {
    if (!codigo) return;
    setLoading(true);
    try {
      const data = await getInscritosPorLista(codigo);
      setData(data.data);
      setEditar(data.estado === "Preinscrito");
      setNotFound(false);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const terminarRegistro = async () => {
    if (!codigo || !olimpiada_id || !ci) return;
    try {
      await cambiarEstadoLista(codigo, "Pago Pendiente");
      navigate(`/inscribir/${olimpiada_id}/${ci}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const onSubmit = async (data: z.infer<typeof postulanteSchema>) => {
    if (loading || !codigo) return;
    setLoading(true);
    try {
      await postDataPostulante({ ...data, codigo_lista: codigo });
      toast.success("El postulante fue registrado exitosamente");
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Hubo un error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    notFound,
    loading,
    editar,
    onSubmit,
    terminarRegistro,
  };
};
