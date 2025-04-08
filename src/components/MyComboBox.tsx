"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface MyComboBoxProps {
    values: { id: string; nombre: string }[];
    onChange: (value: string) => void;
    value: string;
}

export function MyCombobox({ values, value, onChange }: MyComboBoxProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                >
                    {value
                        ? values.find((framework) => framework.id == value)?.nombre
                        : "Seleccione un opcion..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Busca la opcion..."
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>No hay opciones.</CommandEmpty>
                        <CommandGroup>
                            {values.map((framework) => (
                                <CommandItem
                                    key={framework.id}
                                    value={framework.id}
                                    onSelect={() => {
                                        onChange(framework.id.toString());
                                        setOpen(false);
                                    }}
                                >
                                    {framework.nombre}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === framework.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
