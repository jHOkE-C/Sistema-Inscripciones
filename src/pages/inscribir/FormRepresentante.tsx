import { registrarRepresentante } from "@/api/representantes";
import { AlertComponent } from "@/components/AlertComponent";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    nombre_completo: z
        .string()
        .min(2, "Debe tener al menos 2 caracteres")
        .max(50, "Máximo 50 caracteres"),
    email: z.string().email("El correo ingresado no es válido"),
    telefono: z
        .string()
        .regex(/^[0-9]{7,8}$/, "Ingrese un número de teléfono válido"),
});

const FormRepresentante = ({ onClose }: { onClose: () => void }) => {
    const [error, setError] = useState<string | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre_completo: "",
            email: "",
            telefono: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const { uuid } = await registrarRepresentante(values);
            localStorage.setItem("uuid", uuid);
            onClose();
        } catch (error: unknown) {
            setError(
                error instanceof Error ? error.message : "Error desconocido"
            );
        }
    };
    return (
        <>
            <div className="bg-foreground/5 w-screen h-screen">
                <div
                    className={cn(
                        "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg "
                    )}
                >
                    <h2 className="text-2xl font-bold text-center mb-6">
                        Registro de Representante
                    </h2>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="nombre_completo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre completo</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Ejemplo: Juan Pérez"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Correo electrónico
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Ejemplo: ejemplo@dominio.com"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="telefono"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Teléfono</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="tel"
                                                {...field}
                                                placeholder="Ejemplo: 76543210"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">
                                Enviar
                            </Button>
                        </form>
                    </Form>

                    {error && (
                        <AlertComponent
                            title="Error"
                            variant="destructive"
                            description={error}
                            onClose={() => setError(null)}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default FormRepresentante;
