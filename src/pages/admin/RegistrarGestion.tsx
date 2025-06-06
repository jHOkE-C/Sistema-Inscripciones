"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { es } from "date-fns/locale";
import axios from "axios";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export default function GestionRegistration({
  refresh,
}: {
  refresh: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [managementPeriod, setManagementPeriod] = useState("");
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const currentYear = new Date().getFullYear();
  const [precio, setPrecio] = useState<string | number>(15);
  const [limite, setLimite] = useState<string>("1");
  const [descripcion, setDescripcion] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const start = startDate ? format(startDate, "yyyy-MM-dd") : null;
    const end = endDate ? format(endDate, "yyyy-MM-dd") : null;
    try {
      const data = {
        nombre: name,
        gestion: managementPeriod,
        fecha_inicio: start,
        fecha_fin: end,
        precio_inscripcion: precio,
        limite_inscripciones: limite,
        descripcion_convocatoria: descripcion,
      };
      console.log(data);
      const response = await axios.post(`${API_URL}/api/olimpiadas`, data);
      console.log(response);

      setName("");
      setManagementPeriod("");
      setStartDate(new Date());
      setEndDate(undefined);
      setOpen(false);
      refresh();
      toast.success("La Olimpiada se creó correctamente.");
    } catch {
      toast.error("No se pudo registrar la gestion. Intente nuevamente");
    }
  };

  useEffect(() => {
    setEndDate(undefined);
  }, [startDate]);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="h-full py-6 bg-emerald-600 hover:bg-emerald-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg text-lg"
            asChild
          >
            <div>
              <PlusCircle className="size-8 mb-1" />
              Crear Olimpiada
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Crear Version</DialogTitle>
              <DialogDescription>
                Introduce los detalles de la nueva versión de olimpiada.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre de la version
                </Label>
                <Input
                  id="name"
                  value={name}
                  maxLength={50}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gestion" className="text-right">
                  Selección de gestión
                </Label>
                <Select
                  value={managementPeriod}
                  onValueChange={setManagementPeriod}
                  required
                >
                  <SelectTrigger className="col-span-3" id="gestion">
                    <SelectValue placeholder="Selecciona Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={`${currentYear} - I`}>
                      {currentYear} - I
                    </SelectItem>
                    <SelectItem value={`${currentYear} - II`}>
                      {currentYear} - II
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="ml-auto text-right">
                  Fecha inicio
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="startDate"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "PPP", {
                            locale: es,
                          })
                        ) : (
                          <span>Seleccionar una fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setStartDate(date)}
                        initialFocus
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="ml-auto text-right">
                  Fecha fin
                </Label>

                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="endDate"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "PPP", {
                            locale: es,
                          })
                        ) : (
                          <span>Seleccionar una fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={
                          setEndDate ??
                          new Date(
                            new Date(startDate).setDate(
                              startDate.getDate() + 30
                            )
                          )
                        }
                        locale={es}
                        initialFocus
                        defaultMonth={
                          new Date(
                            new Date(startDate).setDate(
                              startDate.getDate() + 30
                            )
                          )
                        }
                        disabled={(date) =>
                          date <
                          new Date(
                            new Date(startDate).setDate(
                              startDate.getDate() + 30
                            )
                          )
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="precio" className="text-right">
                  Precio por inscripción (Bs)
                </Label>
                <Input
                  id="precio"
                  placeholder="Ingrese Precio"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className="col-span-3"
                  type="number"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="limite" className="text-right">
                  Límite de inscripciones
                </Label>
                <Input
                  id="limite"
                  value={limite}
                  maxLength={50}
                  onChange={(e) => setLimite(e.target.value)}
                  className="col-span-3"
                  type="number"
                  min={1}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="descripcion" className="ml-auto text-right">
                  Descripción
                </Label>
                <Textarea
                  id="descripcion"
                  value={descripcion}
                  maxLength={255}
                  placeholder="Ingrese una descripción detallada de la olimpiada"
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="text-white">
                Crear
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
