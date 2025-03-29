import { AlertComponent } from "@/components/AlertComponent";
import AlertDialogComponent from "@/components/AlertDialogComponent";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { API_URL, useApiRequest } from "@/hooks/useApiRequest";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
export interface Area {
    id: number;
    nombre: string;
}
const ListArea = () => {
    const { data, error, loading, request } = useApiRequest<Area[]>();
    const [idEliminar, setIdEliminar] = useState<number>();
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const getAreas = async () => {
            await request("/api/areas");
        };
        getAreas();
        console.log("data", data);
    }, [request]);

    const eliminarArea = async () => {
        console.log("eliminar area", idEliminar);
        fetch(API_URL + "/api/areas/" + idEliminar, {
            method: "DELETE",
        });
    };

    const confirmarEliminacion = (id: number) => {
        setIdEliminar(id);
        setShowConfirm(true);
    };

    if (loading) return <Spinner size={"large"} />;
    if (error) return <AlertComponent title={error} variant={"destructive"} />;
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data &&
                        data.map((area) => (
                            <TableRow key={area.id}>
                                <TableCell className="font-medium">
                                    {area.nombre}
                                </TableCell>

                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        // onClick={() => eliminarArea(area.id)}
                                    ></Button>
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

                    {!data && (
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
