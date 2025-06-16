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
import { UserIcon } from "lucide-react";
import { useFormCIViewModel } from "@/viewModels/usarVistaModelo/inscribir/useFormCIViewModel";

const FormCI = () => {
    const { form, onSubmit, handleCIChange, olimpiada_id } = useFormCIViewModel();
    
    if (!olimpiada_id) return null;

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
                                            onChange={handleCIChange}
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
