import { AlertComponent } from "@/components/AlertComponent";
import AlertDialogComponent from "@/components/AlertDialogComponent";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { z } from "zod";
const areaSchema = z.object({
    name: z
        .string()
        .min(3, "El nombre del área debe tener al menos 3 caracteres"),
});
const FormAddArea = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showCancel, setShowCancel] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState();

    const form = useForm<z.infer<typeof areaSchema>>({
        resolver: zodResolver(areaSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = (data) => {
        setShowConfirm(true);
        setData(data);
    };
    const saveArea = async () => {
        setShowForm(false)
        // usar el data para guardar en el backend
    }

    return (
        <>
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogTrigger asChild>
                    <Button variant="outline">Agregar Area</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Agregar Area</DialogTitle>
                        <DialogDescription>
                            Crea un nuevo area para las olimpiadas.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form action="" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormLabel>Nombre de Area</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Astronomia"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                    <DialogFooter>
                        <Button onClick={form.handleSubmit(onSubmit)}>
                            Registrar
                        </Button>
                        <AlertDialogComponent
                            open={showCancel}
                            onOpenChange={setShowCancel}
                            variantButton="destructive"
                            title="¿Está seguro de cancelar el registro?"
                            textButton="Cancelar"
                            onConfirm={() => setShowForm(false)}
                        />
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <AlertDialogComponent
                title="¿Está seguro de registrar el área?"
                onConfirm={saveArea}
                open={showConfirm}
                onOpenChange={(e) => {
                    setShowConfirm(e);
                }}
                
            />
            {showSuccess && (
                <AlertComponent title="El área de competencia se creó correctamente" />
            )}
            {error && (
                <AlertComponent
                    title="El registro no se guardó, inténtelo de nuevo."
                    variant="destructive"
                />
            )}
        </>
    );
};

export default FormAddArea;
