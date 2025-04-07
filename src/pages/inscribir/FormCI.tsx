import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
const formSchema = z.object({
    ci: z.string().min(7, "La Cédula de identidad debe tener minimo 7 numeros"),
});
const FormCI = () => {
    const form = useForm({ resolver: zodResolver(formSchema) });
    const navigate = useNavigate();
    const onSubmit = ({ ci }: z.infer<typeof formSchema>) => {
        localStorage.setItem('ci',ci)
        navigate("/inscribir/" + ci);
    };
    return (
        <>
            <Card className="w-full max-w-md shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle>Ingresar al Sistema</CardTitle>
                </CardHeader>
                <CardContent className="">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="ci"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Cédula de Identidad
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                        Ingresar
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
};

export default FormCI;
