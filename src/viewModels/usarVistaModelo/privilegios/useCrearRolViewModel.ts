import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/viewModels/hooks/useApiRequest";

export function useCrearRolViewModel() {
  const [open, setOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleName.trim()) {
      setError("El nombre del rol es obligatorio");
      return;
    }

    if (roleName.length > 30) {
      setError("El nombre del rol no puede exceder 30 caracteres");
      return;
    }

    const newRol = {
      nombre: roleName,
    };

    try {
      await axios.post(`${API_URL}/api/roles`, newRol);
      toast.success(`Rol ${roleName} creado exitosamente`);
      setOpen(false);
      setRoleName("");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        toast.error("El nombre del rol ingresado ya existe");
      } else {
        toast.error("Error al crear el rol");
      }
    }
  };

  const handleRoleNameChange = (value: string) => {
    const lowercaseValue = value.toLowerCase();
    const regex = /^[a-z0-9\s]*$/;
    
    if (regex.test(lowercaseValue)) {
      setRoleName(lowercaseValue);
      if (lowercaseValue.trim() && error) {
        setError("");
      }
    } else {
      setError("Solo se permiten letras minúsculas, números y espacios");
    }
  };

  const handleClose = () => {
    setRoleName("");
    setError("");
    setOpen(false);
  };

  return {
    open,
    setOpen,
    roleName,
    error,
    handleSubmit,
    handleRoleNameChange,
    handleClose
  };
} 