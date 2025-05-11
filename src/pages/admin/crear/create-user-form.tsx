"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { API_URL } from "@/hooks/useApiRequest";
import axios from "axios";

// Esquema de validación
const formSchema = z
  .object({
    username: z
      .string()
      .min(1, "Usuario obligatorio")
      .max(30, "Máximo 30 caracteres")
      .regex(
        /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-z0-9.]+$/,
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

export function CreateUserForm() {
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
      await axios.post(`${API_URL}/api/usuarios`, newUser)
      toast.success(`Usuario ${data.username} creado exitosamente`);
      reset();
    } catch (error) {
      toast.error("Error al crear el usuario");
      console.error("Error al crear el usuario:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-start">
        <div className="space-y-2">
          <Label htmlFor="username" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Nombre de Usuario*
          </Label>
          <Input
            id="username"
            placeholder="Ingresa el nombre de usuario"
            maxLength={30}
            {...register("username", {
              setValueAs: (value) =>
          typeof value === "string" ? value.toLowerCase().slice(0, 30) : "",
            })}
            className={errors.username ? "border-red-500" : ""}
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              input.value = input.value.toLowerCase();
            }}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-2">
            Contraseña
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa la contraseña"
              {...register("password")}
              className={errors.password ? "border-red-500 pr-10" : "pr-10"}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="flex items-center gap-2">
            Confirmar contraseña*
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirma la contraseña"
              {...register("confirmPassword")}
              className={
                errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"
              }
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className=" w-full mt-4" disabled={!isValid}>
          <UserPlus className="mr-2 h-4 w-4" />
          Crear Usuario
        </Button>
      </form>
    </div>
  );
}
