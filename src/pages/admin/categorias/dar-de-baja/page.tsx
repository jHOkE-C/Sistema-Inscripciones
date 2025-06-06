import { Suspense, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import { toast } from "sonner";

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

import type { Category } from "@/models/categorias/types";
import ReturnComponent from "@/components/ReturnComponent";

export default function Page() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [disabledCategories, setDisabledCategories] = useState<Category[]>(
        []
    );
    const [selected, setSelected] = useState<Category | null>(null);
    // action puede ser 'deactivate' o 'activate'
    const [action, setAction] = useState<"deactivate" | "activate" | null>(
        null
    );
    const [dialogOpen, setDialogOpen] = useState(false);

    // Carga inicial de todas las categorías
    const fetchData = async () => {
        try {
            const { data } = await axios.get<Category[]>(
                `${API_URL}/api/categorias`
            );
            // asumimos que 'vigente' indica activas
            setCategories(data.filter((c) => c.vigente ?? true));
            setDisabledCategories(data.filter((c) => !c.vigente));
        } catch (e) {
            console.error(e);
            toast.error("Error al cargar categorías");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getGradeLabel = (grade: number) =>
        grade <= 6 ? `${grade}° Primaria` : `${grade - 6}° Secundaria`;

    // Abrir diálogo, pasando también la acción deseada
    const openDialog = (
        cat: Category,
        actionType: "deactivate" | "activate"
    ) => {
        setSelected(cat);
        setAction(actionType);
        setDialogOpen(true);
    };

    // Al confirmar en el diálogo, hacemos PUT al endpoint correcto
    const handleConfirm = async () => {
        if (!selected || !action) return;

        try {
            if (action === "deactivate") {
                await axios.put(
                    `${API_URL}/api/categorias/${selected.id}/deactivate`
                );
                toast.success(
                    `Se dio de baja la categoría "${selected.nombre}"`
                );
                // la quitamos de activas y la añadimos a deshabilitadas
                setCategories((prev) =>
                    prev.filter((c) => c.id !== selected.id)
                );
                setDisabledCategories((prev) => [...prev, selected]);
            } else {
                await axios.put(
                    `${API_URL}/api/categorias/${selected.id}/activate`
                );
                toast.success(`Se habilitó la categoría "${selected.nombre}"`);
                // la quitamos de deshabilitadas y la añadimos a activas
                setDisabledCategories((prev) =>
                    prev.filter((c) => c.id !== selected.id)
                );
                setCategories((prev) => [...prev, selected]);
            }
        } catch (e) {
            console.error(e);
            toast.error(
                action === "deactivate"
                    ? "Ocurrió un error al dar de baja la categoría"
                    : "Ocurrió un error al habilitar la categoría"
            );
        } finally {
            setDialogOpen(false);
            setSelected(null);
            setAction(null);
        }
    };

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
                            {action === "deactivate"
                                ? `¿Estás seguro de dar de baja la categoría “${selected?.nombre}”?`
                                : `¿Estás seguro de habilitar la categoría “${selected?.nombre}”?`}
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
        </>
    );
}
