import { useState } from "react";
import { toast } from "sonner";
import type { Category } from "@/models/interfaces/areas&categorias";

interface CreateCategoryModalProps {
  onClose: () => void;
  onCreateCategory: (category: Omit<Category, "id" | "areas">) => void;
}

export function useCreateCategoryModalViewModel({
  onClose,
  onCreateCategory,
}: CreateCategoryModalProps) {
  const [nombre, setNombre] = useState("");
  const [minimoGrado, setMinimoGrado] = useState<number | null>(null);
  const [maximoGrado, setMaximoGrado] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // Validate form
    if (!nombre.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    if (minimoGrado === null) {
      toast.error("El grado mínimo es requerido");
      return;
    }

    if (maximoGrado === null) {
      toast.error("El grado máximo es requerido");
      return;
    }

    if (minimoGrado > maximoGrado) {
      toast.error("El grado mínimo no puede ser mayor que el grado máximo");
      return;
    }

    onCreateCategory({
      nombre,
      minimo_grado: minimoGrado,
      maximo_grado: maximoGrado,
    });

    setNombre("");
    setMinimoGrado(null);
    setMaximoGrado(null);
    setError("");
  };

  const handleClose = () => {
    setNombre("");
    setMinimoGrado(null);
    setMaximoGrado(null);
    setError("");
    onClose();
  };

  const gradeOptions = Array.from({ length: 12 }, (_, i) => {
    const grade = i + 1;
    const label =
      grade <= 6 ? `${grade}° Primaria` : `${grade - 6}° Secundaria`;
    return { value: grade, label };
  });

  return {
    nombre,
    setNombre,
    minimoGrado,
    setMinimoGrado,
    maximoGrado,
    setMaximoGrado,
    error,
    handleSubmit,
    handleClose,
    gradeOptions,
  };
}
