import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const areaSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre del área debe tener al menos 3 caracteres"),
});

type FormValues = z.infer<typeof areaSchema>;

interface FormAddAreaProps {
  onAdd: (data: { nombre: string }) => void;
}

export function useFormAddAreaViewModel({ onAdd }: FormAddAreaProps) {
  const [showForm, setShowForm] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      nombre: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    await onAdd(data);
    form.reset({ nombre: "" });
    setShowForm(false);
  };

  const handleCancel = () => {
    form.reset({ nombre: "" });
    setShowForm(false);
  };

  return {
    showForm,
    setShowForm,
    form,
    onSubmit,
    handleCancel,
  };
} 