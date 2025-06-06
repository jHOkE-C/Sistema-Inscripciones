"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/models/interfaces/area-Category";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  onEditCategory: (updates: {
    minimo_grado: number;
    maximo_grado: number;
  }) => void;
}

export default function EditCategoryModal({
  isOpen,
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Categoría: {category.nombre}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="minimo" className="text-right">
              Grado Mínimo
            </Label>
            <Select
              onValueChange={(value) => setMinimoGrado(Number.parseInt(value))}
              value={minimoGrado.toString()}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar grado" />
              </SelectTrigger>
              <SelectContent>
                {gradeOptions.map((grade) => (
                  <SelectItem key={grade.value} value={grade.value.toString()}>
                    {grade.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maximo" className="text-right">
              Grado Máximo
            </Label>
            <Select
              onValueChange={(value) => setMaximoGrado(Number.parseInt(value))}
              value={maximoGrado.toString()}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar grado" />
              </SelectTrigger>
              <SelectContent>
                {gradeOptions.map((grade) => (
                  <SelectItem key={grade.value} value={grade.value.toString()}>
                    {grade.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
