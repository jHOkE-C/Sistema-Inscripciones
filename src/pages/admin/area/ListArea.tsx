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
import { useState } from "react";
export interface Categoria {
    id: string;
    nombre: string;
}
export interface Area {
    id: number;
    nombre: string;
    categorias: Categoria[];
}
interface ListAreaProps {
    areas: Area[] | null;
    loading: boolean;
    error: string | null;
    onDelete: (id: number) => void;
    eliminar?: boolean;
}
const ListArea = ({ areas, loading, onDelete, eliminar }: ListAreaProps) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [areaSeleccionada, setAreaSeleccionada] = useState<Area | null>(null);
    const confirmarEliminacion = (area: Area) => {
        setAreaSeleccionada(area);
        setShowConfirm(true);
    };

    const eliminarArea = async () => {
        if (areaSeleccionada) await onDelete(areaSeleccionada.id);
        setShowConfirm(false);
    };
    console.log(areas)

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
                    {areas &&
                        areas.map((area) => (
                            <TableRow key={area.id}>
                                <TableCell className="font-normal">
                                    {area.nombre}
                                </TableCell>

                                <TableCell className="text-right">
                                    {eliminar && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() =>
                                                confirmarEliminacion(area)
                                            }
                                        >
                                            <Trash2 className="mr-1 h-3 w-3" />{" "}
                                            Eliminar
                                        </Button>
                                    )}
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
                title={`¿Está seguro que desea dar de baja el área  ${areaSeleccionada?.nombre}?`}
                description={
                    <>
                        el área tiene las siguientes categorías relacionadas:
                        <br />
                        {areaSeleccionada?.categorias.map(({ nombre }, index) => (
                            <span className="ml-3" key={index}>
                                {nombre}
                                <br />
                            </span>
                        ))}
                    </>
                }
                continueButtonText="Dar de Baja"
                onConfirm={eliminarArea}
            />
        </>
    );
};

export default ListArea;
