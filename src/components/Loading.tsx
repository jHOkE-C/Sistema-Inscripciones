import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center  flex-col space-y-3">
         
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <h1 className="text-3xl font-bold text-primary">Cargando...</h1>
        </div>
    );
}
