import AlertDialogComponent from "@/components/AlertDialogComponent";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loading } from "@/components/ui/spinner";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
export interface Area {
    id: number;
    nombre: string;
}
interface ListAreaProps {
    areas: Area[] | null;
    loading: boolean;
    error: string | null;
    onDelete: (id: number) => void;
}
const ListArea = ({ areas, loading, onDelete }: ListAreaProps) => {
    const [idEliminar, setIdEliminar] = useState<number | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const confirmarEliminacion = (id: number) => {
        setIdEliminar(id);
        setShowConfirm(true);
    };
    
    const eliminarArea = async () => {
        if(idEliminar) await onDelete(idEliminar);
        setShowConfirm(false);
    };

    if (loading) return <Loading />;
    return (
        <>
            <Table className="mt-5">
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {areas &&
                        areas.map((area) => (
                            <TableRow key={area.id}>
                                <TableCell className="font-medium">
                                    {area.nombre}
                                </TableCell>

                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    confirmarEliminacion(
                                                        area.id
                                                    )
                                                }
                                                variant="destructive"
                                            >
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}

                    {!areas && (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="text-center py-8 text-muted-foreground"
                            >
                                No hay áreas configuradas
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <AlertDialogComponent
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title="¿Está seguro de eliminar esta área? Esta acción no se puede deshacer."
                continueButtonText="Eliminar"
                onConfirm={eliminarArea}
            />
        </>
    );
};

export default ListArea;
