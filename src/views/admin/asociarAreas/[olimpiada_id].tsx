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
import { ScrollArea } from "@/components/ui/scrollArea";
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
} from "@/components/ui/alertDialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import OlimpiadaNoEnCurso from "@/components/OlimpiadaNoEnCurso";
import ReturnComponent from "@/components/ReturnComponent";
import { useUsarAsociarAreas } from "@/viewModels/usarVistaModelo/privilegios/asociarAreas/usarAsociarAreas";

export default function Page() {
    const { olimpiada_id } = useParams();
    const {
        openDialog,
        setOpenDialog,
        setSelectedArea,
        searchTerm,
        setSearchTerm,
        searchAssociatedTerm,
        setSearchAssociatedTerm,
        olimpiada,
        availableAreas,
        filteredAssociatedAreas,
        handleAssociate,
        handleUnassociate
    } = useUsarAsociarAreas(olimpiada_id || "");

    if (!olimpiada_id) return null;

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
        <div className="flex justify-center w-full min-h-screen pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-5/6">
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
                                            No hay áreas asociadas
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
        </div>
        </div>
        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        ¿Estás seguro de desasociar esta área?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará la
                        asociación entre la olimpiada y el área seleccionada.
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
        </>
    );
}
