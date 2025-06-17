"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { formatDate } from "@/models/interfaces/types";
import DatePickerPopover from "@/components/DatePickerPopover";
import ReturnComponent from "@/components/ReturnComponent";
import Loading from "@/components/Loading";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import NotFoundPage from "@/views/404";
import { cn } from "@/lib/utils";
import { useFasesOlimpiada } from "@/viewModels/usarVistaModelo/privilegios/fases/useFasesOlimpiada";

export default function Page() {
    const {
        data,
        loading,
        openAdd,
        setOpenAdd,
        selectedIdFases,
        cronos,
        errors,
        fases,
        onSelectDate,
        onSave,
        toggleTipo,
    } = useFasesOlimpiada();

    if (loading) return <Loading />;
    if (!data) return <NotFoundPage />;

    const { olimpiada } = data;

    return (
        <div className="container mx-auto p-4">
            <ReturnComponent />
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>{olimpiada.nombre}</CardTitle>
                    <CardDescription>
                        Fechas: {formatDate(olimpiada.fecha_inicio)} -{" "}
                        {formatDate(olimpiada.fecha_fin)}
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Fases</h2>
                <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                    <DialogTrigger asChild>
                        <Button>Agregar Fase</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Seleccionar Fases</DialogTitle>
                            <DialogDescription>
                                Selecciona las fases que deseas agregar a la olimpiada.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {fases.map((fase) => (
                                <div key={fase.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={fase.id}
                                        checked={selectedIdFases.includes(fase.id)}
                                        onCheckedChange={() => toggleTipo(fase.id)}
                                    />
                                    <Label htmlFor={fase.id}>{fase.nombre_fase}</Label>
                                </div>
                            ))}
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setOpenAdd(false)}>Cerrar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fase</TableHead>
                        <TableHead>Fecha Inicio</TableHead>
                        <TableHead>Fecha Fin</TableHead>
                        <TableHead>Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cronos.map((crono, index) => (
                        <TableRow key={crono.id}>
                            <TableCell>{crono.fase.nombre_fase}</TableCell>
                            <TableCell>
                                <DatePickerPopover
                                    selectedDate={crono.fecha_inicio ? new Date(crono.fecha_inicio) : null}
                                    onSelect={(date) =>
                                        onSelectDate(date, crono.fase.nombre_fase, "fecha_inicio")
                                    }
                                    className={errors[index]?.start ? "text-red-500" : ""}
                                />
                            </TableCell>
                            <TableCell>
                                <DatePickerPopover
                                    selectedDate={crono.fecha_fin ? new Date(crono.fecha_fin) : null}
                                    onSelect={(date) =>
                                        onSelectDate(date, crono.fase.nombre_fase, "fecha_fin")
                                    }
                                    className={errors[index]?.end ? "text-red-500" : ""}
                                />
                            </TableCell>
                            <TableCell>
                                <Badge
                                    className={cn(
                                        "bg-green-500",
                                        crono.fecha_fin &&
                                            new Date(crono.fecha_fin) < new Date() &&
                                            "bg-red-500"
                                    )}
                                >
                                    {crono.fecha_fin &&
                                        new Date(crono.fecha_fin) < new Date()
                                        ? "Finalizada"
                                        : "Activa"}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex justify-end mt-4">
                <Button onClick={onSave}>Guardar Cambios</Button>
            </div>
        </div>
    );
}
