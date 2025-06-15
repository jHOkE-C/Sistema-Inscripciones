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
import { apiClient, request } from "@/models/api/request";
import type { Area } from "@/models/api/areas";
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
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Olimpiada } from "@/models/interfaces/versiones.type";
import { getOlimpiada } from "@/models/api/olimpiada";
import OlimpiadaNoEnCurso from "@/components/OlimpiadaNoEnCurso";
import ReturnComponent from "@/components/ReturnComponent";

export default function Page() {
    const [areas, setAreas] = useState<Area[]>([]);
    const [associatedIds, setAssociatedIds] = useState<Set<string>>(new Set());
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedArea, setSelectedArea] = useState<Area>();
    const { olimpiada_id } = useParams();
    const [associatedAreas, setAssociatedAreas] = useState<Area[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchAssociatedTerm, setSearchAssociatedTerm] = useState("");
    const [olimpiada, setOlimpiada] = useState<Olimpiada>();

    useEffect(() => {
        fetchAreas();
        fetchAssociated();
        fetchOlimpiada();
    }, []);

    if (!olimpiada_id) return;
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
    const fetchOlimpiada = async () => {
        const olimpiada = await getOlimpiada(olimpiada_id);
        setOlimpiada(olimpiada);
    };

    const fetchAssociated = async () => {
        try {
            const data = await request<Area[]>(
                `/api/areas/categorias/olimpiada/${olimpiada_id}`
            );
            setAssociatedAreas(data);
            setAssociatedIds(new Set(data.map((a) => a.id)));
        } catch (e: unknown) {
            toast.error(
                e instanceof Error
                    ? e.message
                    : "Error al cargar áreas asociadas"
            );
        }
    };

    const handleAssociate = async (area: Area) => {
        try {
            await apiClient.post("/api/olimpiada/area", {
                area_id: area.id,
                olimpiada_id,
            });
            setAssociatedIds((prev) => new Set(prev).add(area.id));
            setAssociatedAreas((prev) => [...prev, area]);
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
            await request("/api/olimpiada/area", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ area_id: id, olimpiada_id }),
            });
            setAssociatedIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
            setAssociatedAreas((prev) => prev.filter((a) => a.id !== id));
            toast.success("Área desasociada correctamente");
        } catch (e: unknown) {
            toast.error(
                e instanceof Error ? e.message : "Error al desasociar área"
            );
        } finally {
            setOpenDialog(false);
        }
    };

    const availableAreas = areas
        .filter((a) => !associatedIds.has(a.id))
        .filter((a) =>
            a.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const filteredAssociatedAreas = associatedAreas.filter((a) =>
        a.nombre.toLowerCase().includes(searchAssociatedTerm.toLowerCase())
    );

    if (
        olimpiada &&
        (olimpiada?.fase?.fase.nombre_fase !== "Preparación" || !olimpiada.fase)
    )
        return (
            <OlimpiadaNoEnCurso
                olimpiada={olimpiada}
                text={"La olimpiada no esta en Fase de Preparación"}
            />
        );

    return (
        <>
        <ReturnComponent to={`..\\..\\`}/>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Áreas Disponibles</CardTitle>
                    <div className="flex items-center space-x-2">
                        <Input
                            placeholder="Buscar área..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-48"
                        />
                        <Search className="w-5 h-5 text-gray-500" />
                    </div>
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
                                    <TableRow
                                        key={area.id}
                                    >
                                        <TableCell>{area.nombre}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    handleAssociate(area)
                                                }
                                            >
                                                Asociar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {availableAreas.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={2}
                                            className="text-center text-gray-500"
                                        >
                                            No se encontraron áreas
                                        </TableCell>
                                    </TableRow>
                                )}
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
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Áreas Asociadas</CardTitle>
                    <div className="flex items-center space-x-2">
                        <Input
                            placeholder="Buscar área asociada..."
                            value={searchAssociatedTerm}
                            onChange={(e) =>
                                setSearchAssociatedTerm(e.target.value)
                            }
                            className="w-48"
                        />
                        <Search className="w-5 h-5 text-gray-500" />
                    </div>
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
                                {filteredAssociatedAreas.map((area) => (
                                    <TableRow
                                        key={area.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <TableCell>{area.nombre}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedArea(area);
                                                    setOpenDialog(true);
                                                }}
                                            >
                                                Desasociar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredAssociatedAreas.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={2}
                                            className="text-center text-gray-500"
                                        >
                                            No se encontraron áreas asociadas
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell
                                        colSpan={2}
                                        className="text-gray-500"
                                    >
                                        Total: {filteredAssociatedAreas.length}
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
                            Desasociar área "{selectedArea?.nombre}"?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer.
                            {selectedArea && selectedArea.categorias && (
                                <p className="mt-2">
                                    El área tiene las siguientes categorías
                                    asociadas:{" "}
                                    {selectedArea.categorias
                                        .map((c) => c.nombre)
                                        .join(", ")}
                                    . Todas serán eliminadas.
                                </p>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUnassociate}>
                            Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
        </>
    );
}
