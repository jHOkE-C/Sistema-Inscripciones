import { useState, useEffect } from "react";
import type { Category } from "@/models/interfaces/areas&categorias";

interface EditCategoryModalProps {
  onClose: () => void;
  category: Category;
  onEditCategory: (updates: {
    minimo_grado: number;
    maximo_grado: number;
  }) => void;
}

export function useEditCategoryModalViewModel({
  onClose,
  category,
  onEditCategory,
}: EditCategoryModalProps) {
  const [minimoGrado, setMinimoGrado] = useState<number>(category.minimo_grado);
  const [maximoGrado, setMaximoGrado] = useState<number>(category.maximo_grado);
  const [error, setError] = useState("");

  // Update state when category changes
  useEffect(() => {
    if (category) {
      setMinimoGrado(category.minimo_grado);
      setMaximoGrado(category.maximo_grado);
    }
  }, [category]);

  const handleSubmit = () => {
    // Validate form
    if (minimoGrado > maximoGrado) {
      setError("El grado mínimo no puede ser mayor que el grado máximo");
      return;
    }

    // Update category
    onEditCategory({
      minimo_grado: minimoGrado,
      maximo_grado: maximoGrado,
    });

    setError("");
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  // Generate grade options (1ro primaria to 6to secundaria)
  const gradeOptions = Array.from({ length: 12 }, (_, i) => {
    const grade = i + 1;
    const label =
      grade <= 6 ? `${grade}° Primaria` : `${grade - 6}° Secundaria`;
    return { value: grade, label };
  });

  return {
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
