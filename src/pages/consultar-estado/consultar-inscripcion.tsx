"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { API_URL } from "@/hooks/useApiRequest";
import { toast } from "sonner";
import ResponsableCard, { Responsable } from "./responsable-card";
import PostulanteCard, { Postulante } from "./postulante-card";
import { Button } from "@/components/ui/button";

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

  const clean = () => {
    setCarnet("");
    setPostulante(null);
    setResponsable(null);
    sessionStorage.removeItem("postulante");
    sessionStorage.removeItem("responsable");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
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
        sessionStorage.setItem(
          "postulante",
          JSON.stringify(req.data.postulante)
        );
        setResponsable(null);
        toast.success("Carnet encontrado");
      } else if (req.data.responsable) {
        setResponsable(req.data.responsable);
        sessionStorage.setItem(
          "responsable",
          JSON.stringify(req.data.responsable)
        );
        setPostulante(null);
        toast.success("Carnet encontrado");
      } else {
        toast.error("El carnet ingresado no tiene registros o inscripciones");
      }

      sessionStorage.setItem("ci-consulta", carnet);
    } catch (error) {
      console.error("Error al consultar:", error);
      toast.error("El carnet ingresado no tiene registros o inscripciones");
    }
  };

  useEffect(() => {
    const savedResp = sessionStorage.getItem("responsable");
    if (savedResp) {
      setResponsable(JSON.parse(savedResp));
    }

    const savedPost = sessionStorage.getItem("postulante");
    if (savedPost) {
      setPostulante(JSON.parse(savedPost));
    }
  }, []);


  return (
    <>
      {postulante ? (
        <div className="flex flex-col items-center justify-center w-5/6">
          <PostulanteCard data={{ postulante }} />
          <Button className="w-30 mt-4" onClick={clean}>
            Probar otro CI
          </Button>
        </div>
      ) : responsable ? (
        <div className="flex flex-col items-center justify-center w-5/6">
          <ResponsableCard data={{ responsable }} />
          <Button className="w-30 mt-4" onClick={clean}>
            Probar otro CI
          </Button>
        </div>
      ) : (
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
      )}
    </>
  );
}
