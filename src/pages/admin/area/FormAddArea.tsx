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
import { useApiRequest } from "@/hooks/useApiRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import { log } from "console";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const areaSchema = z.object({
    nombre: z
        .string()
        .min(3, "El nombre del área debe tener al menos 3 caracteres"),
});
const FormAddArea = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showCancel, setShowCancel] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState<{ nombre: string }>();

    const form = useForm<z.infer<typeof areaSchema>>({
        resolver: zodResolver(areaSchema),
        defaultValues: {
            nombre: "",
        },
    });

    const onSubmit = (data) => {
        setShowConfirm(true);
        setFormData(data);
    };
    const { loading, request, data, error } = useApiRequest();
    const saveArea = async () => {
        // fetch new area
        await request("/api/areas", "POST", formData);
        console.log(data);

        setShowForm(false);
    };

    return (
        <>
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus /> Agregar Area
                    </Button>
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
                                name="nombre"
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
