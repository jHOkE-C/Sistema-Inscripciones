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
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const areaSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre del área debe tener al menos 3 caracteres"),
});
interface FormAddAreaProps {
  onAdd: (data: { nombre: string }) => void;
}

const FormAddArea = ({ onAdd }: FormAddAreaProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<{ nombre: string }>();

  const form = useForm<z.infer<typeof areaSchema>>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      nombre: "",
    },
  });

  const onSubmit = async (data: { nombre: string }) => {
    setShowConfirm(true);
    setFormData(data);
  };
  const saveArea = async () => {
    if (formData) {
      await onAdd(formData);
      setShowForm(false);
    }
  };

  return (
    <>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogTrigger asChild>
          <div className="flex justify-between items-center w-full p-4">
            <p className="text-sm text-neutral-400">
                Agrega y elimina un nuevo area para las olimpiadas
            </p>
            <Button>
              <Plus /> Agregar Area
            </Button>
          </div>
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
                      <Input placeholder="Astronomia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button onClick={form.handleSubmit(onSubmit)}>Registrar</Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
              }}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialogComponent
        title={`¿Está seguro de registrar el área ${formData?.nombre}?`}
        onConfirm={saveArea}
        open={showConfirm}
        onOpenChange={(e) => {
          setShowConfirm(e);
        }}
      />
    </>
  );
};

export default FormAddArea;
