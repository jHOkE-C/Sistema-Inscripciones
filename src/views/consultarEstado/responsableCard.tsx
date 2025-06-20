import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, Phone, Award, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useResponsableCardViewModel } from "@/viewModels/usarVistaModelo/consultarEstado/useResponsableCardViewModel";
import type { Responsable } from "@/models/interfaces/consultarEstado.types";

interface ResponsableData {
  responsable: Responsable;
}

interface Data {
  data: ResponsableData;
}

export default function ResponsableCard({ data }: Data) {
  const { responsable } = useResponsableCardViewModel({ data });

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            Información del Responsable
          </CardTitle>
          <CardDescription>
            Detalles personales y participaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Información personal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre</p>
                <p>{responsable.nombre}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p>{responsable.telefono}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Correo</p>
                <p>{responsable.correo}</p>
              </div>
            </div>
          </div>

          {/* Participaciones */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-gray-500" />
              Inscripciones
            </h3>
            {responsable.participaciones.length === 0 && (
              <p className="text-gray-500">No hay inscripciones registradas.</p>
            )}
            {responsable.participaciones.map((participacion, index) => (
              <div key={index} className="mb-6 border rounded-lg p-4">
                <h4 className="text-md font-medium mb-3">
                  {participacion.olimpiada}
                </h4>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código de Inscripción</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha de Creación</TableHead>
                      <TableHead>Ver</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participacion.listas.map((lista, listaIndex) => (
                      <TableRow key={listaIndex}>
                        <TableCell className="font-medium">
                          {lista.codigo_lista}
                        </TableCell>
                        <TableCell>{lista.cantidad_inscritos}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-gray-100 text-gray-700 border-gray-200"
                          >
                            {lista.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>{lista.fecha_creacion}</TableCell>
                        <TableCell>
                          <Link to={`/consultarEstado/${lista.codigo_lista}`}>
                            <Button>Ver Inscripción</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
