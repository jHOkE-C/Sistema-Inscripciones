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
import { Plus } from "lucide-react";
import { useFormAddAreaViewModel } from "@/viewModels/usarVistaModelo/privilegios/area/useFormAddAreaViewModel";

interface FormAddAreaProps {
  onAdd: (data: { nombre: string }) => void;
}

const FormAddArea = ({ onAdd }: FormAddAreaProps) => {
  const {
    showForm,
    setShowForm,
    form,
    onSubmit,
    handleCancel,
  } = useFormAddAreaViewModel({ onAdd });

  return (
    <>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogTrigger asChild>
          <div className="flex justify-end items-center w-full p-4 text-white">
            <Button className="text-white">
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
                      <Input
                        maxLength={40}
                        placeholder="Ingrese Nombre de Area"
                        onChange={(e) => {
                          field.onChange(e.target.value.toUpperCase());
                        }}
                        value={field.value}
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
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormAddArea;
