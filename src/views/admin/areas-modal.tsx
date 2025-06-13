"use client";

import { Layers, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { useAreasModalViewModel } from "@/viewModels/admin/useAreasModalViewModel";

export function AreasModal() {
  const { open, setOpen } = useAreasModalViewModel();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="h-auto p-10 bg-sky-600 hover:bg-sky-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Layers className="size-8 mb-1" />
          <span className="text-lg font-semibold">Gestionar áreas</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Gestionar Áreas
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Seleccione una acción para administrar las áreas
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <Link to="/admin/area/agregar">
              <Button className="flex items-center justify-center gap-2 h-14 text-white bg-blue-600 hover:bg-blue-700 w-full">
                <PlusCircle className="h-5 w-5" />
                <span className="font-medium">Agregar un área</span>
              </Button>
            </Link>
            <Link to="/admin/area/dar-de-baja">
              <Button
                className="flex items-center justify-center gap-2 h-14 w-full text-white bg-rose-500 hover:bg-rose-600"
              >
                <Trash2 className="h-5 w-5" />
                <span className="font-medium">Dar de baja un área</span>
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
