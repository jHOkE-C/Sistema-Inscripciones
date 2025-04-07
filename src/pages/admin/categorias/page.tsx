import { Suspense } from "react";
import Gestionador from "./getionador";

export default function Page() {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Gestionar Categorías</h1>
      <Suspense fallback={<div>Cargando...</div>}></Suspense>
      <Gestionador />
    </main>
  );
}
