import { useState } from "react";
import { useParams } from "react-router-dom";
import { crearListaPostulante } from "@/models/api/postulantes";

interface CreateListProps {
  number?: number;
  refresh?: () => void;
}

export function useCreateListViewModel({
  number = 1,
  refresh = () => {},
}: CreateListProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { ci, olimpiada_id } = useParams();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      if (!ci || !olimpiada_id) return;
      await crearListaPostulante({
        ci,
        olimpiada_id,
        nombre_lista: nombre || `Lista ${number}`,
      });

      setSuccess("La lista se creó correctamente.");
      setOpen(false);
      setNombre("");
      refresh();
    } catch (e: unknown) {
      setError(
        e instanceof Error && e.message
          ? e.message
          : "No se pudo registrar la lista. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
  };

  const handleErrorClose = () => {
    setError(null);
  };

  const handleSuccessClose = () => {
    setSuccess(null);
  };

  return {
    open,
    error,
    success,
    nombre,
    loading,
    handleSubmit,
    handleOpenChange,
    handleNombreChange,
    handleErrorClose,
    handleSuccessClose,
  };
} 