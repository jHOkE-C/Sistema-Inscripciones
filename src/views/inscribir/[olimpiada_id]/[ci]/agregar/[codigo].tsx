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
import DialogPostulante from "@/components/DialogPostulante";
import { usarCodigoViewModel } from "@/viewModels/usarVistaModelo/inscribir/olimpiada/agregar/useCodigoViewModel";

export default function Page() {
    const {
        data,
        notFound,
        loading,
        editar,
        onSubmit,
        terminarRegistro
    } = usarCodigoViewModel();

    if (loading) return <Loading />;
    if (notFound) return <NotFoundPage />;

    return (
        <>
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
                                    <DialogPostulante
                                        onSubmit={onSubmit}
                                        getParams
                                    />
                                )}

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        {editar && data.length > 0 && (
                                            <Button>Finalizar registro</Button>
                                        )}
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Esta seguro que deseas finalizar
                                                el registro?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta accion impedira el registro
                                                de nuevos postulantes a la inscripcion
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={terminarRegistro}
                                            >
                                                Continuar
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <Table>
                                {data.length === 0 && (
                                    <TableCaption>
                                        No existen postulantes registrados a
                                        esta inscripcion
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
                                            <TableCell>
                                                {inscripcion.nombres}
                                            </TableCell>
                                            <TableCell>
                                                {inscripcion.apellidos}
                                            </TableCell>
                                            <TableCell>
                                                {inscripcion.ci}
                                            </TableCell>
                                            <TableCell>
                                                {inscripcion.area}
                                            </TableCell>
                                            <TableCell>
                                                {inscripcion.categoria}
                                            </TableCell>
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
