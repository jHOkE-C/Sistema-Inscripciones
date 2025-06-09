import { useState } from "react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";

interface DatePickerPopoverProps {
    selectedDate: Date | null;
    minDate?: Date;
    maxDate?: Date;
    onSelect: (date: Date) => void;
    className?: string;
    disabled?: boolean; // Add disabled prop
}

export default function DatePickerPopover({
    selectedDate,
    minDate,
    maxDate,
    onSelect,
    className,
    disabled // Destructure disabled prop
}: DatePickerPopoverProps) {
    const [open, setOpen] = useState(false);

    // console.log("max: ", maxDate);
    // console.log("seleccionado", selectedDate);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="link"
                    size="sm"
                    className={cn("flex items-center font-normal",className)}
                    disabled={disabled} // Pass disabled prop to Button
                >
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {selectedDate
                        ? selectedDate.toLocaleDateString("es-ES")
                        : "Seleccione una fecha"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 pl-4">
                <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    locale={es}
                    disabled={(date) => {
                        if (minDate && date < minDate) return true;
                        if (maxDate && date > maxDate) return true;
                        return false;
                    }}
                    selected={selectedDate || undefined}
                    onSelect={(date) => {
                        if (date) {
                            onSelect(date);
                            setOpen(false);
                        }
                    }}
                    defaultMonth={
                        selectedDate
                            ? selectedDate
                            : minDate
                    }
                />
            </PopoverContent>
        </Popover>
    );
}
