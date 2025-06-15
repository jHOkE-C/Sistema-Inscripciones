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
import NotFoundPage from "../404";
import { MailIcon, PhoneIcon, UserIcon } from "lucide-react";
import { useFormResponsableViewModel } from "@/viewModels/inscribir/useFormResponsableViewModel";

const FormResponsable = ({ onClose }: { onClose: () => void }) => {
  const {
    form,
    ci,
    handleSubmit,
    handleNameChange,
    handleLastNameChange,
    handlePhoneChange,
  } = useFormResponsableViewModel({ onClose });

  if (!ci || ci.length < 7) return <NotFoundPage />;

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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Campo de Nombres */}
            <FormField
              control={form.control}
              name="nombres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-1">
                      <UserIcon className="w-4 h-4" />
                      Nombres
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ingrese Nombres"
                      autoComplete="given-name"
                      onChange={handleNameChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo de Apellidos */}
            <FormField
              control={form.control}
              name="apellidos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-1">
                      <UserIcon className="w-4 h-4" />
                      Apellidos
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ingrese Apellidos"
                      autoComplete="family-name"
                      onChange={handleLastNameChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo de Correo Electrónico */}
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
                      placeholder="Ingrese Correo"
                      type="email"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo de Teléfono */}
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
                      onChange={handlePhoneChange}
                      value={field.value || ""}
                      type="tel"
                      placeholder="Ingrese Numero de Teléfono"
                      autoComplete="tel"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="w-full">
                Registrar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default FormResponsable;