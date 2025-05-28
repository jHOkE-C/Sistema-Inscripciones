"use client";

import type React from "react";

import { useState } from "react";
import { ShieldPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/hooks/useApiRequest";

export default function CrearRol() {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-auto py-10 bg-indigo-500 hover:bg-indigo-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1">
          <ShieldPlus className="size-8 mb-1" />
          <span className="text-lg font-semibold">Crear Rol</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Rol</DialogTitle>
            <DialogDescription>
              Ingresa un nombre para el nuevo rol.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label
                htmlFor="role-name"
                className="flex items-center justify-between"
              />
                Nombre del Rol
                <span
                  className={`text-xs ${
                    roleName.length > 30
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {roleName.length}/30
                </span>
                <Input
                id="role-name"
                value={roleName}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase(); // Convert to lowercase
                  const regex = /^[a-z0-9\s]*$/; // Allow only lowercase letters and spaces
                  if (regex.test(value)) {
                  setRoleName(value);
                  if (value.trim() && error) {
                    setError("");
                  }
                  } else {
                  setError("Solo se permiten letras minúsculas, números y espacios");
                  }
                }}
                placeholder="Ingresa el nombre del rol"
                className={error ? "border-destructive" : ""}
                maxLength={30}
                />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRoleName("");
                setError("");
                setOpen(false);
              }}
              className="gap-2"
            >
              <span>Cancelar</span>
            </Button>
            <Button type="submit" className="gap-2">
              <span>Crear Rol</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
