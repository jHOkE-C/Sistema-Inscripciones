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
import { Link } from "react-router-dom";
import Loading from "@/components/Loading";
import NotFoundPage from "@/views/404";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListaViewModel } from "@/viewModels/usarVistaModelo/consultarEstado/useListaViewModel";

export default function Lista() {
  const { data, loading, notFound } = useListaViewModel();

  if (loading) return <Loading />;
  if (notFound) return <NotFoundPage />;

  return (
    <>
      <div className=" py-5">
        <Link to="/consultarEstado">
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
