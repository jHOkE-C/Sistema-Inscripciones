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
import { getUuid } from "@/utils/apiUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
    nombre_completo: z.string().min(2, "Debe tener al menos 2 caracteres").max(50, "Máximo 50 caracteres"),
    ci: z.string().min(7, "Ingrese un CI válido"),
    correo_electronico: z.string().email("Ingrese un correo válido"),
    telefono: z.string().regex(/^[0-9]{7,15}$/, "Ingrese un número de teléfono válido"),
});

const Page = () => {
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre_completo: "",
            ci: "",
            correo_electronico: "",
            telefono: "",
        },
    });

    const onSubmit =async (values: z.infer<typeof formSchema>)=> {
        
        
        // eviar los datos y obtener un uuid
        const uuid = await getUuid(values)
        navigate('/inscribir/'+uuid)


    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-md shadow-lg rounded-2xl">
                <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-center mb-6">Registro de Representante</h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="nombre_completo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre completo</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Ejemplo: Juan Pérez" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ci"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cédula de identidad</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Ejemplo: 12345678" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="correo_electronico"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Correo electrónico</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} placeholder="Ejemplo: usuario@correo.com" />
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
                                            <Input type="tel" {...field} placeholder="Ejemplo: 76543210" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">Enviar</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
