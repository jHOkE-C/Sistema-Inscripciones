"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, Trash2, Edit, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_URL } from "@/hooks/useApiRequest";
import { useNavigate } from "react-router-dom";
// Define types for our data
interface Cronograma {
  id?: number;
  tipo_plazo: string;
  fecha_inicio: string;
  fecha_fin: string;
  olimpiada_id: number;
}

interface Olimpiada {
  id: number;
  nombre: string;
  gestion: string;
  fecha_inicio: string;
  fecha_fin: string;
  cronogramas: Cronograma[];
}

interface OlimpiadaData {
  olimpiada: Olimpiada;
}

const editOlimpiadaSchema = z
  .object({
    fecha_inicio: z.date(),
    fecha_fin: z.date(),
  })
  .refine(
    (data) => {
      return data.fecha_fin > data.fecha_inicio;
    },
    {
      message:
        "La fecha de finalización debe ser posterior a la fecha de inicio",
      path: ["fecha_fin"], // This tells Zod to attach the error to the fecha_fin field
    }
  );

const cronogramaSchema = z
  .object({
    tipo_plazo: z.enum(["inscripcion", "competencia", "premiacion"]),
    fecha_inicio: z.date(),
    fecha_fin: z.date(),
  })
  .refine(
    (data) => {
      return data.fecha_fin > data.fecha_inicio;
    },
    {
      message:
        "La fecha de finalización debe ser posterior a la fecha de inicio",
      path: ["fecha_fin"], // This tells Zod to attach the error to the fecha_fin field
    }
  );

const editCronogramaSchema = z
  .object({
    fecha_inicio: z.date(),
    fecha_fin: z.date(),
  })
  .refine(
    (data) => {
      return data.fecha_fin > data.fecha_inicio;
    },
    {
      message:
        "La fecha de finalización debe ser posterior a la fecha de inicio",
      path: ["fecha_fin"], // This tells Zod to attach the error to the fecha_fin field
    }
  );

