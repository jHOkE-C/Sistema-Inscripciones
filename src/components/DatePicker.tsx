import React, { useCallback, useMemo, useState } from "react";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DatePickerProps {
    startYear?: number;
    endYear?: number;
    value: Date | undefined;
    id?: string;
    onChange: (date: Date) => void;
    classname?: string;
}

// Evitamos re-renderizados innecesarios con React.memo
const MemoizedSelect = React.memo(Select);
const MemoizedCalendar = React.memo(Calendar);

export function DatePicker({
    startYear = getYear(new Date()) - 100,
    endYear = getYear(new Date()) + 100,
    value: date,
    onChange: setDate,
    id,
    classname,
}: DatePickerProps) {
    // Controlamos la apertura del Popover para montar condicionalmente su contenido
    const [open, setOpen] = useState(false);
    const handleOpenChange = useCallback((isOpen: boolean) => {
        setOpen(isOpen);
    }, []);

    // Memoizamos los arrays de meses y años
    const months = useMemo(
        () => [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ],
        []
    );

    const years = useMemo(
        () =>
            Array.from(
                { length: endYear - startYear + 1 },
                (_, i) => startYear + i
            ),
        [startYear, endYear]
    );

    // Callbacks para actualizar el mes y el año
    const handleMonthChange = useCallback(
        (month: string) => {
            const newDate = setMonth(date ?? new Date(), months.indexOf(month));
            setDate(newDate);
        },
        [date, months, setDate]
    );

    const handleYearChange = useCallback(
        (year: string) => {
            const newDate = setYear(date ?? new Date(), parseInt(year, 10));
            setDate(newDate);
        },
        [date, setDate]
    );

    const handleSelect = useCallback(
        (selectedDate: Date | undefined) => {
            if (
                selectedDate &&
                (!date || selectedDate.getTime() !== date.getTime())
            ) {
                setDate(selectedDate);
            }
        },
        [date, setDate]
    );

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    variant={"outline"}
                    className={cn(
                        " justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        classname
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        format(date, "PPP", { locale: es })
                    ) : (
                        <span>Selecciona una fecha</span>
                    )}
                </Button>
            </PopoverTrigger>
            {open && (
                <PopoverContent className="w-auto p-0">
                    <div className="flex justify-between p-2">
                        <MemoizedSelect
                            onValueChange={handleMonthChange}
                            value={months[getMonth(date ?? new Date())]}
                        >
                            <SelectTrigger className="w-[110px]">
                                <SelectValue placeholder="Mes" />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map((month) => (
                                    <SelectItem key={month} value={month}>
                                        {month}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </MemoizedSelect>
                        <MemoizedSelect
                            onValueChange={handleYearChange}
                            value={getYear(date ?? new Date()).toString()}
                        >
                            <SelectTrigger className="w-[110px]">
                                <SelectValue placeholder="Año" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem
                                        key={year}
                                        value={year.toString()}
                                    >
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </MemoizedSelect>
                    </div>
                    <MemoizedCalendar
                        mode="single"
                        locale={es}
                        selected={date}
                        onSelect={handleSelect}
                        initialFocus
                        month={date}
                        onMonthChange={setDate}
                    />
                </PopoverContent>
            )}
        </Popover>
    );
}

export default DatePicker;
