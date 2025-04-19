"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, CalendarDays } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "@/hooks/useApiRequest";
import {  formatDate, OlimpiadaData } from "./types";
import { Toaster } from "@/components/ui/sonner";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
// Define types for our data

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


export default function OlimpiadaPage() {
    const params = useParams();
    const id = Number(params.id);
    // State
    const [data, setData] = useState<OlimpiadaData | null>(null);
    const [loading, setLoading] = useState(true);
 
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

    // const addCronogramaForm = useForm<z.infer<typeof cronogramaSchema>>({
    //     resolver: zodResolver(cronogramaSchema),
    //     defaultValues: {
    //         tipo_plazo: undefined,
    //         fecha_inicio: undefined,
    //         fecha_fin: undefined,
    //     },
    // });

    // const editCronogramaForm = useForm<z.infer<typeof editCronogramaSchema>>({
    //     resolver: zodResolver(editCronogramaSchema),
    //     defaultValues: {
    //         fecha_inicio: undefined,
    //         fecha_fin: undefined,
    //     },
    // });

    useEffect(() => {
        console.log(id);
        fetchData();
    }, []);

    // Format date to a more readable format

    // Get the type of schedule in Spanish

    // Handle delete olimpiada

    // Agregar esta función dentro del componente OlimpiadaPage
    // const getAvailableTipoPlazo = () => {
    //     if (!data) return [];

    //     const usedTipos = data.olimpiada.cronogramas.map((c) => c.tipo_plazo);

    //     return allTipos.filter((tipo) => !usedTipos.includes(tipo));
    // };
    // Handle edit olimpiada dates
    // const onEditOlimpiada = async (
    //     values: z.infer<typeof editOlimpiadaSchema>
    // ) => {
    //     if (!data) return;

    //     try {
    //         const newOlimpiada = {
    //             fecha_inicio: format(values.fecha_inicio, "yyyy-MM-dd"),
    //             fecha_fin: format(values.fecha_fin, "yyyy-MM-dd"),
    //         };
    //         await axios.put(
    //             `${API_URL}/api/olimpiadas/${data.olimpiada.id}`,
    //             newOlimpiada
    //         );
    //         console.log("Olimpiada updated successfully:", newOlimpiada);
    //         toast.success("Fechas actualizadas correctamente.");
    //         await fetchData();
    //         setEditDialogOpen(false);
    //     } catch (error) {
    //         if (axios.isAxiosError(error)) {
    //             const mensaje = error.response?.data?.error;
    //             toast.error(mensaje);
    //         }
    //     }
    // };

    // Handle add cronograma
    // const onAddCronograma = async (
    //     values: z.infer<typeof cronogramaSchema>
    // ) => {
    //     if (!data) return;

    //     // In a real app, you would make an API call here
    //     console.log("Adding new cronograma:", values);

    //     // Create new cronograma
    //     const newCronograma: Cronograma = {
    //         tipo_plazo: values.tipo_plazo,
    //         fecha_inicio: values.fecha_inicio.toISOString().split("T")[0],
    //         fecha_fin: values.fecha_fin.toISOString().split("T")[0],
    //         olimpiada_id: data.olimpiada.id,
    //     };
    //     try {
    //         await axios.post(`${API_URL}/api/cronogramas`, newCronograma);
    //         console.log("Cronograma added successfully:");
    //         setAddCronogramaDialogOpen(false);
    //         fetchData();
    //         addCronogramaForm.reset();
    //         toast.success("Fase agregada correctamente.");
    //     } catch (error) {
    //         if (axios.isAxiosError(error)) {
    //             const mensaje = error.response?.data?.error[0];
    //             toast.error(mensaje);
    //         }
    //     }
    // };

    // Handle delete cronograma
    // const handleDeleteCronograma = async () => {
    //     if (!data || !selectedCronograma) return;

    //     // In a real app, you would make an API call here
    //     console.log("Deleting cronograma with ID:", selectedCronograma.id);

    //     try {
    //         await axios.delete(
    //             `${API_URL}/api/cronogramas/${selectedCronograma.id}`
    //         );
    //         console.log(
    //             "Cronograma deleted successfully:",
    //             selectedCronograma.id
    //         );
    //         fetchData();
    //         toast.success("Fase eliminada correctamente.");
    //     } catch (error) {
    //         toast.error("Error al eliminar la fase.");
    //         console.error("Error deleting cronograma:", error);
    //     }

    //     setDeleteCronogramaDialogOpen(false);
    //     setSelectedCronograma(null);
    // };

    useEffect(() => {
        if (data) {
            editOlimpiadaForm.reset({
                fecha_inicio: new Date(data.olimpiada.fecha_inicio),
                fecha_fin: new Date(data.olimpiada.fecha_fin),
            });
        }
    }, [data, editOlimpiadaForm]);
    // Handle edit cronograma
    // const onEditCronograma = async (
    //     values: z.infer<typeof editCronogramaSchema>
    // ) => {
    //     if (!data || !selectedCronograma) return;

    //     // In a real app, you would make an API call here
    //     try {
    //         const updatedCronograma: Cronograma = {
    //             ...selectedCronograma,
    //             fecha_inicio: values.fecha_inicio.toISOString().split("T")[0],
    //             fecha_fin: values.fecha_fin.toISOString().split("T")[0],
    //         };
    //         console.log("Updating cronograma:", updatedCronograma);
    //         await axios.put(
    //             `${API_URL}/api/cronogramas/${selectedCronograma.id}`,
    //             updatedCronograma
    //         );
    //         console.log("Cronograma updated successfully:", updatedCronograma);
    //         fetchData();
    //         toast.success("Fase actualizada correctamente.");
    //         setEditCronogramaDialogOpen(false);
    //         setSelectedCronograma(null);
    //     } catch (error) {
    //         if (axios.isAxiosError(error)) {
    //             const mensaje = error.response?.data?.error[0];
    //             toast.error(mensaje);
    //         }
    //         console.error("Error updating cronograma:", error);
    //     }
    // };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg">Cargando...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg">
                    No se encontró información de la olimpiada.
                </p>
            </div>
        );
    }

    const { olimpiada } = data;

    return (
        <>
            <div className="pl-4 pt-4">
                <Link to="/admin" className="">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-1 mb-4"
                    >
                        <ChevronLeft className="h" />
                        Volver
                    </Button>
                </Link>
            </div>
            <div className="p-4 container mx-auto">
                <Toaster />
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle>
                            <h1 className="text-2xl font-bold ">
                                Gestion de Version de Olimpiada
                            </h1>
                        </CardTitle>
                        <CardDescription>
                            <h2 className="text-xl font-semibold ">
                                {olimpiada.nombre} – {olimpiada.gestion}
                            </h2>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4  p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Fecha de inicio:
                                    </p>
                                    <p className="font-medium">
                                        {formatDate(olimpiada.fecha_inicio)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Fecha de finalización:
                                    </p>
                                    <p className="font-medium">
                                        {formatDate(olimpiada.fecha_fin)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col space-y-4 p-6 max-w-3xl mx-auto">
                    <Button
                        className="h-auto py-6 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg md:col-span-2 lg:col-span-2"
                        asChild
                    >
                        <Link to={`/admin/version/${id}/fechas`}>
                            <CalendarDays className="size-7 " />
                            <span className="text-lg font-medium">
                                Definir Fases
                            </span>
                        </Link>
                    </Button>
                </div>
            </div>
            {/* Edit Olimpiada Dialog */}
            {/* <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar fechas de la olimpiada</DialogTitle>
                        <DialogDescription>
                            Actualiza las fechas de inicio y finalización de la
                            olimpiada.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...editOlimpiadaForm}>
                        <form
                            onSubmit={editOlimpiadaForm.handleSubmit(
                                onEditOlimpiada
                            )}
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
                                                            !field.value &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            formatDate(
                                                                field.value
                                                                    .toISOString()
                                                                    .split(
                                                                        "T"
                                                                    )[0]
                                                            )
                                                        ) : (
                                                            <span>
                                                                Seleccionar
                                                                fecha
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => {
                                                        return (
                                                            date <
                                                            new Date(
                                                                "2000-01-01"
                                                            )
                                                        );
                                                    }}
                                                    initialFocus
                                                    locale={es}
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
                                        <FormLabel>
                                            Fecha de finalización
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            formatDate(
                                                                field.value
                                                                    .toISOString()
                                                                    .split(
                                                                        "T"
                                                                    )[0]
                                                            )
                                                        ) : (
                                                            <span>
                                                                Seleccionar
                                                                fecha
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => {
                                                        const startDate =
                                                            editOlimpiadaForm.getValues()
                                                                .fecha_inicio;
                                                        return (
                                                            date <
                                                                new Date(
                                                                    "2000-01-01"
                                                                ) ||
                                                            (startDate &&
                                                                date <
                                                                    startDate)
                                                        );
                                                    }}
                                                    initialFocus
                                                    locale={es}
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
            </Dialog> */}

            {/* Add Cronograma Dialog */}
            {/* <Dialog
                open={addCronogramaDialogOpen}
                onOpenChange={setAddCronogramaDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Definir fase</DialogTitle>
                        <DialogDescription>
                            Define una nueva fase para la olimpiada.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...addCronogramaForm}>
                        <form
                            onSubmit={addCronogramaForm.handleSubmit(
                                onAddCronograma
                            )}
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
                                                {getAvailableTipoPlazo().map(
                                                    (tipo) => (
                                                        <SelectItem
                                                            key={tipo}
                                                            value={tipo}
                                                        >
                                                            {getTipoPlazoLabel(
                                                                tipo
                                                            )}
                                                        </SelectItem>
                                                    )
                                                )}
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
                                                            !field.value &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                "PPP",
                                                                {
                                                                    locale: es,
                                                                }
                                                            )
                                                        ) : (
                                                            <span>
                                                                Seleccionar
                                                                fecha
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => {
                                                        return (
                                                            date <
                                                                new Date(
                                                                    olimpiada.fecha_inicio
                                                                ) ||
                                                            date >
                                                                new Date(
                                                                    olimpiada.fecha_fin
                                                                )
                                                        );
                                                    }}
                                                    initialFocus
                                                    locale={es}
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
                                        <FormLabel>
                                            Fecha de finalización
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                "PPP",
                                                                {
                                                                    locale: es,
                                                                }
                                                            )
                                                        ) : (
                                                            <span>
                                                                Seleccionar
                                                                fecha
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => {
                                                        const startDate =
                                                            addCronogramaForm.getValues()
                                                                .fecha_inicio;
                                                        return (
                                                            date <
                                                                new Date(
                                                                    "2000-01-01"
                                                                ) ||
                                                            (startDate &&
                                                                date <
                                                                    startDate) ||
                                                            date >
                                                                new Date(
                                                                    olimpiada.fecha_fin
                                                                )
                                                        );
                                                    }}
                                                    initialFocus
                                                    locale={es}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit">
                                    Agregar cronograma
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog> */}

            {/* Edit Cronograma Dialog */}
            {/* <Dialog
                open={editCronogramaDialogOpen}
                onOpenChange={setEditCronogramaDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar cronograma</DialogTitle>
                        <DialogDescription>
                            Actualiza las fechas del cronograma de{" "}
                            {selectedCronograma &&
                                getTipoPlazoLabel(
                                    selectedCronograma.tipo_plazo
                                )}
                            .
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...editCronogramaForm}>
                        <form
                            onSubmit={editCronogramaForm.handleSubmit(
                                onEditCronograma
                            )}
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
                                                            !field.value &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            formatDate(
                                                                field.value
                                                                    .toISOString()
                                                                    .split(
                                                                        "T"
                                                                    )[0]
                                                            )
                                                        ) : (
                                                            <span>
                                                                Seleccionar
                                                                fecha
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => {
                                                        return (
                                                            date <
                                                                new Date(
                                                                    olimpiada.fecha_inicio
                                                                ) ||
                                                            date >
                                                                new Date(
                                                                    olimpiada.fecha_fin
                                                                )
                                                        );
                                                    }}
                                                    initialFocus
                                                    locale={es}
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
                                        <FormLabel>
                                            Fecha de finalización
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            formatDate(
                                                                field.value
                                                                    .toISOString()
                                                                    .split(
                                                                        "T"
                                                                    )[0]
                                                            )
                                                        ) : (
                                                            <span>
                                                                Seleccionar
                                                                fecha
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => {
                                                        const startDate =
                                                            editCronogramaForm.getValues()
                                                                .fecha_inicio;
                                                        return (
                                                            date <
                                                                new Date(
                                                                    "2000-01-01"
                                                                ) ||
                                                            (startDate &&
                                                                date <
                                                                    startDate) ||
                                                            date >
                                                                new Date(
                                                                    olimpiada.fecha_fin
                                                                )
                                                        );
                                                    }}
                                                    initialFocus
                                                    locale={es}
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
            </Dialog> */}

            {/* Delete Cronograma Dialog */}
            {/* <Dialog
                open={deleteCronogramaDialogOpen}
                onOpenChange={setDeleteCronogramaDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar eliminación</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar el cronograma
                            de{" "}
                            {selectedCronograma &&
                                getTipoPlazoLabel(
                                    selectedCronograma.tipo_plazo
                                )}
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
                        <Button
                            variant="destructive"
                            onClick={handleDeleteCronograma}
                        >
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog> */}
        </>
    );
}
