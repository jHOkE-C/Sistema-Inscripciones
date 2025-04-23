"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "./types";
import { toast } from "sonner";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCategory: (category: Omit<Category, "id" | "areas">) => void;
}

export default function CreateCategoryModal({
  isOpen,
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Categoría</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nombre" className="text-right">
              Nombre de la Categoría
            </Label>
            <Input
              id="nombre"
              value={nombre}
              maxLength={40}
              onChange={(e) => setNombre(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="minimo" className="text-right">
              Grado Mínimo
            </Label>
            <Select
              onValueChange={(value) => setMinimoGrado(Number.parseInt(value))}
              value={minimoGrado?.toString() || ""}
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
              value={maximoGrado?.toString() || ""}
              disabled={!minimoGrado} // Deshabilitar si no se ha seleccionado el grado mínimo
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar grado" />
              </SelectTrigger>
              <SelectContent>
                {gradeOptions
                  .filter((grade) => !minimoGrado || grade.value >= minimoGrado) // Filtrar opciones según el grado mínimo
                  .map((grade) => (
                    <SelectItem
                      key={grade.value}
                      value={grade.value.toString()}
                    >
                      {grade.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Agrear Categoría</Button>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
