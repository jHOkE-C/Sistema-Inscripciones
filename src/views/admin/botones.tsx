"use client";

import { Button } from "@/components/ui/button";
import {
  Layers2,
  Trophy,
  Clock,
  ShieldIcon as ShieldUser,
  ShieldCheck,
  Layers,
  User,
  CheckCircle,
  XCircle,
  PenBoxIcon,
  LinkIcon,
  LibraryBigIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import GestionRegistration from "./RegistrarGestion";
import CrearRol from "./crear-rol/page";
import HelpTooltip from "@/components/help-tooltip";
import { useBotonesViewModel } from "@/viewModels/admin/useBotonesViewModel";

export default function Botones() {
  const { hasAccess } = useBotonesViewModel();

  return (
    <div className="flex flex-col space-y-4 p-6 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:grid-cols-4">
        {hasAccess("crear olimpiada") && (
          <div className="relative">
            <GestionRegistration refresh={() => {}} />
            <div className="absolute top-2 right-2">
              <HelpTooltip
                title="Crear Olimpiada"
                content="Permite crear una nueva olimpiada definiendo su nombre, descripción, fechas de inicio y fin, y configuraciones básicas del evento."
                position="left"
                size="sm"
              />
            </div>
          </div>
        )}

        {hasAccess("agregar un área") && (
          <div className="relative">
            <Button
              className="h-auto py-10 bg-sky-600 hover:bg-sky-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1 w-full"
              asChild
            >
              <Link to="/admin/area/agregar">
                <Layers className="size-8 mb-1" />
                <span className="text-lg font-semibold">Agregar Áreas</span>
              </Link>
            </Button>
            <div className="absolute top-2 right-2">
              <HelpTooltip
                title="Agregar Áreas"
                content="Crea nuevas áreas de conocimiento para la olimpiada, como Matemáticas, Física, Química, etc. Cada área puede tener múltiples categorías."
                position="left"
                size="sm"
              />
            </div>
          </div>
        )}

        {hasAccess("dar de baja una área") && (
          <div className="relative">
            <Button
              className="h-auto py-10 bg-sky-600 hover:bg-sky-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1 w-full"
              asChild
            >
              <Link to="/admin/area/dar-de-baja">
                <XCircle className="size-8 mb-1" />
                <span className="text-lg font-semibold">Dar de baja Áreas</span>
              </Link>
            </Button>
            <div className="absolute top-2 right-2">
              <HelpTooltip
                title="Dar de Baja Áreas"
                content="Desactiva temporalmente un área existente. El área no será visible para nuevas inscripciones pero mantendrá los datos históricos."
                position="left"
                size="sm"
              />
            </div>
          </div>
        )}

        {hasAccess("habilitar un área") && (
          <div className="relative">
            <Button
              className="h-auto py-10 bg-sky-600 hover:bg-sky-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1 w-full text-lg"
              asChild
            >
              <Link to="/admin/area/habilitar">
                <CheckCircle className="size-8 mb-1" />
                Habilitar un Área
              </Link>
            </Button>
            <div className="absolute top-2 right-2">
              <HelpTooltip
                title="Habilitar Área"
                content="Reactiva un área que fue previamente dada de baja, permitiendo que vuelva a estar disponible para inscripciones y gestión."
                position="left"
                size="sm"
              />
            </div>
          </div>
        )}

        {hasAccess("agregar una categoría") && (
          <div className="relative">
            <Button
              className="h-auto py-10 bg-amber-600 hover:bg-amber-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1 w-full"
              asChild
            >
              <Link to="/admin/categorias/crear">
                <Layers2 className="size-8 mb-1" />
                <span className="text-lg font-semibold">
                  Agregar Categorías
                </span>
              </Link>
            </Button>
            <div className="absolute top-2 right-2">
              <HelpTooltip
                title="Agregar Categorías"
                content="Crea nuevas categorías dentro de las áreas, como diferentes niveles educativos (Primaria, Secundaria, Universitario) o tipos de competencia."
                position="left"
                size="sm"
              />
            </div>
          </div>
        )}

        {hasAccess("editar categoría") && (
          <div className="relative">
            <Button
              className="h-auto py-10 bg-amber-600 hover:bg-amber-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1 w-full"
              asChild
            >
              <Link to="/admin/categorias/editar">
                <PenBoxIcon className="size-8 mb-1" />
                <span className="text-lg font-semibold">Editar Categorías</span>
              </Link>
            </Button>
            <div className="absolute top-2 right-2">
              <HelpTooltip
                title="Editar Categorías"
                content="Modifica la información de categorías existentes, como nombre, descripción, requisitos o configuraciones específicas."
                position="left"
                size="sm"
              />
            </div>
          </div>
        )}

        {hasAccess("dar de baja una categoría") && (
          <div className="relative">
            <Button
              className="h-auto py-10 bg-amber-600 hover:bg-amber-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1 w-full"
              asChild
            >
              <Link to="/admin/categorias/dar-de-baja">
                <XCircle className="size-8 mb-1" />
                <span className="text-lg font-semibold">
                  Dar de baja Categorías
                </span>
              </Link>
            </Button>
            <div className="absolute top-2 right-2">
              <HelpTooltip
                title="Dar de Baja Categorías"
                content="Desactiva temporalmente una categoría. Los participantes ya inscritos mantienen su registro, pero no se permiten nuevas inscripciones."
                position="left"
                size="sm"
              />
            </div>
          </div>
        )}

        {hasAccess("definir fases de una olimpiada") && (
          <div className="relative">
            <Button
              className="h-auto py-10 bg-pink-600 hover:bg-pink-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1 w-full"
              asChild
            >
              <Link to="fases">
                <Clock className="size-8 mb-1" />
                <span className="text-lg font-semibold">Definir fases</span>
              </Link>
            </Button>
            <div className="absolute top-2 right-2">
              <HelpTooltip
                title="Definir Fases"
                content="Establece las diferentes etapas de la olimpiada (inscripción, clasificatoria, semifinal, final) con sus fechas y configuraciones específicas."
                position="left"
                size="sm"
              />
            </div>
          </div>
        )}

        {hasAccess("asociar áreas a una olimpiada") && (
          <div className="relative">
            <Button
              className="h-auto py-10 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1 w-full"
              asChild
            >
              <Link to="/admin/asociarAreas">
                <LinkIcon className="size-8 mb-1" />
                <span className="text-lg font-semibold">Asociar Áreas</span>
              </Link>
            </Button>
            <div className="absolute top-2 right-2">
              <HelpTooltip
                title="Asociar Áreas"
                content="Vincula las áreas de conocimiento disponibles con una olimpiada específica, definiendo qué materias estarán disponibles para la competencia."
                position="left"
                size="sm"
              />
            </div>
          </div>
        )}

        {hasAccess("asociar categorías a un área") && (
          <div className="relative">
            <Button
              className="h-auto py-10 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1 w-full"
              asChild
            >
              <Link to="/admin/asociarCategorias">
                <LibraryBigIcon  className="size-8 mb-1" />
                <span className="text-lg font-semibold">
                  Asociar Categorías
                </span>
              </Link>
            </Button>
            <div className="absolute top-2 right-2">
              <HelpTooltip
                title="Asociar Categorías"
                content="Vincula categorías específicas con las áreas correspondientes, estableciendo la estructura de competencia por niveles o tipos."
                position="left"
                size="sm"
              />
            </div>
          </div>
        )}

        {hasAccess("ver versiones de olimpiada") && (
          <div className="relative">
            <Button
              className="h-auto py-10 bg-lime-600 hover:bg-lime-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1 w-full"
              asChild
            >
              <Link to="version">
                <Trophy className="size-8 mb-1" />
                <span className="text-lg font-semibold">
                  Versiones de Olimpiada
                </span>
              </Link>
            </Button>
            <div className="absolute top-2 right-2">
              <HelpTooltip
                title="Versiones de Olimpiada"
                content="Consulta el historial de todas las ediciones de olimpiadas realizadas, con estadísticas y datos de participación de cada versión."
                position="left"
                size="sm"
              />
            </div>
          </div>
        )}

        {hasAccess("generar reporte de inscripción") && (
          <div className="relative">
            <Button
              className="h-auto py-10 bg-amber-500 hover:bg-amber-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1 w-full"
              asChild
            >
              <Link to="./reportes">
                <User className="size-8 mb-1" />
                <span className="text-lg font-semibold">
                  Reportes de inscripciones
                </span>
              </Link>
            </Button>
            <div className="absolute top-2 right-2">
              <HelpTooltip
                title="Reportes de Inscripciones"
                content="Genera reportes detallados de las inscripciones por área, categoría, institución o fecha. Incluye estadísticas y datos exportables."
                position="left"
                size="sm"
              />
            </div>
          </div>
        )}
        {hasAccess("crear usuarios") && (
          <div className="relative">
            <Button
              className="h-auto py-10 bg-indigo-500 hover:bg-indigo-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1 w-full"
              asChild
            >
              <Link to="./crear">
                <ShieldCheck className="size-8 mb-1" />
                <span className="text-lg font-semibold">
                  Crear Usuario
                </span>
              </Link>
            </Button>
            <div className="absolute top-2 right-2">
              <HelpTooltip
                title="Crear Usuario"
                content="Crear nuevos usuarios para el sistema, con sus respectivas credenciales."
                position="left"
                size="sm"
              />
            </div>
          </div>
        )}
        {hasAccess("crear usuarios") && (
          <div className="relative">
            <Button
              className="h-auto py-10 bg-indigo-500 hover:bg-indigo-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1 w-full"
              asChild
            >
              <Link to="./asignar-roles">
                <ShieldUser className="size-8 mb-1" />
                <span className="text-lg font-semibold">Asignar Roles</span>
              </Link>
            </Button>
            <div className="absolute top-2 right-2">
              <HelpTooltip
                title="Asignar Roles"
                content="Asigna uno o múltiples roles a usuarios específicos, determinando qué funciones y secciones del sistema pueden acceder."
                position="left"
                size="sm"
              />
            </div>
          </div>
        )}

        {hasAccess("crear un rol") && (
          <div className="relative">
            <CrearRol />
            <div className="absolute top-2 right-2">
              <HelpTooltip
                title="Crear Olimpiada"
                content="Permite crear una nueva olimpiada definiendo su nombre, descripción, fechas de inicio y fin, y configuraciones básicas del evento."
                position="left"
                size="sm"
              />
            </div>
          </div>
        )}

        {hasAccess("asignar roles a un usuario") && (
          <div className="relative">
            <Button
              className="h-auto py-10 bg-indigo-500 hover:bg-indigo-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1 w-full"
              asChild
            >
              <Link to="./asignar-roles">
                <ShieldUser className="size-8 mb-1" />
                <span className="text-lg font-semibold">Asignar Roles</span>
              </Link>
            </Button>
            <div className="absolute top-2 right-2">
              <HelpTooltip
                title="Asignar Roles"
                content="Asigna uno o múltiples roles a usuarios específicos, determinando qué funciones y secciones del sistema pueden acceder."
                position="left"
                size="sm"
              />
            </div>
          </div>
        )}

        {hasAccess("asignar privilegios a roles") && (
          <div className="relative">
            <Button
              className="h-auto py-10 bg-indigo-500 hover:bg-indigo-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1 w-full"
              asChild
            >
              <Link to="./asignar-privilegios">
                <ShieldCheck className="size-8 mb-1" />
                <span className="text-lg font-semibold">
                  Asignar Privilegios
                </span>
              </Link>
            </Button>
            <div className="absolute top-2 right-2">
              <HelpTooltip
                title="Asignar Privilegios"
                content="Define qué permisos específicos tiene cada rol, controlando el acceso a funciones como crear, editar, eliminar o ver diferentes secciones."
                position="left"
                size="sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
