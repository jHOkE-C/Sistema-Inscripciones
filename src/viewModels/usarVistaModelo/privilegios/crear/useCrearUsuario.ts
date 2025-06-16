import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import axios from "axios";

const formSchema = z
  .object({
    username: z
      .string()
      .min(1, "Usuario obligatorio")
      .max(30, "Máximo 30 caracteres")
      .regex(
        /^(?!.*\..)(?!\.)(?!.*\.$)[a-z0-9.]+$/,
        "Solo minúsculas, números y puntos válidos"
      ),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirma la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export function useCrearUsuario() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    const newUser = {
      nombre_usuario: data.username,
      password: data.password,
    };
    try {
      await axios.post(`${API_URL}/api/usuarios`, newUser);
      toast.success(`Usuario ${data.username} creado exitosamente`);
      form.reset();
    } catch (error) {
      toast.error("Error al crear el usuario");
      console.error("Error al crear el usuario:", error);
    }
  };

  return {
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    form,
    onSubmit,
  };
} 