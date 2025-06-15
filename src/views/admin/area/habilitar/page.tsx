import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Check } from "lucide-react";
import Header from "@/components/Header";
import { rutasAdmin } from "../../rutas-admin";
import Footer from "@/components/Footer";
import ReturnComponent from "@/components/ReturnComponent";
import { useHabilitarPageViewModel } from "@/viewModels/admin/area/habilitar/useHabilitarPageViewModel";

export default function Page() {
    const {
        areas,
        disabledAreas,
        selected,
        action,
        dialogOpen,
        setDialogOpen,
        openDialog,
        handleConfirm
    } = useHabilitarPageViewModel();

    return (
        <div className="flex flex-col min-h-screen">
            <Header rutas={rutasAdmin}/>
            <ReturnComponent to={`..\\..\\`}/>
            <div className="container mx-auto max-w-4xl py-5 space-y-8">
                {disabledAreas.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <RefreshCw className="text-gray-600" /> Áreas
                                dadas de baja
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Área</TableHead>
                                        <TableHead className="text-right">
                                            Acción
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {disabledAreas.map((area) => (
                                        <TableRow
                                            key={area.id}
                                            className=""
                                        >
                                            <TableCell className="opacity-50">{area.nombre}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        openDialog(
                                                            area,
                                                            "activate"
                                                        )
                                                    }
                                                    className="text-white"
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
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Check className="text-blue-600" /> Áreas Habilitadas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Área</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {areas.map((area) => (
                                    <TableRow key={area.id}>
                                        <TableCell>{area.nombre}</TableCell>
                                        <TableCell className="text-right">
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {areas.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={2}
                                            className="text-center py-4"
                                        >
                                            No hay áreas vigentes
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

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
                                    ¿Estás seguro de dar de baja el área "
                                    {selected?.nombre}"?
                                </>
                            ) : (
                                <>
                                    ¿Estás seguro de habilitar el área "
                                    {selected?.nombre}"?
                                </>
                            )}
                        </DialogDescription>
                        <DialogFooter className="flex justify-end space-x-2">
                            <Button
                                variant="ghost"
                                onClick={() => setDialogOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant={
                                    action === "deactivate"
                                        ? "destructive"
                                        : undefined
                                }
                                onClick={handleConfirm}
                            >
                                Confirmar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <Footer/>
        </div>
    );
}
