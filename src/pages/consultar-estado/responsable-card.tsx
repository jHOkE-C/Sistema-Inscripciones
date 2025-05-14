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
import { User, Mail, Phone, Award } from "lucide-react";

type Lista = {
  codigo_lista: string;
  cantidad: number;
  estado: string;
};

type Participacion = {
  olimpiada: string;
  listas: Lista[];
};

export type Responsable = {
  ci: string;
  correo: string;
  telefono: string;
  participaciones: Participacion[];
};

type ResponsableData = {
  responsable: Responsable;
};

interface Data {
  data: ResponsableData;
}

export default function ResponsableCard({ data }: Data) {
  const { responsable } = data;

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
                <p className="text-sm font-medium text-gray-500">CI</p>
                <p>{responsable.ci}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Correo</p>
                <p>{responsable.correo}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p>{responsable.telefono}</p>
              </div>
            </div>
          </div>

          {/* Participaciones */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-gray-500" />
              Participaciones
            </h3>

            {responsable.participaciones.map((participacion, index) => (
              <div key={index} className="mb-6 border rounded-lg p-4">
                <h4 className="text-md font-medium mb-3">
                  {participacion.olimpiada}
                </h4>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código de Lista</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participacion.listas.map((lista, listaIndex) => (
                      <TableRow key={listaIndex}>
                        <TableCell className="font-medium">
                          {lista.codigo_lista}
                        </TableCell>
                        <TableCell>{lista.cantidad}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-yellow-50 text-yellow-700 border-yellow-200"
                          >
                            {lista.estado}
                          </Badge>
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
