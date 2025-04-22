import { registrarResponsable } from "@/api/responsables";
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
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import NotFoundPage from "../404";
import { toast } from "sonner";
import { MailIcon, PhoneIcon, UserIcon } from "lucide-react";

const formSchema = z.object({
    nombre_completo: z
        .string({ required_error: "Todos los campos son obligatorios" })
        .min(2, "Debe tener al menos 2 caracteres")
        .max(50, "Máximo 50 caracteres"),
    email: z
        .string({ required_error: "Todos los campos son obligatorios" })
        .email("Ingrese un correo con formato válido (ejemplo@dominio.com)"),
    telefono: z
        .string({ required_error: "Todos los campos son obligatorios" })
        .regex(/^\d{8}$/, "El teléfono debe tener exactamente 8 dígitos"),
});

const FormResponsable = ({ onClose }: { onClose: () => void }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    const { ci } = useParams();
    if (!ci || ci.length < 7) return <NotFoundPage />;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await registrarResponsable({ ...values, ci });
            toast.success("Responsable registrado correctamente");
            onClose();
        } catch (error: unknown) {
            toast.error(
                error instanceof Error ? error.message : "Error desconocido"
            );
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div
                className={cn(
                    "bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl border p-6 shadow-xl duration-200 sm:max-w-lg"
                )}
            >
                <h2 className="text-2xl font-bold text-center mb-4">
                    Registro de Responsable
                </h2>
                <p className="text-sm text-muted-foreground text-center mb-4">
                    Por favor, completa los siguientes campos para registrar al
                    responsable de la inscripción.
                </p>

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
                                    <FormLabel>
                                        <div className="flex items-center gap-1">
                                            <UserIcon className="w-4 h-4" />
                                            Nombre completo
                                        </div>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Ej. Juan Pérez"
                                            autoComplete="name"
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
                                        <div className="flex items-center gap-1">
                                            <MailIcon className="w-4 h-4" />
                                            Correo electrónico
                                        </div>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="ejemplo@dominio.com"
                                            type="email"
                                            autoComplete="email"
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
                                    <FormLabel>
                                        <div className="flex items-center gap-1">
                                            <PhoneIcon className="w-4 h-4" />
                                            Teléfono
                                        </div>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                const value =
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    );
                                                field.onChange(value);
                                            }}
                                            value={field.value || ""}
                                            type="tel"
                                            placeholder="Ej. 76543210"
                                            autoComplete="tel"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-2 pt-2">
                            <Button type="submit" className="w-full">
                                Enviar
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default FormResponsable;
