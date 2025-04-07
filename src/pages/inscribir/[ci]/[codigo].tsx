import { useEffect, useState } from "react";
import FormPostulante, { grados } from "../FormPostulante";
import { inscripciones, type Lista } from "./columns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
    const [data, setData] = useState<Lista[]>([]);

    useEffect(() => {
        setData(inscripciones);
    }, []);

    return (
        <div className="min-h-screen py-10">
                <div className="container mx-auto ">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Listado de Postulantes
                    </CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto space-y-5">
                    <FormPostulante />
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombres</TableHead>
                                <TableHead>Apellidos</TableHead>
                                <TableHead>CI</TableHead>
                                <TableHead>Area</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Curso</TableHead>
                                <TableHead>Email</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data[0]?.inscripciones.map((inscripcion) => (
                                <TableRow key={inscripcion.id}>
                                    <TableCell>
                                        {inscripcion.postulante.nombres}
                                    </TableCell>
                                    <TableCell>
                                        {inscripcion.postulante.apellidos}
                                    </TableCell>
                                    <TableCell>
                                        {inscripcion.postulante.ci}
                                    </TableCell>
                                    <TableCell>{inscripcion.area_id}</TableCell>
                                    <TableCell>
                                        {inscripcion.categoria_id}
                                    </TableCell>
                                    <TableCell>
                                        {
                                            grados.find(
                                                ({ id }) =>
                                                    id ==
                                                    inscripcion.postulante.curso
                                            )?.nombre
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {inscripcion.postulante.email}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            </div>
        </div>
    );
}
