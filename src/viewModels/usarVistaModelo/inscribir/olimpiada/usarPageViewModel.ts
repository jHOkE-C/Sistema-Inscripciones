import { useState, useEffect } from "react";
import { getListasPostulantes } from "@/models/api/postulantes";
import { useOlimpiada } from "@/models/getCacheResponsable/useOlimpiadas";
import { useParams } from "react-router-dom";
import { ButtonConfig } from "@/models/interfaces/buttons.interface";
import { Receipt, List, CheckCircle } from "lucide-react";

export const usePageViewModel = () => {
  const [openFormResponsable, setOpenFormResponsable] = useState(false);
  const [loading, setLoading] = useState(true);
  const { ci, olimpiada_id } = useParams();
  
  const {
    data: olimpiada,
    isLoading: olimpiadaLoading,
    isError: olimpiadaError,
  } = useOlimpiada(Number(olimpiada_id));

  
  const buttons: ButtonConfig[] = [
    {
      label: "Generar Orden de Pago",
      to: `generarOrden`,
      Icon: Receipt,
      color: "amber",
    },
    {
      label: "Subir Comprobante de Pago",
      to: `subirComprobanteDePago`,
      Icon: CheckCircle,
      color: "slate",
    },
    {
      label: "Ver Inscripciones",
      to: `listas`,
      Icon: List,
    }
  ];

  const refresh = async () => {
    setLoading(true);
    try {
      await getListasPostulantes(ci!);
      setOpenFormResponsable(false);
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

  useEffect(() => {
    if (!ci || ci.length < 7 || ci.length > 10) return;
    fetchData();
  }, [ci]);

  useEffect(() => {
    if (olimpiadaError) {
      console.error("Error al obtener olimpiada");
    }
  }, [olimpiadaError]);

  const isValidCI = ci && ci.length >= 7 && ci.length <= 10;
  const isInscripcionPhase = olimpiada?.fase?.fase.nombre_fase.includes("inscripción");

  return {
    openFormResponsable,
    setOpenFormResponsable,
    loading,
    olimpiada,
    olimpiadaLoading,
    buttons,
    isValidCI,
    isInscripcionPhase,
    fetchData
  };
}; 