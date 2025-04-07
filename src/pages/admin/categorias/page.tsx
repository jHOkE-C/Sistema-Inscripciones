import { Suspense } from "react";
import Gestionador from "./getionador";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Page() {
  return (
    <div>
      <div className="pt-4 px-4">
        <Link to="/admin">
          <Button
            variant="ghost"
            className="flex items-center gap-1 mb-4"
          >
            <ChevronLeft className="h" />
            Volver
          </Button>
        </Link>
      </div>
      <main className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">Gestionar Categorías</h1>
        <Suspense fallback={<div>Cargando...</div>}></Suspense>
        <Gestionador />
      </main>
    </div>
  );
}
