import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import { toast } from "sonner";
import type {
  Consulta,
  Responsable,
  Postulante,
} from "@/models/interfaces/consultarEstado.types";

export const useConsultarInscripcionViewModel = () => {
  const [carnet, setCarnet] = useState("");
  const [error, setError] = useState("");
  const [responsable, setResponsable] = useState<Responsable | null>(null);
  const [postulante, setPostulante] = useState<Postulante | null>(null);

  const clean = () => {
    setCarnet("");
    setPostulante(null);
    setResponsable(null);
    sessionStorage.removeItem("postulante");
    sessionStorage.removeItem("responsable");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCarnet(value);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!carnet) {
      setError("Por favor ingrese su número de carnet");
      return;
    }

    try {
      const req = await axios.get<Consulta>(
        `${API_URL}/api/inscripciones/ci/${carnet}`
      );

      if (req.data.postulante) {
        setPostulante(req.data.postulante);
        sessionStorage.setItem(
          "postulante",
          JSON.stringify(req.data.postulante)
        );
        setResponsable(null);
        toast.success("Carnet encontrado");
      } else if (req.data.responsable) {
        setResponsable(req.data.responsable);
        sessionStorage.setItem(
          "responsable",
          JSON.stringify(req.data.responsable)
        );
        setPostulante(null);
        toast.success("Carnet encontrado");
      } else {
        toast.error("El carnet ingresado no tiene registros o inscripciones");
      }

      sessionStorage.setItem("ci-consulta", carnet);
    } catch (error) {
      console.error("Error al consultar:", error);
      toast.error("El carnet ingresado no tiene registros o inscripciones");
    }
  };

  useEffect(() => {
    const savedResp = sessionStorage.getItem("responsable");
    if (savedResp) {
      setResponsable(JSON.parse(savedResp));
    }

    const savedPost = sessionStorage.getItem("postulante");
    if (savedPost) {
      setPostulante(JSON.parse(savedPost));
    }
  }, []);

  return {
    carnet,
    error,
    responsable,
    postulante,
    handleInputChange,
    handleSubmit,
    clean,
  };
};
