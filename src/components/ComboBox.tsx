import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface MySelectProps {
    id?: string;
    values: { id: string ; nombre: string }[];
    value: string;
    setValue: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
}

export function ComboBox({
    label,
    id,
    values,
    value,
    setValue,
    placeholder = "Selecciona una opción",
    disabled,
}: MySelectProps) {
    return (
        <Select value={value} onValueChange={setValue} disabled={disabled}>
            <SelectTrigger id={id} className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label ? label : "Opciones"}</SelectLabel>
                    {values.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                            {option.nombre}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
