import { Suspense } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import ReturnComponent from "@/components/ReturnComponent";
import { useDarDeBajaPageViewModel } from "@/viewModels/usarVistaModelo/privilegios/categoria/dar-de-baja/useDarDeBajaPageViewModel";


export default function Page() {
    const {
        categories,
        disabledCategories,
        selected,
        action,
        dialogOpen,
        setDialogOpen,
        getGradeLabel,
        openDialog,
        handleConfirm,
    } = useDarDeBajaPageViewModel();

    return (
        <>
            <ReturnComponent to={`..\\..\\`}/>

            <div className="container mx-auto max-w-6xl px-4 py-10">
                <Suspense fallback={<div>Cargando...</div>} />

                <Card className="mb-8">
                    <CardContent>
                        <CardTitle>
                            <h2 className="text-2xl text-red-600 font-bold mb-2 flex items-center gap-3">
                                <Trash2 />
                                Dar de Baja Categorías
                            </h2>
                            <p className="mb-4 text-gray-600">
                                Desactiva categorías que ya no sean necesarias
                                para que no aparezcan en futuras convocatorias.
                            </p>
                        </CardTitle>

                        <Table className="mx-auto">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Grado Mínimo</TableHead>
                                    <TableHead>Grado Máximo</TableHead>
                                    <TableHead className="text-right">
                                        Acción
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((cat) => (
                                    <TableRow key={cat.id}>
                                        <TableCell className="font-medium">
                                            {cat.nombre}
                                        </TableCell>
                                        <TableCell>
                                            {getGradeLabel(cat.minimo_grado)}
                                        </TableCell>
                                        <TableCell>
                                            {getGradeLabel(cat.maximo_grado)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    openDialog(
                                                        cat,
                                                        "deactivate"
                                                    )
                                                }
                                            >
                                                Dar de Baja
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {categories.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-center py-4 text-gray-500"
                                        >
                                            No hay categorías vigentes
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {disabledCategories.length > 0 && (
                    <Card>
                        <CardContent>
                            <CardTitle>Categorías Dadas de Baja</CardTitle>
                            <Table className="mx-auto">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead>Grado Mínimo</TableHead>
                                        <TableHead>Grado Máximo</TableHead>
                                        <TableHead className="text-right">
                                            Acción
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {disabledCategories.map((cat) => (
                                        <TableRow key={cat.id}>
                                            <TableCell className="opacity-50">
                                                {cat.nombre}
                                            </TableCell>
                                            <TableCell className="opacity-50">
                                                {getGradeLabel(
                                                    cat.minimo_grado
                                                )}
                                            </TableCell>
                                            <TableCell className="opacity-50">
                                                {getGradeLabel(
                                                    cat.maximo_grado
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right ">
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        openDialog(
                                                            cat,
                                                            "activate"
                                                        )
                                                    }
                                                >
                                                    Habilitar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent aria-describedby="dialog-desc">
                        <DialogHeader>
                            <DialogTitle>
                                {action === "deactivate"
                                    ? "Confirmar Dar de Baja"
                                    : "Confirmar Habilitar"}
                            </DialogTitle>
                        </DialogHeader>
                        <DialogDescription id="dialog-desc" className="px-6">
                            {action === "deactivate" ? (
                                <>
                                    ¿Estás seguro de que deseas dar de baja la
                                    categoría{" "}
                                    <strong>{selected?.nombre}</strong>? Esta
                                    acción la ocultará de futuras convocatorias.
                                </>
                            ) : (
                                <>
                                    ¿Estás seguro de que deseas habilitar la
                                    categoría{" "}
                                    <strong>{selected?.nombre}</strong>? Esta
                                    acción la mostrará en futuras convocatorias.
                                </>
                            )}
                        </DialogDescription>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant={action === "deactivate" ? "destructive" : "default"}
                                onClick={handleConfirm}
                            >
                                {action === "deactivate"
                                    ? "Dar de Baja"
                                    : "Habilitar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
