import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { request } from "@/api/request";
import type { Area, Categoria } from "@/api/areas";
import { useParams } from "react-router-dom";
interface Asociacion {
    id: string;
    nombre: string;
}

export default function Page() {
    const [areas, setAreas] = useState<Area[]>([]);
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [selectedArea, setSelectedArea] = useState<Area | null>(null);
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        fetchAreas();
        fetchCategories();
    }, []);

    const { id: olimpiada_id } = useParams();
    const fetchAreas = async () => {
        try {
            const data = await request<Area[]>("/api/areas", { method: "GET" });
            setAreas(data);
        } catch (e: unknown) {
            toast.error(
                e instanceof Error ? e.message : "Error al cargar áreas"
            );
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await request<Categoria[]>("/api/categorias", {
                method: "GET",
            });
            setCategories(data);
        } catch (e: unknown) {
            toast.error(
                e instanceof Error ? e.message : "Error al cargar categorías"
            );
        }
    };

    const fetchAsociacion = async () => {
        try {
            const data = await request<Asociacion[]>(
                `/api/areas/${selectedArea?.id}/categorias/olimpiada/${olimpiada_id}`
            );
            setChecked(data.reduce((acc, { id }) => ({ ...acc, [id]: true }), {}));
        } catch (e) {
            toast.error(
                e instanceof Error ? e.message : "Error al cargar categorías"
            );
        }
    };

    useEffect(() => {
        if (!selectedArea) return;
        fetchAsociacion();
    }, [selectedArea]);

    const openDialog = (area: Area) => {
        setSelectedArea(area);
        setChecked({});
        setDialogOpen(true);
    };

    const toggleCategory = (id: number) => {
        setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSave = async () => {
        if (!selectedArea) return;
        const selectedIds = Object.entries(checked)
            .filter(([, checked]) => checked)
            .map(([id]) => Number(id));

        try {
            for (const id of selectedIds) {
                const asociacion = {
                    "categoria_id": id.toString(),
                    "area_id": selectedArea.id.toString(),
                    "olimpiada_id":olimpiada_id,
                };
                 console.log(asociacion);
                await request(`/api/categoria/area/olimpiada`, {
                    method: "POST",
                    body: JSON.stringify(asociacion),
                });
            }
            toast.success("Se asociaron las categorías correctamente");
            setDialogOpen(false);
        } catch (e: unknown) {
            toast.error(
                e instanceof Error ? e.message : "Error al asociar categorías"
            );
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Gestión de Áreas</CardTitle>
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
                            {areas.map((area) => (
                                <TableRow key={area.id}>
                                    <TableCell className="font-medium">
                                        {area.nombre}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            onClick={() => openDialog(area)}
                                        >
                                            Asociar categorías
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    className="text-gray-500"
                                >
                                    Total de áreas: {areas.length}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Asociar a {selectedArea?.nombre}
                    </DialogTitle>
                </DialogHeader>
                    <ScrollArea className="h-60 w-full space-y-2 pr-2">
                        <div className="grid grid-cols-2 gap-4">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={`cat-${cat.id}`}
                                        checked={!!checked[cat.id]}
                                        onCheckedChange={() =>
                                            toggleCategory(Number(cat.id))
                                        }
                                    />
                                    <Label
                                        htmlFor={`cat-${cat.id}`}
                                        className="text-base font-normal"
                                    >
                                        {cat.nombre}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button onClick={handleSave}>Guardar</Button>
                        <Button
                            variant="ghost"
                            onClick={() => setDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
