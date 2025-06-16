import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  ci: z
    .string()
    .min(7, "La Cédula de Identidad debe tener al menos 7 dígitos")
    .max(10, "La Cédula de Identidad no puede tener más de 10 dígitos"),
});

type FormValues = z.infer<typeof formSchema>;

export function useFormCIViewModel() {
  const { olimpiada_id } = useParams();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ci: "",
    },
  });

  const onSubmit = ({ ci }: FormValues) => {
    if (!olimpiada_id) return;
    sessionStorage.setItem("ci", ci);
    navigate(`/inscribir/${olimpiada_id}/${ci}`);
  };

  const handleCIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    form.setValue("ci", value);
  };

  return {
    form,
    onSubmit,
    handleCIChange,
    olimpiada_id,
  };
} 