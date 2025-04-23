import { Suspense, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/hooks/useApiRequest";
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

import type { Category } from "../types";

export default function Page() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [disabledCategories, setDisabledCategories] = useState<Category[]>(
        []
    );
    const [selected, setSelected] = useState<Category | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchData = async () => {
        try {
            const { data } = await axios.get<Category[]>(
                `${API_URL}/api/categorias`
            );
            console.log(data)
            const act = data.filter((c) => c.vigente ?? true);
            const dis = data.filter((c) => !c.vigente);
            setCategories(act);
            setDisabledCategories(dis);
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

    const openDialog = (cat: Category) => {
        setSelected(cat);
        setDialogOpen(true);
    };

    const handleConfirm = async () => {
        if (!selected) return;
        try {
            await axios.put(`${API_URL}/api/categorias/${selected.id}/deactivate`);
            setCategories((prev) => prev.filter((c) => c.id !== selected.id));
            setDisabledCategories((prev) => [...prev, selected]);
            toast.success(`Se dio de baja la categoría "${selected.nombre}"`);
        } catch {
            toast.error("Ocurrió un error al dar de baja la categoría");
        } finally {
            setDialogOpen(false);
        }
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 py-10">
            <Suspense fallback={<div>Cargando...</div>} />

            <Card className="mb-8">
                <CardContent>
                    <CardTitle>
                        <h1 className="text-2xl text-red-600 font-bold mb-2 flex items-center gap-3">
                            <Trash2 />
                            Dar de Baja Categorías
                        </h1>
                        <p className="mb-4 text-gray-600">
                            Desactiva categorías que ya no sean necesarias para
                            que no aparezcan en futuras convocatorias.
                        </p>
                    </CardTitle>

                    <Table className="mx-auto">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Categoria</TableHead>
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
                                            onClick={() => openDialog(cat)}
                                        >
                                            Dar de Baja
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* 4) Lista de categorías dadas de baja */}
            {disabledCategories.length > 0 && (
                <Card>
                    <CardContent>
                        <CardTitle>Categorías Dadas de Baja</CardTitle>
                        <Table className="mx-auto">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Grado Mínimo</TableHead>
                                    <TableHead>Grado Máximo</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {disabledCategories.map((cat) => (
                                    <TableRow
                                        key={cat.id}
                                        className="opacity-50"
                                    >
                                        <TableCell>{cat.nombre}</TableCell>
                                        <TableCell>
                                            {getGradeLabel(cat.minimo_grado)}
                                        </TableCell>
                                        <TableCell>
                                            {getGradeLabel(cat.maximo_grado)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* 5) Diálogo de confirmación */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent aria-describedby="dialog-desc">
                    <DialogHeader>
                        <DialogTitle>Confirmar Baja</DialogTitle>
                    </DialogHeader>
                    <DialogDescription id="dialog-desc">
                        ¿Estás seguro de dar de baja la categoría “
                        {selected?.nombre}”?
                    </DialogDescription>
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button variant="destructive" onClick={handleConfirm}>
                            Confirmar
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
