import { crearListaPostulante } from "@/api/postulantes";
import { AlertComponent } from "@/components/AlertComponent";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import React, { useState } from "react";
import { useParams } from "react-router-dom";

interface CreateListProps {
    number?: number;
    refresh?: () => void;
}

export function CreateList({
    number = 1,
    refresh = () => {},
}: CreateListProps) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [nombre, setNombre] = useState<string>();
    const [loading, setLoading] = useState(false);
    const { ci, olimpiada_id } = useParams();



    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;
        try {
            setLoading(true);
            if (!ci || !olimpiada_id) return;
            await crearListaPostulante({
                ci,
                olimpiada_id,
                nombre_lista: nombre || `Lista ${number}`,
            });

            setSuccess("La lista se creó correctamente.");
            setOpen(false);
            setNombre("");
            refresh();
        } catch (e: unknown) {
            setError(
                e instanceof Error && e.message
                    ? e.message
                    : "No se pudo registrar la lista. Intente nuevamente."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="default" onClick={() => setOpen(true)}>
                        Crear Lista
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={onSubmit}>
                        <DialogHeader>
                            <DialogTitle>Crear Lista</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center gap-4">
                                <Label
                                    htmlFor="name"
                                    className="text-nowrap text-right"
                                >
                                    Nombre de la lista
                                </Label>
                                <Input
                                    id="name"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder={`Lista ${number}`}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Creando..." : "Continuar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            {error && (
                <AlertComponent
                    title="Error"
                    description={error}
                    variant="destructive"
                    onClose={() => setError(null)}
                />
            )}
            {success && (
                <AlertComponent
                    title="Éxito"
                    description={success}
                    variant="default"
                    onClose={() => setSuccess(null)}
                />
            )}
        </>
    );
}
