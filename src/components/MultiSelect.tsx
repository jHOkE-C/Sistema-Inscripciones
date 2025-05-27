import { cn } from "@/lib/utils"; // Función para manejar clases condicionales
import { Check, ChevronsUpDown } from "lucide-react"; // Íconos de lucide-react
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect } from "react";

interface MultiSelectProps {
    id?: string;
    values: { id: string; nombre: string }[];
    /** Array de IDs seleccionados */
    value: string[];
    /** Callback que actualiza el array de IDs seleccionados */
    onChange: (value: string[]) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    max?: number;
    messageWithoutValues?: string;
}

export function MultiSelect({
    id,
    values,
    value = [], // valor por defecto para evitar undefined
    onChange,
    placeholder = "Selecciona opciones",
    label = "Opciones",
    disabled,
    max = 999,
    messageWithoutValues,
}: MultiSelectProps) {
    // Sincroniza los valores seleccionados con los valores disponibles
    useEffect(() => {
        const validValues = value.filter((v) =>
            values.some((option) => option.id === v)
        );
        if (validValues.length !== value.length) {
            onChange(validValues);
        }
    }, [values, value, onChange]);

    // Alterna la selección de un valor
    const toggleValue = (optionId: string) => {
        if (value.includes(optionId)) {
            onChange(value.filter((v) => v !== optionId));
        } else {
            if (value.length < max) onChange([...value, optionId]);
        }
    };

    // Obtiene los nombres de las opciones seleccionadas
    const selectedNames = values
        .filter((option) => value.includes(option.id))
        .map((option) => option.nombre)
        .join(", ");

    const isDisabled = disabled || values.length === 0;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    disabled={isDisabled}
                    id={id}
                    variant="outline"
                    className="w-full justify-between font-normal "
                >
                    <span className="text-wrap ">
                        {values.length === 0
                            ? messageWithoutValues ||
                              "No hay opciones disponibles"
                            : selectedNames || placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            </PopoverTrigger>
            {values.length > 0 && (
                <PopoverContent className="w-full p-0">
                    <div className="flex flex-col space-y-1 p-2">
                        <div className="text-muted-foreground px-2 py-1.5 text-xs">
                            {label}
                        </div>
                        {values.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                className="flex items-center w-full rounded-sm p-2 hover:bg-accent hover:text-accent-foreground font-normal text-sm"
                                onClick={() => toggleValue(option.id)}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4 transition-opacity",
                                        value.includes(option.id)
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                <span>{option.nombre}</span>
                            </button>
                        ))}
                    </div>
                </PopoverContent>
            )}
        </Popover>
    );
}
