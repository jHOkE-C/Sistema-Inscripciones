"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

import { Label } from "@/components/ui/label";
import axios from "axios";
import { API_URL } from "@/hooks/useApiRequest";
import { toast } from "sonner";

interface ConsultaInscripcionProps {
  titulo?: string;
  descripcion?: string;
  maxLength?: number;
}

interface Listas {
  codigo_lista: string;
  cantidad: number;
  estado: string;
}

export interface Responsable {
  responsable: {
    ci: string;
    correo: string;
    telefono: string;
    listas: Listas[]
  }
}

interface Postulante {
  postulante: {
    nombre: string;
    apellidos: string;
    ci: string;
    departamento: string;
    olimpiada: string;
    niveles_competencia: string[]
    estado: string;
  }
}

export function ConsultaInscripcion({
  titulo = "Consulta de Estado de Inscripción",
  descripcion = "Ingrese su número de carnet para verificar su estado",
  maxLength = 10,
}: ConsultaInscripcionProps) {
  const [carnet, setCarnet] = useState("");
  const [error, setError] = useState("");
  const [responsable, setResponsable] = useState<Responsable | null>(null);
  const [postulante, setPostulante] = useState<Postulante | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Solo permitir caracteres numéricos
    if (value === "" || /^\d+$/.test(value)) {
      setCarnet(value);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!carnet) {
      setError("Por favor ingrese su número de carnet");
      return;
    }

    const req1 = axios.get(`${API_URL}/api/inscripciones/postulantes/${carnet}`);
    const req2 = axios.get(`${API_URL}/api/inscripciones/responsables/${carnet}`);

    const [res1, res2] = await Promise.allSettled([req1, req2]);

    if (res1.status === "fulfilled") {
      toast.success("Carnet de postulante encontrado");
      setPostulante(res1.value.data);
      setResponsable(null);
      return;
    }

    if (res2.status === "fulfilled") {
      toast.success("Carnet de responsable encontrado");
      setResponsable(res2.value.data);
      setPostulante(null);
      return;
    }

    // Si ambas fallan, mostrar error
    if (res1.status === "rejected" && res2.status === "rejected") {
      toast.error("Error al consultar el estado de inscripción");
    }
  };
  if (!responsable && !postulante) {
  return (
    <Card className="w-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{titulo}</CardTitle>
        <CardDescription>{descripcion}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-2">
          <label htmlFor="carnet" className="text-sm font-medium">
            Número de Carnet
          </label>
          <Input
            id="carnet"
            type="text"
            placeholder="Ingrese solo números"
            value={carnet}
            onChange={handleInputChange}
            maxLength={maxLength}
            className="w-full"
          />
          {error && (
            <Label className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </Label>
          )}
        </CardContent>
        <CardFooter className="mt-4">
          <Button type="submit" className="w-full">
            Continuar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
  }
  
  if (postulante) {
    return <div>Usted es postulante</div>
  }
  return (
    <Card className="w-xl">
    <div>Usted es responsable</div>
    </Card>
  );
} 

