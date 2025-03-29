import { Button } from "@/components/ui/button";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useApiRequest } from "@/hooks/useApiRequest";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
export interface Area {
    id: number;
    nombre: string;
}
const ListArea = () => {
    const { data, error, loading, request } = useApiRequest<Area[]>();

    useEffect(() => {
        const getAreas = async () => {
            await request("/api/areas");
        };
        getAreas();
    }, [request]);

    if (loading) return <p>Loading</p>;
    if (error) return <p>Error: {error}</p>;
    if (!data) return <p>No hay datos disponibles</p>;
    
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
                    {data.map((area) => (
                        <TableRow key={area.id}>
                            <TableCell className="font-medium">
                                {area.nombre}
                            </TableCell>

                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    // onClick={() => eliminarArea(area.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}

                    {data.length === 0 && (
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
        </>
    );
};

export default ListArea;
