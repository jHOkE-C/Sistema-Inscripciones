import { Button } from "@/components/ui/button";
import {  Layers, Users, Link as Asociar, Layers2 } from "lucide-react";
import { Link } from "react-router-dom";
import GestionRegistration from "./RegistrarGestion";

export default function Botones({ getData }: { getData: () => void }) {
  return (
    <div className="flex flex-col space-y-4 p-6 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <GestionRegistration refresh={getData} />

        <Button
          className="h-auto py-6 bg-sky-600 hover:bg-sky-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
          asChild
        >
          <Link to="/admin/area">
            <Layers className="h-8 w-8 mb-1" />
            <span className="text-lg font-medium">Gestionar áreas</span>
          </Link>
        </Button>

        <Button
          className="h-auto py-6 bg-amber-600 hover:bg-amber-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
          asChild
        >
          <Link to="/admin/categorias">
            <Layers2 className="h-8 w-8 mb-1" />
            <span className="text-lg font-medium">Gestionar categorías</span>
          </Link>
        </Button>

        <Button
          className="h-auto py-6 bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg md:col-span-2 lg:col-span-1"
          asChild
        >
          <Link to="/gestionar-postulantes">
            <Users className="h-8 w-8 mb-1" />
            <span className="text-lg font-medium">Gestionar postulantes</span>
          </Link>
        </Button>

        <Button
          className="h-auto py-6 bg-rose-600 hover:bg-rose-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg md:col-span-2 lg:col-span-2"
          asChild
        >
          <Link to="/admin/asociar">
            <Asociar className="h-8 w-8 mb-1" />
            <span className="text-lg font-medium">
              Asociar áreas con categorías
            </span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
