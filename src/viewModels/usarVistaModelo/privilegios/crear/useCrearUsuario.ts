import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import axios from "axios";
import { formSchema, FormData } from "@/models/interfaces/createUserForm";

export function useCrearUsuario() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    const newUser = {
      nombre_usuario: data.username,
      password: data.password,
    };
    console.log(newUser);
    try {
      await axios.post(`${API_URL}/api/usuarios`, newUser);
      toast.success(`Usuario ${data.username} creado exitosamente`);
      reset();
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
    register,
    handleSubmit,
    errors,
    isValid,
    onSubmit,
  };
}
