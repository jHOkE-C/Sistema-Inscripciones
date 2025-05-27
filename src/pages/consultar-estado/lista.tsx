import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "react-router-dom";
import { getInscritosPorLista } from "@/api/postulantes";

import Loading from "@/components/Loading";
import NotFoundPage from "@/pages/404";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Postulante = {
  id: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  provincia_id: string;
  email: string;
  ci: string;
  curso: string;
  area: string;
  categoria: string;
};


export default function Lista() {
  const [data, setData] = useState<Postulante[]>([]);
  const { codigo_lista } = useParams();
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  if (!codigo_lista) return;

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getInscritosPorLista(codigo_lista);
      setData(data.data);
      setNotFound(false);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (notFound) return <NotFoundPage />;

  return (
    <>
      <div className=" py-5">
        <Link to="/consultar-estado">
          <Button variant="secondary">
            <ChevronLeft className=" h-4 w-4" />
            Volver
          </Button>
        </Link>
        <p className="text-2xl font-medium p-4 text-center">
          Listado de Postulantes
        </p>
        <div>
          <Card className="w-4xl">
            <CardContent className="overflow-x-auto space-y-5">
              <Table>
                {data.length === 0 && (
                  <TableCaption>
                    No existen postulantes registrados a esta lista
                  </TableCaption>
                )}

                <TableHeader>
                  <TableRow>
                    <TableHead>Nombres</TableHead>
                    <TableHead>Apellidos</TableHead>
                    <TableHead>CI</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Categoria</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((inscripcion) => (
                    <TableRow key={inscripcion.id}>
                      <TableCell>{inscripcion.nombres}</TableCell>
                      <TableCell>{inscripcion.apellidos}</TableCell>
                      <TableCell>{inscripcion.ci}</TableCell>
                      <TableCell>{inscripcion.area}</TableCell>
                      <TableCell>{inscripcion.categoria}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
