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
import { AlertComponent } from "@/components/AlertComponent";
import axios from "axios";
import { API_URL } from "@/hooks/useApiRequest";

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
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const currentYear = new Date().getFullYear();

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
            };
            console.log(data);
            const response = await axios.post(
                `${API_URL}/api/olimpiadas`,
                data
            );
            console.log(response);

            setName("");
            setManagementPeriod("");
            setStartDate(new Date());
            setEndDate(undefined);
            setOpen(false);
            refresh();
            setSuccess("La gestión se creó correctamente.");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const data = error.response?.data.error;
                setError(data[0]);
            }
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
                        className="h-auto py-6 bg-emerald-600 hover:bg-emerald-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
                        asChild
                    >
                        <div>
                            <PlusCircle className="h-8 w-8 mb-1" />
                            <span className="text-lg font-medium">
                                Crear versión
                            </span>
                        </div>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Crear Version</DialogTitle>
                            <DialogDescription>
                                Introduce los detalles de la nueva versión de
                                olimpiada.
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
                                    <SelectTrigger
                                        className="col-span-3"
                                        id="gestion"
                                    >
                                        <SelectValue placeholder="Seleccionar período" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value={`${currentYear} - I`}
                                        >
                                            {currentYear} - I
                                        </SelectItem>
                                        <SelectItem
                                            value={`${currentYear} - II`}
                                        >
                                            {currentYear} - II
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="startDate"
                                    className="text-right"
                                >
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
                                                    !startDate &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {startDate ? (
                                                    format(startDate, "PPP", {
                                                        locale: es,
                                                    })
                                                ) : (
                                                    <span>
                                                        Seleccionar una fecha
                                                    </span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={startDate}
                                                onSelect={(date) =>
                                                    date && setStartDate(date)
                                                }
                                                initialFocus
                                                disabled={(date) =>
                                                    date <
                                                    new Date(
                                                        new Date().setHours(
                                                            0,
                                                            0,
                                                            0,
                                                            0
                                                        )
                                                    )
                                                }
                                                locale={es}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="endDate" className="text-right">
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
                                                    !endDate &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {endDate ? (
                                                    format(endDate, "PPP", {
                                                        locale: es,
                                                    })
                                                ) : (
                                                    <span>
                                                        Seleccionar una fecha
                                                    </span>
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
                                                        new Date(
                                                            startDate
                                                        ).setDate(
                                                            startDate.getDate() +
                                                                30
                                                        )
                                                    )
                                                }
                                                locale={es}
                                                initialFocus
                                                defaultMonth={
                                                    new Date(
                                                        new Date(
                                                            startDate
                                                        ).setDate(
                                                            startDate.getDate() +
                                                                30
                                                        )
                                                    )
                                                }
                                                disabled={(date) =>
                                                    date <
                                                    new Date(
                                                        new Date(
                                                            startDate
                                                        ).setDate(
                                                            startDate.getDate() +
                                                                30
                                                        )
                                                    )
                                                }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Crear</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            {error && (
                <AlertComponent
                    title="Error"
                    description={
                        error
                            ? error
                            : "No se pudo registrar la gestion, Intente nuevamente"
                    }
                    onClose={() => {
                        setError(null);
                    }}
                    variant="destructive"
                />
            )}
            {success && (
                <AlertComponent
                    title="Éxito"
                    description="La gestión se créo correctamente"
                    onClose={() => {
                        setSuccess(null);
                    }}
                />
            )}
        </>
    );
}
