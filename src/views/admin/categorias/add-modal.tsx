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
import type { Category, Area } from "@/models/interfaces/areas&categorias";
import { useAddAreaModalViewModel } from "@/viewModels/usarVistaModelo/privilegios/categoria/useAddAreaModalViewModel";

interface AddAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  availableAreas: Area[];
  onAddArea: (areaId: number) => void;
}

export default function AddAreaModal({
  isOpen,
  onClose,
  category,
  availableAreas,
  onAddArea,
}: AddAreaModalProps) {
  const {
    selectedAreaId,
    setSelectedAreaId,
    error,
    handleSubmit,
    handleClose,
  } = useAddAreaModalViewModel({
    onClose,
    onAddArea,
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Área a Categoría: {category.nombre}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          {availableAreas.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No hay áreas disponibles para añadir a esta categoría.
            </div>
          ) : (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="area" className="text-right">
                Área
              </Label>
              <Select
                onValueChange={(value) =>
                  setSelectedAreaId(Number.parseInt(value))
                }
                value={selectedAreaId?.toString() || ""}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar área" />
                </SelectTrigger>
                <SelectContent>
                  {availableAreas.map((area) => (
                    <SelectItem key={area.id} value={area.id.toString()}>
                      {area.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={availableAreas.length === 0}>
            Añadir Área
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
