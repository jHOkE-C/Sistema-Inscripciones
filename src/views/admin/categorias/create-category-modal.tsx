"use client";

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
import type { Category } from "@/models/interfaces/area-Category";
import { useCreateCategoryModalViewModel } from "@/viewModels/usarVistaModelo/privilegios/categoria/useCreateCategoryModalViewModel";

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
  const {
    nombre,
    setNombre,
    minimoGrado,
    setMinimoGrado,
    maximoGrado,
    setMaximoGrado,
    error,
    handleSubmit,
    handleClose,
    gradeOptions
  } = useCreateCategoryModalViewModel({
    onClose,
    onCreateCategory,
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
