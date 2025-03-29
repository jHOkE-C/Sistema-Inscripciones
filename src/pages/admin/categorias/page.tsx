"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Tipo para las áreas y categorías
type Categoria = {
  id: string;
  nombre: string;
};

type Area = {
  id: string;
  nombre: string;
  categorias: Categoria[];
};

export default function GestionarCategorias() {
  // Estado para las áreas y categorías
  const [areas, setAreas] = useState<Area[]>([
    {
      id: "1",
      nombre: "Desarrollo",
      categorias: [
        { id: "1-1", nombre: "Frontend" },
        { id: "1-2", nombre: "Backend" },
        { id: "1-3", nombre: "Mobile" },
      ],
    },
    {
      id: "2",
      nombre: "Diseño",
      categorias: [
        { id: "2-1", nombre: "UI/UX" },
        { id: "2-2", nombre: "Gráfico" },
        { id: "2-3", nombre: "Producto" },
      ],
    },
    {
      id: "3",
      nombre: "Marketing",
      categorias: [
        { id: "3-1", nombre: "Digital" },
        { id: "3-2", nombre: "Contenidos" },
        { id: "3-3", nombre: "Redes Sociales" },
      ],
    },
  ]);

  // Estado para el modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [areaSeleccionada, setAreaSeleccionada] = useState<Area | null>(null);
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  // Función para abrir el modal
  const abrirModal = (area: Area) => {
    setAreaSeleccionada(area);
    setModalAbierto(true);
    setNuevaCategoria("");
  };

  // Función para añadir una nueva categoría
  const agregarCategoria = () => {
    if (!areaSeleccionada || !nuevaCategoria.trim()) return;

    const nuevaCategoriaObj: Categoria = {
      id: `${areaSeleccionada.id}-${Date.now()}`,
      nombre: nuevaCategoria.trim(),
    };

    setAreas(
      areas.map((area) =>
        area.id === areaSeleccionada.id
          ? { ...area, categorias: [...area.categorias, nuevaCategoriaObj] }
          : area
      )
    );

    setModalAbierto(false);
    setNuevaCategoria("");
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gestionar Categorías</h1>

      <Accordion type="single" collapsible className="w-full">
        {areas.map((area) => (
          <AccordionItem key={area.id} value={area.id}>
            <AccordionTrigger className="text-lg font-medium">
              {area.nombre}
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-4 space-y-2">
                {area.categorias.map((categoria) => (
                  <div
                    key={categoria.id}
                    className="p-2 border rounded-md flex justify-between items-center"
                  >
                    <span>{categoria.nombre}</span>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full flex items-center justify-center"
                  onClick={() => abrirModal(area)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir Categoría
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Modal para añadir categoría */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Categoría</DialogTitle>
            <DialogDescription>
              Añadir nueva categoría al área: {areaSeleccionada?.nombre}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
                className="col-span-3"
                placeholder="Nombre de la categoría"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAbierto(false)}>
              Cancelar
            </Button>
            <Button onClick={agregarCategoria}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
