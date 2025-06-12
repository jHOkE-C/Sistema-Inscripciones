import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/models/api/login";
import { useState } from "react";
import { AlertComponent } from "@/components/AlertComponent";
import { useAuth } from "@/viewModels/hooks/auth";

//import { useAuth } from "@/viewModels/hooks/Auth";

const loginSchema = z.object({
    nombre_usuario: z.string().min(1, "El usuario es obligatorio"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});

const PageLogin = () => {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            nombre_usuario: "",
            password: "",
        },
    });
    const [error, setError] = useState<string | null>(null);
    const {logIn}= useAuth()
    
    const navigate = useNavigate();


    async function onSubmit(values: z.infer<typeof loginSchema>) {
        try {
            const data=await login(values);
            logIn(data)
            
            navigate("/admin");
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Error Desconocido");
        }
    }
    return (
        <>
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <Link to="/" className="absolute top-2 flex items-center gap-1">
                    <img
                        alt="Olimpiadas ohSansi"
                        className="h-24"
                        src="/logo.png"
                    />
                    <span className="text-xl text-blue-700 font-bold">
                        Olimpiadas
                    </span>
                </Link>
                <div className="w-full max-w-sm">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className=""
                        >
                            <Card className="w-full">
                                <CardHeader className="space-y-1">
                                    <CardTitle className="text-3xl font-bold text-center mb-4 text-nowrap">
                                        Iniciar Sesión
                                    </CardTitle>
                                    <CardDescription className="text-center">
                                        Ingresa tus credenciales para acceder al
                                        sistema
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="nombre_usuario"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Usuario</FormLabel>

                                                <FormControl>
                                                    <Input
                                                        placeholder="Ingrese Usuario"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Contraseña
                                                </FormLabel>

                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Ingrese Contraseña"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter className="flex flex-col gap-2">
                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                    >
                                        Iniciar Sesión
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </Form>
                </div>
            </div>
            {error && (
                <AlertComponent
                    description={error}
                    onClose={() => {
                        setError(null);
                    }}
                    variant="destructive"
                />
            )}
        </>
    );
};

export default PageLogin;
