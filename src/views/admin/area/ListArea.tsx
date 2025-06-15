import AlertDialogComponent from "@/components/AlertDialogComponent";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/spinner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { type Area } from "@/models/api/areas";
import { useListAreaViewModel } from "@/viewModels/admin/area/useListAreaViewModel";

interface ListAreaProps {
    areas: Area[];
    loading?: boolean;
    error: string | null;
    onDelete: (id: number) => void;
    eliminar?: boolean;
}

const ListArea = ({ areas, loading, onDelete, eliminar }: ListAreaProps) => {
    const {
        showConfirm,
        setShowConfirm,
        areaSeleccionada,
        confirmarEliminacion,
        eliminarArea
    } = useListAreaViewModel({ areas, onDelete });

    if (loading) return <Loading />;
    return (
        <>
            <Table className="mt-5">
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        {eliminar && (
                            <TableHead className="text-right font-bold">
                                Acciones
                            </TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {areas.length > 0 ? (
                        areas.map((area) => (
                            <TableRow key={area.id}>
                                <TableCell className={"font-normal " + (area.vigente ? "" : "text-gray-500")}>
                                    {area.nombre}
                                </TableCell>

                                <TableCell className="text-right">
                                    {eliminar && area.vigente && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => confirmarEliminacion(area)}
                                        >
                                            <Trash2 className="mr-1 h-3 w-3" />{" "}
                                            Dar de Baja
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="text-center py-8 text-muted-foreground"
                            >
                                No hay áreas
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <AlertDialogComponent
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title={`¿Está seguro que desea dar de baja el área  ${areaSeleccionada?.nombre}?`}
                continueButtonText="Dar de Baja"
                continueIsDanger
                onConfirm={eliminarArea}
            />
        </>
    );
};

export default ListArea;
