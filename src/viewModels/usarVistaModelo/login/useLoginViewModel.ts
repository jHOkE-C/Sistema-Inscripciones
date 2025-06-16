import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/models/api/login";
import { useAuth } from "@/viewModels/hooks/auth";

const loginSchema = z.object({
    nombre_usuario: z.string().min(1, "El usuario es obligatorio"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const useLoginViewModel = () => {
    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            nombre_usuario: "",
            password: "",
        },
    });
    const [error, setError] = useState<string | null>(null);
    const { logIn } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (values: LoginFormData) => {
        try {
            const data = await login(values);
            logIn(data);
            navigate("/admin");
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Error Desconocido");
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        form,
        error,
        onSubmit,
        clearError
    };
}; 