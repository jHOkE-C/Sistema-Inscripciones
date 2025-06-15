"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import ResponsableCard from "./responsable-card";
import PostulanteCard from "./postulante-card";
import { Button } from "@/components/ui/button";
import InactivityModal from "./inactivity-modal";
import { Link } from "react-router-dom";
import { useConsultarInscripcionViewModel } from "@/viewModels/viewmodels/useConsultarInscripcionViewModel";

interface ConsultaInscripcionProps {
  titulo?: string;
  descripcion?: string;
  maxLength?: number;
}

export function ConsultaInscripcion({
  titulo = "Consulta de Estado de Inscripción",
  descripcion = "Ingrese su número de carnet para verificar su estado",
  maxLength = 10,
}: ConsultaInscripcionProps) {
  const {
    carnet,
    error,
    responsable,
    postulante,
    handleInputChange,
    handleSubmit,
    clean
  } = useConsultarInscripcionViewModel();

  return (
    <>
      {postulante ? (
        <div className="flex flex-col items-center justify-center ">
          <InactivityModal clean={clean} />
          <div className="w-full flex justify-between items-center pt-4 pb-0">
            <Link to="/">
              <Button variant="secondary" onClick={clean}>
                <ChevronLeft className=" h-4 w-4" />
                Volver al Inicio
              </Button>
            </Link>
            <Button className="w-30" onClick={clean}>
              Probar otro CI
            </Button>
          </div>
          <PostulanteCard data={{ postulante }} />
        </div>
      ) : responsable ? (
        <div className="flex flex-col items-center justify-center">
          <InactivityModal clean={clean} />
          <div className="w-full flex justify-between items-center p-4 pb-0">
            <Link to="/">
              <Button variant="secondary">
                <ChevronLeft className=" h-4 w-4" onClick={clean}/>
                Volver al Inicio
              </Button>
            </Link>
            <Button className="w-30" onClick={clean}>
              Probar otro CI
            </Button>
          </div>
          <ResponsableCard data={{ responsable }} />
        </div>
      ) : (
        <div className=" flex items-center justify-center w-screen h-[70vh]">
          <Card className="w-full m-4 max-w-xl">
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
              <CardFooter className="mt-4 justify-between flex">
                <Link to="/">
                  <Button variant="secondary" type="button">
                    <ChevronLeft className=" h-4 w-4" />
                    Volver
                  </Button>
                </Link>
                <Button type="submit">Continuar</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
