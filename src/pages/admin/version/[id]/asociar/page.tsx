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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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

    // checked guarda el estado actual de cada categoría
    const [checked, setChecked] = useState<Record<number, boolean>>({});
    // initialChecked guarda los IDs que ya estaban asociados al abrir el diálogo
    const [initialChecked, setInitialChecked] = useState<number[]>([]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const { id: olimpiada_id } = useParams();

    useEffect(() => {
        fetchAreas();
        fetchCategories();
    }, []);

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
        if (!selectedArea) return;
        try {
            const data = await request<Asociacion[]>(
                `/api/areas/${selectedArea.id}/categorias/olimpiada/${olimpiada_id}`
            );
            // convertir a número y armar ambos estados
            const ids = data.map((a) => Number(a.id));
            setInitialChecked(ids);
            setChecked(
                ids.reduce((acc, id) => {
                    acc[id] = true;
                    return acc;
                }, {} as Record<number, boolean>)
            );
        } catch (e) {
            toast.error(
                e instanceof Error ? e.message : "Error al cargar asociaciones"
            );
        }
    };
    const openDialog = async (area: Area) => {
        setSelectedArea(area);
        setChecked({});
        setInitialChecked([]);
        setDialogOpen(true);

        // arrancar el fetch aquí mismo
        try {
            const data = await request<Asociacion[]>(
                `/api/areas/${area.id}/categorias/olimpiada/${olimpiada_id}`
            );
            const ids = data.map((a) => Number(a.id));
            setInitialChecked(ids);
            setChecked(ids.reduce((acc, id) => ({ ...acc, [id]: true }), {}));
        } catch (e) {
            toast.error(
                e instanceof Error ? e.message : "Error al cargar asociaciones"
            );
        }
    };
    // cada vez que cambie selectedArea recargamos las asociaciones
    useEffect(() => {
        if (selectedArea && dialogOpen) {
            fetchAsociacion();
        }
        fetchAsociacion();
    }, [selectedArea, dialogOpen]);

    const toggleCategory = (id: number) => {
        setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSave = async () => {
        if (!selectedArea) return;

        // IDs marcados ahora
        const selectedIds = Object.entries(checked)
            .filter(([, isChecked]) => isChecked)
            .map(([id]) => Number(id));

        // calculamos a agregar / quitar
        const toAdd = selectedIds.filter((id) => !initialChecked.includes(id));
        const toRemove = initialChecked.filter(
            (id) => !selectedIds.includes(id)
        );

        try {
            // petición única al endpoint bulk
            const payload = {
                id_area: Number(selectedArea.id),
                id_olimpiada: Number(olimpiada_id),
                agregar: toAdd,
                quitar: toRemove,
            };
            await request<{
                message: string;
                agregadas: number[];
                eliminadas: number[];
            }>("/api/categorias/area/olimpiada", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            toast.success("Se asociaron las categorias correctamente");
            setDialogOpen(false);
        } catch (e: unknown) {
            toast.error(
                e instanceof Error
                    ? e.message
                    : "Error al sincronizar asociaciones"
            );
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Asociar de Áreas</CardTitle>
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
                                        checked={!!checked[Number(cat.id)]}
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
                        <Button onClick={handleSave}>Asociar categorías</Button>
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
