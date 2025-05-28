import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { UserIcon } from "lucide-react";

const formSchema = z.object({
    ci: z
        .string()
        .min(7, "La Cédula de Identidad debe tener al menos 7 dígitos")
        .max(10, "La Cédula de Identidad no puede tener más de 10 dígitos"),
});

const FormCI = () => {
    const { olimpiada_id } = useParams();
    const form = useForm({ resolver: zodResolver(formSchema) });
    const navigate = useNavigate();

    const onSubmit = ({ ci }: z.infer<typeof formSchema>) => {
        sessionStorage.setItem("ci", ci);
        navigate("/inscribir/" + olimpiada_id + "/" + ci);
    };

    return (
        <Card className="w-full max-w-md shadow-lg rounded-2xl">
            <CardHeader className="text-center space-y-2">
                <div className="flex justify-center">
                    <UserIcon className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Ingresar al Sistema</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Por favor, introduce tu número de Cédula de Identidad para
                    continuar.
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="ci"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cédula de Identidad</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Ingrese  CI"
                                            type="text"
                                            maxLength={10}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                    .toUpperCase()
                                                    .replace(/[^A-Z0-9]/g, "");
                                                field.onChange(value);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Ingresar
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default FormCI;
