import { Button } from "@/components/ui/button";
import {
  Link as Asociar,
  Layers2,
  Trophy,
  Clock,
  FileUp,
  FileSpreadsheet,
  Check,
  UserPlus,
  ShieldUser,
  ShieldCheck,
  Layers,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import GestionRegistration from "./RegistrarGestion";
import CrearRol from "./crear-rol/page";
import { useAuth } from "@/hooks/auth";

export default function Botones() {
  const { user } = useAuth();
  const accesos = user?.accesos;
  console.log(accesos);

  function hasAccess(rol: string) {
    if (accesos) {
      return accesos.some((acceso: string) => acceso === rol);
    }
    return false;
  }
  return (
    <div className="flex flex-col space-y-4 p-6 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grid-">
        {hasAccess("crear olimpiada") && (
          <GestionRegistration refresh={() => {}} />
        )}
        {hasAccess("agregar un área") && (
          <Button
            className="h-auto py-10 bg-sky-600 hover:bg-sky-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1"
            asChild
          >
            <Link to="/admin/area/agregar">
              <Layers className="size-8 mb-1" />
              <span className="text-lg font-semibold">Agregar Áreas</span>
            </Link>
          </Button>
        )}

        {hasAccess("dar de baja una área") && (
          <Button
            className="h-auto py-10 bg-sky-600 hover:bg-sky-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1"
            asChild
          >
            <Link to="/admin/area/dar-de-baja">
              <Layers className="size-8 mb-1" />
              <span className="text-lg font-semibold">Dar de baja Áreas</span>
            </Link>
          </Button>
        )}

        {hasAccess("agregar una categoría") && (
          <Button
            className="h-auto py-10 bg-amber-600 hover:bg-amber-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1"
            asChild
          >
            <Link to="/admin/categorias/crear">
              <Layers2 className="size-8 mb-1" />
              <span className="text-lg font-semibold">Agregar Categorías</span>
            </Link>
          </Button>
        )}

        {hasAccess("editar categoría") && (
          <Button
            className="h-auto py-10 bg-amber-600 hover:bg-amber-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1"
            asChild
          >
            <Link to="/admin/categorias/editar">
              <Layers2 className="size-8 mb-1" />
              <span className="text-lg font-semibold">Editar Categorías</span>
            </Link>
          </Button>
        )}

        {hasAccess("dar de baja una categoría") && (
          <Button
            className="h-auto py-10 bg-amber-600 hover:bg-amber-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1"
            asChild
          >
            <Link to="/admin/categorias/dar-de-baja">
              <Layers2 className="size-8 mb-1" />
              <span className="text-lg font-semibold">
                Dar de baja Categorías
              </span>
            </Link>
          </Button>
        )}
        {hasAccess("generara plantilla de excel") && (
          <Button
            className="h-auto py-10 bg-green-600 hover:bg-green-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="generarExcel">
              <FileSpreadsheet className="size-8 mb-1" />
              <span className="text-lg font-semibold">
                Generar Plantilla de Excel
              </span>
            </Link>
          </Button>
        )}

        {hasAccess("subir excel para olimpiada") && (
          <Button
            className="h-auto py-10 bg-rose-600 hover:bg-rose-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="/admin/subirExcel">
              <FileUp className="size-8 mb-1" />
              <span className="text-lg font-semibold">Subir Excel</span>
            </Link>
          </Button>
        )}

        {hasAccess("definir fases de una olimpiada") && (
          <Button
            className="h-auto py-10 bg-pink-600 hover:bg-pink-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="fases">
              <Clock className="size-8 mb-1" />
              <span className="text-lg font-semibold">Definir fases</span>
            </Link>
          </Button>
        )}

        {hasAccess("asociar áreas a una olimpiada") && (
          <Button
            className="h-auto py-10 bg-slate-600 hover:bg-slate-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="/admin/asociarAreas">
              <Asociar className="size-8 mb-1" />
              <span className="text-lg font-semibold">Asociar áreas</span>
            </Link>
          </Button>
        )}

        {hasAccess("asociar categorías a un área") && (
          <Button
            className="h-auto py-10 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="/admin/asociarCategorias">
              <Asociar className="size-8 mb-1" />
              <span className="text-lg font-semibold">Asociar Categorías</span>
            </Link>
          </Button>
        )}

        {hasAccess("ver versiones de olimpiada") && (
          <Button
            className="h-auto py-10 bg-lime-600 hover:bg-lime-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="version">
              <Trophy className="size-8 mb-1" />
              <span className="text-lg font-semibold">
                Versiones de Olimpiada
              </span>
            </Link>
          </Button>
        )}

        {hasAccess("habilitar un área") && (
          <Button
            className="h-auto py-10 bg-emerald-400 hover:bg-emerald-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="/admin/area/habilitar">
              <Check className="size-8 mb-1" />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-semibold">Habilitar un Área</span>
                <span className="text-lg font-semibold">dada de baja</span>
              </div>
            </Link>
          </Button>
        )}

        {hasAccess("generar reporte de inscripción") && (
          <Button
            className="h-auto py-10 bg-amber-500 hover:bg-amber-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="./reportes">
              <User className="size-8 mb-1" />
              <span className="text-lg font-semibold">
                Reportes de inscripciones
              </span>
            </Link>
          </Button>
        )}

        {hasAccess("crear usuarios") && (
          <Button
            className="h-auto py-10 bg-indigo-500 hover:bg-indigo-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="./crear">
              <UserPlus className="size-8 mb-1" />
              <span className="text-lg font-semibold">Crear Usuario</span>
            </Link>
          </Button>
        )}

        {hasAccess("crear un rol") && <CrearRol />}

        {hasAccess("asignar roles a un usuario") && (
          <Button
            className="h-auto py-10 bg-indigo-500 hover:bg-indigo-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="./asignar-roles">
              <ShieldUser className="size-8 mb-1" />
              <span className="text-lg font-semibold">Asignar Roles</span>
            </Link>
          </Button>
        )}

        {hasAccess("asignar privilegios a roles") && (
          <Button
            className="h-auto py-10 bg-indigo-500 hover:bg-indigo-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="./asignar-privilegios">
              <ShieldCheck className="size-8 mb-1" />
              <span className="text-lg font-semibold">Asignar Privilegios</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
