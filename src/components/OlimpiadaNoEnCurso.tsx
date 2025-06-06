import type { Olimpiada } from "@/models/types/versiones.type";
import { Clock } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

const OlimpiadaNoEnCurso = ({
    olimpiada,
    text,
}: {
    olimpiada: Olimpiada;
    text?: string;
}) => {
    return (
        <div className="flex items-center justify-center min-h-screen  w-screen">
            <Card className="w-xl">
                <CardHeader>
                    <CardTitle>
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                            {olimpiada.nombre}
                        </h2>
                    </CardTitle>
                    <CardDescription>
                        <p className="text-xl text-foreground/60">
                            {text
                                ? text
                                : "No se están aceptando inscripciones en este momento"}
                        </p>
                        <div className="mt-6 flex justify-center">
                            <Clock className="w-24 h-24 text-foreground/80" />
                        </div>
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
};

export default OlimpiadaNoEnCurso;
