import { registrarRepresentante } from "@/api/representantes";
import { AlertComponent } from "@/components/AlertComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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

const FormRepresentante = () => {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
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
            navigate("/inscribir/" + uuid);
        } catch (error: unknown) {
            setError(
                error instanceof Error ? error.message : "Error desconocido"
            );
        }
    };
    return (
        <>
            <Card className="w-full max-w-md shadow-lg rounded-2xl">
                <CardContent className="p-6">
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
                </CardContent>
            </Card>
            {error && (
                <AlertComponent
                    title="Error"
                    variant="destructive"
                    description={error}
                    onClose={() => setError(null)}
                />
            )}
        </>
    );
};

export default FormRepresentante;
