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
import ResponsableCard, { Responsable } from "./responsable-card";
import PostulanteCard, { Postulante } from "./postulante-card";


interface ConsultaInscripcionProps {
  titulo?: string;
  descripcion?: string;
  maxLength?: number;
}


export interface Consulta {
  responsable?: Responsable;
  postulante?: Postulante;
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

    try {
      const req = await axios.get<Consulta>(
        `${API_URL}/api/inscripciones/ci/${carnet}`
      );
      if (req.data.postulante) {
        setPostulante(req.data.postulante);
        console.log(req.data.postulante);
        setResponsable(null);
      } else if (req.data.responsable) {
        setResponsable(req.data.responsable);
        console.log(req.data.responsable);
        setPostulante(null);
      }
      toast.success("Carnet encontrado");
    } catch (error) {
      console.error("Error al consultar el estado de inscripción:", error);
      toast.error("El carnet ingresado no tiene registros o inscripciones");
    }
  };

  if (postulante) {
    return <PostulanteCard data={{postulante}}/>;
  }

  if (responsable) {
    return <ResponsableCard data={{responsable}} />
  }

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
