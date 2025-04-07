import { cn } from "@/lib/utils"; // Función para manejar clases condicionales
import { Check, ChevronsUpDown } from "lucide-react"; // Íconos de lucide-react
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

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
}: MultiSelectProps) {
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

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    id={id}
                    variant="outline"
                    className="w-full justify-between font-normal"
                >
                    {selectedNames || placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            </PopoverTrigger>
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
        </Popover>
    );
}
