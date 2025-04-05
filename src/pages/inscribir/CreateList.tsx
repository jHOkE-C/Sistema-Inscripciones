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
import { crearListaPostulante } from "@/utils/apiUtils";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

interface CreateListProps {
    number?: number;
}

export function CreateList({ number = 1 }: CreateListProps) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [nombre, setNombre] = useState<string>();
    const {uuid} = useParams()
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if(!uuid) return;
            await crearListaPostulante({uuid,  nombre: nombre || `Lista ${number}` });
            setSuccess("La lista se creó correctamente.");
            setOpen(false);
        } catch (e: unknown) {
            setError(
                e instanceof Error && e.message
                    ? e.message
                    : "No se pudo registrar la lista. Intente nuevamente."
            );
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setOpen(true)}>
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
                            <Button type="submit">Continuar</Button>
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