export default function OlimpiadaPage() {
  const params = useParams();
  const id = Number(params.id);
  const navigate = useNavigate();
  // State
  const [data, setData] = useState<OlimpiadaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addCronogramaDialogOpen, setAddCronogramaDialogOpen] = useState(false);
  const [deleteCronogramaDialogOpen, setDeleteCronogramaDialogOpen] =
    useState(false);
  const [editCronogramaDialogOpen, setEditCronogramaDialogOpen] =
    useState(false);
  const [selectedCronograma, setSelectedCronograma] =
    useState<Cronograma | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get<OlimpiadaData>(
        `${API_URL}/api/olimpiadas/${id}/cronogramas`
      );
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching olimpiada data:", error);
    }
  };

  // Forms
  const editOlimpiadaForm = useForm<z.infer<typeof editOlimpiadaSchema>>({
    resolver: zodResolver(editOlimpiadaSchema),
    defaultValues: {
      fecha_inicio: undefined,
      fecha_fin: undefined,
    },
  });

  const addCronogramaForm = useForm<z.infer<typeof cronogramaSchema>>({
    resolver: zodResolver(cronogramaSchema),
    defaultValues: {
      tipo_plazo: undefined,
      fecha_inicio: undefined,
      fecha_fin: undefined,
    },
  });

  const editCronogramaForm = useForm<z.infer<typeof editCronogramaSchema>>({
    resolver: zodResolver(editCronogramaSchema),
    defaultValues: {
      fecha_inicio: undefined,
      fecha_fin: undefined,
    },
  });

  useEffect(() => {
    console.log(id);
    fetchData();
  }, []);

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00");
    return format(date, "dd MMMM yyyy", { locale: es });
  };

  // Get the type of schedule in Spanish
  const getTipoPlazoLabel = (tipo: string) => {
    switch (tipo) {
      case "inscripcion":
        return "Inscripción";
      case "competencia":
        return "Competencia";
      case "premiacion":
        return "Premiación";
      default:
        return tipo.charAt(0).toUpperCase() + tipo.slice(1);
    }
  };

  // Handle delete olimpiada
  const handleDeleteOlimpiada = () => {
    // In a real app, you would make an API call here
    try {
      axios.delete(`${API_URL}/api/olimpiadas/${data?.olimpiada.id}`);
      navigate("/admin");
    } catch (error) {
      console.error("Error deleting olimpiada:", error);
    }
    setDeleteDialogOpen(false);
  };

  // Handle edit olimpiada dates
  const onEditOlimpiada = async (values: z.infer<typeof editOlimpiadaSchema>) => {
    if (!data) return;

    // In a real app, you would make an API call here
    console.log("Updating olimpiada dates:", values);

    // Update local state
    try {
      const newOlimpiada = {
        fecha_inicio: format(values.fecha_inicio, "yyyy-MM-dd"),
        fecha_fin: format(values.fecha_fin, "yyyy-MM-dd"),
      };
      console.log(newOlimpiada);
      await axios.put(`${API_URL}/api/olimpiadas/${data.olimpiada.id}`, newOlimpiada);
      console.log("Olimpiada updated successfully:", newOlimpiada);
      await fetchData();
      console.log(data)
    } catch (error) {
      console.error("Error updating olimpiada:", error);
    }
    setEditDialogOpen(false);
  };

  // Handle add cronograma
  const onAddCronograma = async (values: z.infer<typeof cronogramaSchema>) => {
    if (!data) return;

    // In a real app, you would make an API call here
    console.log("Adding new cronograma:", values);

    // Create new cronograma
    const newCronograma: Cronograma = {
      tipo_plazo: values.tipo_plazo,
      fecha_inicio: values.fecha_inicio.toISOString().split("T")[0],
      fecha_fin: values.fecha_fin.toISOString().split("T")[0],
      olimpiada_id: data.olimpiada.id,
    };
    try {
      await axios.post(`${API_URL}/api/cronogramas`, newCronograma);
      console.log("Cronograma added successfully:");
      setAddCronogramaDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error adding cronograma:", error);
    }
    addCronogramaForm.reset();
  };

  // Handle delete cronograma
  const handleDeleteCronograma = async () => {
    if (!data || !selectedCronograma) return;

    // In a real app, you would make an API call here
    console.log("Deleting cronograma with ID:", selectedCronograma.id);

    try {
      await axios.delete(`${API_URL}/api/cronogramas/${selectedCronograma.id}`);
      console.log("Cronograma deleted successfully:", selectedCronograma.id);
      fetchData();
    } catch (error) {
      console.error("Error deleting cronograma:", error);
    }

    setDeleteCronogramaDialogOpen(false);
    setSelectedCronograma(null);
  };

  useEffect(() => {
    if (data) {
      editOlimpiadaForm.reset({
        fecha_inicio: new Date(data.olimpiada.fecha_inicio),
        fecha_fin: new Date(data.olimpiada.fecha_fin),
      });
    }
  }, [data, editOlimpiadaForm]);
  // Handle edit cronograma
  const onEditCronograma = (values: z.infer<typeof editCronogramaSchema>) => {
    if (!data || !selectedCronograma) return;

    // In a real app, you would make an API call here
    console.log("Updating cronograma dates:", values);

    // Update local state
    setData({
      olimpiada: {
        ...data.olimpiada,
        cronogramas: data.olimpiada.cronogramas.map((c) =>
          c.id === selectedCronograma.id
            ? {
                ...c,
                fecha_inicio: values.fecha_inicio.toISOString().split("T")[0],
                fecha_fin: values.fecha_fin.toISOString().split("T")[0],
              }
            : c
        ),
      },
    });

    setEditCronogramaDialogOpen(false);
    setSelectedCronograma(null);
    alert("Cronograma actualizado correctamente");
  };

  // Open edit cronograma dialog
  const openEditCronogramaDialog = (cronograma: Cronograma) => {
    setSelectedCronograma(cronograma);
    editCronogramaForm.reset({
      fecha_inicio: new Date(cronograma.fecha_inicio),
      fecha_fin: new Date(cronograma.fecha_fin),
    });
    setEditCronogramaDialogOpen(true);
  };

  // Open delete cronograma dialog
  const openDeleteCronogramaDialog = (cronograma: Cronograma) => {
    setSelectedCronograma(cronograma);
    setDeleteCronogramaDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando información de la olimpiada...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">No se encontró información de la olimpiada.</p>
      </div>
    );
  }

  const { olimpiada } = data;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{olimpiada.nombre}</h1>
          <p className="text-gray-500">Gestión: {olimpiada.gestion}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setEditDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar fechas
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que deseas eliminar la olimpiada "
                  {olimpiada.nombre}"? Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDeleteOlimpiada}>
                  Eliminar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm text-muted-foreground">Fecha de inicio:</p>
            <p className="font-medium">{formatDate(olimpiada.fecha_inicio)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm text-muted-foreground">
              Fecha de finalización:
            </p>
            <p className="font-medium">{formatDate(olimpiada.fecha_fin)}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Cronograma
          </h3>
          <Button
            onClick={() => setAddCronogramaDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar fase
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha de inicio</TableHead>
              <TableHead>Fecha de finalización</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {olimpiada.cronogramas.map((cronograma) => {
              // Calculate duration in days
              const start = new Date(cronograma.fecha_inicio);
              const end = new Date(cronograma.fecha_fin);
              const durationDays = Math.ceil(
                (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <TableRow key={cronograma.id}>
                  <TableCell>
                    <Badge
                      variant={
                        cronograma.tipo_plazo === "inscripcion"
                          ? "default"
                          : cronograma.tipo_plazo === "competencia"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {getTipoPlazoLabel(cronograma.tipo_plazo)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(cronograma.fecha_inicio)}</TableCell>
                  <TableCell>{formatDate(cronograma.fecha_fin)}</TableCell>
                  <TableCell>{durationDays} días</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditCronogramaDialog(cronograma)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteCronogramaDialog(cronograma)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Edit Olimpiada Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar fechas de la olimpiada</DialogTitle>
            <DialogDescription>
              Actualiza las fechas de inicio y finalización de la olimpiada.
            </DialogDescription>
          </DialogHeader>
          <Form {...editOlimpiadaForm}>
            <form
              onSubmit={editOlimpiadaForm.handleSubmit(onEditOlimpiada)}
              className="space-y-4"
            >
              <FormField
                control={editOlimpiadaForm.control}
                name="fecha_inicio"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de inicio</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            return date < new Date("2000-01-01");
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editOlimpiadaForm.control}
                name="fecha_fin"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de finalización</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const startDate =
                              editOlimpiadaForm.getValues().fecha_inicio;
                            return (
                              date < new Date("2000-01-01") ||
                              (startDate && date < startDate)
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Guardar cambios</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add Cronograma Dialog */}
      <Dialog
        open={addCronogramaDialogOpen}
        onOpenChange={setAddCronogramaDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar nueva fase</DialogTitle>
            <DialogDescription>
              Añade una nueva fase a la olimpiada.
            </DialogDescription>
          </DialogHeader>
          <Form {...addCronogramaForm}>
            <form
              onSubmit={addCronogramaForm.handleSubmit(onAddCronograma)}
              className="space-y-4"
            >
              <FormField
                control={addCronogramaForm.control}
                name="tipo_plazo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de plazo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo de plazo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="inscripcion">Inscripción</SelectItem>
                        <SelectItem value="competencia">Competencia</SelectItem>
                        <SelectItem value="premiacion">Premiación</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addCronogramaForm.control}
                name="fecha_inicio"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de inicio</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            return (
                              date < new Date(olimpiada.fecha_inicio) ||
                              date > new Date(olimpiada.fecha_fin)
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addCronogramaForm.control}
                name="fecha_fin"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de finalización</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const startDate =
                              addCronogramaForm.getValues().fecha_inicio;
                            return (
                              date < new Date("2000-01-01") ||
                              (startDate && date < startDate) ||
                              date > new Date(olimpiada.fecha_fin)
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Agregar cronograma</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Cronograma Dialog */}
      <Dialog
        open={editCronogramaDialogOpen}
        onOpenChange={setEditCronogramaDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar cronograma</DialogTitle>
            <DialogDescription>
              Actualiza las fechas del cronograma de{" "}
              {selectedCronograma &&
                getTipoPlazoLabel(selectedCronograma.tipo_plazo)}
              .
            </DialogDescription>
          </DialogHeader>
          <Form {...editCronogramaForm}>
            <form
              onSubmit={editCronogramaForm.handleSubmit(onEditCronograma)}
              className="space-y-4"
            >
              <FormField
                control={editCronogramaForm.control}
                name="fecha_inicio"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de inicio</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            return (
                              date < new Date(olimpiada.fecha_inicio) ||
                              date > new Date(olimpiada.fecha_fin)
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editCronogramaForm.control}
                name="fecha_fin"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de finalización</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const startDate =
                              editCronogramaForm.getValues().fecha_inicio;
                            return (
                              date < new Date("2000-01-01") ||
                              (startDate && date < startDate) ||
                              date > new Date(olimpiada.fecha_fin)
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Guardar cambios</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Cronograma Dialog */}
      <Dialog
        open={deleteCronogramaDialogOpen}
        onOpenChange={setDeleteCronogramaDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el cronograma de{" "}
              {selectedCronograma &&
                getTipoPlazoLabel(selectedCronograma.tipo_plazo)}
              ? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteCronogramaDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteCronograma}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
