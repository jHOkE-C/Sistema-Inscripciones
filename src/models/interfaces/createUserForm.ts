import { z } from "zod";

// Esquema de validación
export const formSchema = z
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

export type FormData = z.infer<typeof formSchema>;
