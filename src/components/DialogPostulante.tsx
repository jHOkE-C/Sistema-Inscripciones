/// Corregir las areas con el grado
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

import { Plus } from "lucide-react";

import FormPostulante, { type postulanteSchema } from "./FormPostulante";
import type { z } from "zod";
interface DialogProps {
    getParams?: boolean;
    onSubmit: (data: z.infer<typeof postulanteSchema>) => void;
}

const DialogPostulante = ({ onSubmit = () => {} }: DialogProps) => {
    const [showForm, setShowForm] = useState(false);


    return (
        <>
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2" />
                        Agregar Postulante
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] max-h-[calc(100vh-100px)] overflow-y-auto ">
                    <DialogHeader>
                        <DialogTitle>Agregar Nuevo Postulante</DialogTitle>
                        <DialogDescription>
                            Ingresa los datos del nuevo postulante para las
                            olimpiadas ohSansi
                        </DialogDescription>
                    </DialogHeader>
                    <FormPostulante
                        onSubmit={(data) => {
                            onSubmit(data);
                            setShowForm(false);
                        }}
                        onCancel={() => setShowForm(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DialogPostulante;
