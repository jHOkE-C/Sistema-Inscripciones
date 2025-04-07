import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface MySelectProps {
    id?: string;
    values: { id: string; nombre: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
    className?: string;
}

export function ComboBox({
    label,
    id,
    values,
    value,
    onChange,
    placeholder = "Selecciona una opción",
    disabled,
    className
}: MySelectProps) {
    return (
        <Select value={value} onValueChange={onChange} disabled={disabled} >
            <SelectTrigger id={id} className={cn("w-full", className)}>
                <SelectValue placeholder={placeholder}  />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label ? label : "Opciones"}</SelectLabel>
                    {values.map((option) => (
                        <SelectItem key={option.id} value={option.id.toString()}>
                            {option.nombre}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
