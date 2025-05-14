import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Award, BookOpen } from "lucide-react";

// Definición de tipos para el JSON
type Participacion = {
  olimpiada: string;
  niveles_competencia: string[];
};

export type Postulante = {
  nombres: string;
  apellidos: string;
  ci: string;
  departamento: string;
  participaciones: Participacion[];
};

type PostulanteData = {
  postulante: Postulante;
};

interface Data {
  data: PostulanteData;
}

// Mapeo de códigos de departamento a nombres completos
const departamentos: Record<string, string> = {
  LP: "La Paz",
  CB: "Cochabamba",
  SC: "Santa Cruz",
  OR: "Oruro",
  PT: "Potosí",
  TJ: "Tarija",
  CH: "Chuquisaca",
  BN: "Beni",
  PD: "Pando",
};

export default function PostulanteCard({ data }: Data) {
  const { postulante } = data;

  // Obtener el nombre completo del departamento o usar el código si no está en el mapeo
  const nombreDepartamento =
    departamentos[postulante.departamento] || postulante.departamento;

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Información del Postulante</CardTitle>
          <CardDescription>
            Detalles personales y participaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Información personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Nombre Completo
                  </p>
                  <p className="font-medium text-lg">{`${postulante.nombres} ${postulante.apellidos}`}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">CI</p>
                  <p>{postulante.ci}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Departamento
                  </p>
                  <p>
                    {nombreDepartamento} ({postulante.departamento})
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Línea divisoria */}
          <div className="border-t my-4"></div>

          {/* Participaciones */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-gray-500" />
              Participaciones
            </h3>

            {postulante.participaciones.map((participacion, index) => (
              <div key={index} className="mb-6 border rounded-lg p-4">
                <h4 className="text-md font-medium mb-3">
                  {participacion.olimpiada}
                </h4>

                <div className="mt-2">
                  <h5 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Niveles de Competencia
                  </h5>

                  <div className="flex flex-wrap gap-2">
                    {participacion.niveles_competencia.map(
                      (nivel, nivelIndex) => (
                        <Badge
                          key={nivelIndex}
                          variant="secondary"
                          className="px-3 py-1"
                        >
                          {nivel}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
