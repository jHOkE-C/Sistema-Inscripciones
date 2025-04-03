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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Tipo para las áreas y categorías
type Categoria = {
  id: string;
  nombre: string;
  cursoDesde: number;
  cursoHasta: number;
  areas: string[]; // IDs de las áreas a las que pertenece
};

type Area = {
  id: string;
  nombre: string;
};

export default function GestionarCategorias() {
  // Estado para las áreas
  const [areas] = useState<Area[]>([
    { id: "1", nombre: "Desarrollo" },
    { id: "2", nombre: "Diseño" },
    { id: "3", nombre: "Marketing" },
    { id: "4", nombre: "Administración" },
  ]);

  // Estado para las categorías
  const [categorias, setCategorias] = useState<Categoria[]>([
    {
      id: "1",
      nombre: "Frontend",
      cursoDesde: 1,
      cursoHasta: 3,
      areas: ["1"],
    },
    {
      id: "2",
      nombre: "Backend",
      cursoDesde: 2,
      cursoHasta: 5,
      areas: ["1"],
    },
    {
      id: "3",
      nombre: "UI/UX",
      cursoDesde: 1,
      cursoHasta: 4,
      areas: ["2"],
    },
    {
      id: "4",
      nombre: "Digital",
      cursoDesde: 3,
      cursoHasta: 6,
      areas: ["3"],
    },
    {
      id: "5",
      nombre: "Fullstack",
      cursoDesde: 3,
      cursoHasta: 6,
      areas: ["1", "2"],
    },
  ]);

  // Estado para el modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: "",
    cursoDesde: 1,
    cursoHasta: 6,
    areas: [] as string[],
  });

  // Función para abrir el modal
  const abrirModal = () => {
    setModalAbierto(true);
    setNuevaCategoria({
      nombre: "",
      cursoDesde: 1,
      cursoHasta: 6,
      areas: [],
    });
  };

  // Función para manejar la selección de áreas
  const toggleAreaSeleccion = (areaId: string) => {
    setNuevaCategoria((prev) => {
      const isSelected = prev.areas.includes(areaId);
      if (isSelected) {
        return {
          ...prev,
          areas: prev.areas.filter((id) => id !== areaId),
        };
      } else {
        return {
          ...prev,
          areas: [...prev.areas, areaId],
        };
      }
    });
  };

  // Función para añadir una nueva categoría
  const agregarCategoria = () => {
    if (!nuevaCategoria.nombre.trim() || nuevaCategoria.areas.length === 0)
      return;

    const nuevaCategoriaObj: Categoria = {
      id: `cat-${Date.now()}`,
      nombre: nuevaCategoria.nombre.trim(),
      cursoDesde: nuevaCategoria.cursoDesde,
      cursoHasta: nuevaCategoria.cursoHasta,
      areas: nuevaCategoria.areas,
    };

    setCategorias([...categorias, nuevaCategoriaObj]);
    setModalAbierto(false);
  };

  // Función para obtener las categorías de un área específica
  const getCategoriasPorArea = (areaId: string) => {
    return categorias.filter((cat) => cat.areas.includes(areaId));
  };

  // Generar opciones de cursos (del 1 al 12 por ejemplo)
  const cursos = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestionar Categorías</h1>
        <Button onClick={abrirModal} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Añadir Nueva Categoría
        </Button>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {areas.map((area) => (
          <AccordionItem key={area.id} value={area.id}>
            <AccordionTrigger className="text-lg font-medium">
              {area.nombre}
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-4 space-y-2">
                {getCategoriasPorArea(area.id).map((categoria) => (
                  <div key={categoria.id} className="p-3 border rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{categoria.nombre}</span>
                      <span className="text-sm text-muted-foreground">
                        Cursos: {categoria.cursoDesde} - {categoria.cursoHasta}
                      </span>
                    </div>
                  </div>
                ))}
                {getCategoriasPorArea(area.id).length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No hay categorías en esta área
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Modal para añadir categoría */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registrar Nueva Categoría</DialogTitle>
            <DialogDescription>
              Completa los detalles para crear una nueva categoría
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={nuevaCategoria.nombre}
                onChange={(e) =>
                  setNuevaCategoria({
                    ...nuevaCategoria,
                    nombre: e.target.value,
                  })
                }
                className="col-span-3"
                placeholder="Nombre de la categoría"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Áreas</Label>
              <div className="col-span-3 space-y-2">
                {areas.map((area) => (
                  <div key={area.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`area-${area.id}`}
                      checked={nuevaCategoria.areas.includes(area.id)}
                      onCheckedChange={() => toggleAreaSeleccion(area.id)}
                    />
                    <Label htmlFor={`area-${area.id}`}>{area.nombre}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Desde curso</Label>
              <Select
                value={nuevaCategoria.cursoDesde.toString()}
                onValueChange={(value) =>
                  setNuevaCategoria({
                    ...nuevaCategoria,
                    cursoDesde: Number.parseInt(value),
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar curso" />
                </SelectTrigger>
                <SelectContent>
                  {cursos.map((curso) => (
                    <SelectItem key={curso} value={curso.toString()}>
                      Curso {curso}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Hasta curso</Label>
              <Select
                value={nuevaCategoria.cursoHasta.toString()}
                onValueChange={(value) =>
                  setNuevaCategoria({
                    ...nuevaCategoria,
                    cursoHasta: Number.parseInt(value),
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar curso" />
                </SelectTrigger>
                <SelectContent>
                  {cursos.map((curso) => (
                    <SelectItem
                      key={curso}
                      value={curso.toString()}
                      disabled={curso < nuevaCategoria.cursoDesde}
                    >
                      Curso {curso}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
