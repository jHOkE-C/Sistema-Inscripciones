import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registrarResponsable } from "@/models/api/responsables";
import { toast } from "sonner";

const formSchema = z.object({
  nombres: z
    .string({ required_error: "Todos los campos son obligatorios" })
    .min(2, "Debe tener al menos 2 caracteres")
    .max(50, "Máximo 50 caracteres"),
  apellidos: z
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

type FormValues = z.infer<typeof formSchema>;

interface FormResponsableProps {
  onClose: () => void;
}

export function useFormResponsableViewModel({ onClose }: FormResponsableProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const { ci } = useParams();

  const handleSubmit = async (values: FormValues) => {
    try {
      if (!ci) return;
      await registrarResponsable({
        ci,
        email: values.email,
        telefono: values.telefono,
        nombre_completo: `${values.nombres} ${values.apellidos}`,
      });
      toast.success("Registro de responsable exitoso");
      onClose();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error desconocido");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    form.setValue("nombres", value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    form.setValue("apellidos", value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    form.setValue("telefono", value);
  };

  return {
    form,
    ci,
    handleSubmit,
    handleNameChange,
    handleLastNameChange,
    handlePhoneChange,
  };
} 