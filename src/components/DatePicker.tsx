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
    date: Date | undefined;
    id: string;
    setDate: (date: Date) => void;
}

export function DatePicker({
    startYear = getYear(new Date()) - 100,
    endYear = getYear(new Date()) + 100,
    date,
    setDate,
    id,
}: DatePickerProps) {
    const months = [
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
    ];
    const years = Array.from(
        { length: endYear - startYear + 1 },
        (_, i) => startYear + i
    );

    const handleMonthChange = (month: string) => {
        const newDate = setMonth(date ?? new Date(), months.indexOf(month));
        setDate(newDate);
    };

    const handleYearChange = (year: string) => {
        const newDate = setYear(date ?? new Date(), parseInt(year));
        setDate(newDate);
    };

    const handleSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    variant={"outline"}
                    className={cn(
                        "w-[250px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
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
            <PopoverContent className="w-auto p-0">
                <div className="flex justify-between p-2">
                    <Select
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
                    </Select>
                    <Select
                        onValueChange={handleYearChange}
                        value={getYear(date ?? new Date()).toString()}
                    >
                        <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Año" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Calendar
                    mode="single"
                    locale={es}
                    selected={date}
                    onSelect={handleSelect}
                    initialFocus
                    month={date}
                    onMonthChange={setDate}
                />
            </PopoverContent>
        </Popover>
    );
}

export default DatePicker;
