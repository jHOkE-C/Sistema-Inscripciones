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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { apiClient, request } from "@/api/request";
import type { Area } from "@/api/areas";
import { useParams } from "react-router-dom";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Page() {
    const [areas, setAreas] = useState<Area[]>([]);
    const [associatedIds, setAssociatedIds] = useState<Set<string>>(new Set());
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedArea, setSelectedArea] = useState<Area>();
    const { olimpiada_id } = useParams();
    const [associatedAreas, setAssociatedAreas] = useState<Area[]>([]);

    useEffect(() => {
        fetchAreas();
        fetchAssociated();
    }, []);

    const fetchAreas = async () => {
        try {
            const data = await request<Area[]>("/api/areas", { method: "GET" });
            setAreas(data.filter((a) => a.vigente));
        } catch (e: unknown) {
            toast.error(
                e instanceof Error ? e.message : "Error al cargar áreas"
            );
        }
    };

    const fetchAssociated = async () => {
        try {
            const data = await request<Area[]>(
                `/api/areas/categorias/olimpiada/${olimpiada_id}`
            );
            const ids = data.map((a) => a.id);
            setAssociatedIds(new Set(ids));
            setAssociatedAreas(data);
        } catch (e: unknown) {
            toast.error(
                e instanceof Error
                    ? e.message
                    : "Error al cargar áreas asociadas"
            );
        }
    };

    const handleAssociate = async (areaId: string) => {
        try {
            await apiClient.post(`/api/olimpiada/area`, {
                area_id: areaId,
                olimpiada_id,
            });
            setAssociatedIds((prev) => new Set(prev).add(areaId));
            toast.success("Área asociada correctamente");
        } catch (e: unknown) {
            toast.error(
                e instanceof Error ? e.message : "Error al asociar área"
            );
        }
    };

    const handleUnassociate = async () => {
        if (!selectedArea) return;
        const { id } = selectedArea;
        try {
            await request(`/api/olimpiada/area`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ area_id: id, olimpiada_id }),
            });
            setAssociatedIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
            toast.success("Área desasociada correctamente");
        } catch (e: unknown) {
            toast.error(
                e instanceof Error ? e.message : "Error al desasociar área"
            );
        }
    };

    const availableAreas = areas.filter((a) => !associatedIds.has(a.id));

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Áreas Disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre de Área</TableHead>
                                    <TableHead className="text-right">
                                        Acción
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {availableAreas.map((area) => (
                                    <TableRow key={area.id}>
                                        <TableCell>{area.nombre}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    handleAssociate(area.id)
                                                }
                                            >
                                                Asociar
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
                                        Total: {availableAreas.length}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Áreas Asociadas</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre de Área</TableHead>
                                    <TableHead className="text-right">
                                        Acción
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {associatedAreas.map((area) => (
                                    <TableRow key={area.id}>
                                        <TableCell>{area.nombre}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    setOpenDialog(true);
                                                    setSelectedArea(area);
                                                }}
                                            >
                                                Desasociar
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
                                        Total: {associatedAreas.length}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>

            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Esta seguro que desea desasociar el area{" "}
                            {selectedArea?.nombre}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta accion no se puede deshacer.
                            <br />
                            {selectedArea &&
                                "El área tiene las siguientes categorias asociadas: " +
                                    selectedArea?.categorias
                                        ?.map(({ nombre }) => nombre)
                                        .join(", ") +
                                    " todas las categorias asociadas seran eliminadas."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUnassociate}>
                            Continuar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
