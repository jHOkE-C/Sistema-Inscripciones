"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { useRegistrarGestionViewModel } from "@/viewModels/usarVistaModelo/privilegios/useRegistrarGestionViewModel";

export default function GestionRegistration({
  refresh,
}: {
  refresh: () => void;
}) {
  const {
    open,
    setOpen,
    name,
    setName,
    managementPeriod,
    setManagementPeriod,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    currentYear,
    precio,
    setPrecio,
    limite,
    setLimite,
    descripcion,
    setDescripcion,
    handleSubmit
  } = useRegistrarGestionViewModel({ refresh });

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
                  Precio de inscripción
                </Label>
                <Input
                  id="precio"
                  type="number"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="limite" className="text-right">
                  Límite de inscripciones
                </Label>
                <Input
                  id="limite"
                  type="number"
                  value={limite}
                  onChange={(e) => setLimite(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="descripcion" className="text-right">
                  Descripción
                </Label>
                <Textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Crear</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
