"use client";

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
import type { Category } from "@/models/interfaces/areas&categorias";
import { useEditCategoryModalViewModel } from "@/viewModels/usarVistaModelo/privilegios/categoria/useEditCategoryModalViewModel";

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
  const {
    minimoGrado,
    setMinimoGrado,
    maximoGrado,
    setMaximoGrado,
    error,
    handleSubmit,
    handleClose,
    gradeOptions,
  } = useEditCategoryModalViewModel({
    onClose,
    category,
    onEditCategory,
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
