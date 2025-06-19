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
import { useParams } from "react-router-dom";
import Loading from "@/components/Loading";
import NotFoundPage from "@/views/404";
import ReturnComponent from "@/components/ReturnComponent";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alertDialog";
import ShareUrl from "@/views/inscribir/compartir";
import { Check, PenBox } from "lucide-react";
import StepFormPostulante from "@/components/StepFormPostulante";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCodigoListaViewModel } from "@/viewModels/usarVistaModelo/inscribir/olimpiada/useCodigoListaViewModel";
import Header from "@/components/Header";
export default function Page() {
  const {
    data,
    notFound,
    loading,
    editar,
    openForm,
    setOpenForm,
    olimpiada,
    olimpiadaLoading,
    onSubmit,
    terminarRegistro,
  } = useCodigoListaViewModel();

  const { codigo_lista, ci, olimpiada_id } = useParams();

  if (loading) return <Loading />;
  if (notFound) return <NotFoundPage />;
  if (!codigo_lista || !ci || !olimpiada_id || olimpiadaLoading)
    return <Loading />;

  return (
    <>
      <Header />
      <ReturnComponent />
      <div className="w-full flex justify-center min-h-screen py-2">
        <div className="w-5/6 py-4 mx-auto">
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
                <ButtonFinalizarRegistro
                  show={editar && data.length > 0}
                  onFinish={terminarRegistro}
                />
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
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const ButtonFinalizarRegistro = ({
  show,
  onFinish,
}: {
  show: boolean;
  onFinish?: () => void;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {show && (
          <Button>
            <Check />
            Finalizar registro
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Al finalizar el registro no podrás agregar más postulantes a esta
            inscripción.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onFinish}>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
