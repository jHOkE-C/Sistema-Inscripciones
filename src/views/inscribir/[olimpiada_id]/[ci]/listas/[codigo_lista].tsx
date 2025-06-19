import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReturnComponent from "@/components/ReturnComponent";
import Loading from "@/components/Loading";
import NotFoundPage from "@/views/404";
import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
import ShareUrl from "@/views/inscribir/compartir";
import StepFormPostulante from "@/components/StepFormPostulante";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCodigoListaViewModel } from "@/viewModels/usarVistaModelo/inscribir/olimpiada/listas/usarCodigoListaViewModel";
import Header from "@/components/Header";

export default function Page() {
  const {
    data,
    notFound,
    loading,
    editar,
    olimpiada,
    olimpiadaLoading,
    openForm,
    setOpenForm,
    onSubmit,
    terminarRegistro,
    fetchData,
  } = useCodigoListaViewModel();

  if (loading || olimpiadaLoading) return <Loading />;
  if (notFound) return <NotFoundPage />;

  return (
    <>
      <Header />
      <ReturnComponent />
      <div className="flex min-h-screen py-4 justify-center">
        <div className="w-5/6 mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Inscripciones de Postulantes
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto space-y-5">
              <div className="flex justify-between">
                {editar && (
                  <Button
                    className="text-sm"
                    onClick={() => {
                      setOpenForm(true);
                    }}
                  >
                    <PenBox />
                    <span className=" font-semibold text-wrap text-center">
                      Inscribir Postulante
                    </span>
                  </Button>
                )}
                {editar && data.length > 0 && (
                  <Button onClick={() => terminarRegistro(fetchData)}>
                    Finalizar registro
                  </Button>
                )}
              </div>
              <Table>
                {data.length === 0 && (
                  <TableCaption>
                    No existen postulantes registrados a esta inscripción
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
                    <TableRow
                      key={
                        inscripcion.area +
                        inscripcion.categoria +
                        "" +
                        inscripcion.id
                      }
                    >
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
        <ShareUrl />
      </div>
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className=" md:max-w-4xl min-h-[500px] max-h-[90vh] overflow-y-auto ">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Postulante</DialogTitle>
            <DialogDescription>
              Ingresa los datos del nuevo postulante para las olimpiadas ohSansi
            </DialogDescription>
            <StepFormPostulante onSubmit={onSubmit} olimpiada={olimpiada} />
          </DialogHeader>{" "}
        </DialogContent>{" "}
      </Dialog>
    </>
  );
}
