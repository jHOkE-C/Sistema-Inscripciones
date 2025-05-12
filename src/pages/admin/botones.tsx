import { Button } from "@/components/ui/button";
import {  Users, Link as Asociar, Layers2, Trophy, Clock, FileUp, FileSpreadsheet, Check, UserPlus, ShieldUser, ShieldCheck, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import GestionRegistration from "./RegistrarGestion";
import CrearRol from "./crear-rol/page";

export default function Botones() {
    return (
      <div className="flex flex-col space-y-4 p-6 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grid-">
          <GestionRegistration refresh={() => {}} />

          <Button
            className="h-auto py-10 bg-sky-600 hover:bg-sky-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1"
            asChild
          >
            <Link to="/admin/area/agregar">
              <Layers className="size-8 mb-1" />
              <span className="text-lg font-semibold">Agregar Áreas</span>
            </Link>
          </Button>
          <Button
            className="h-auto py-10 bg-sky-600 hover:bg-sky-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1"
            asChild
          >
            <Link to="/admin/area/dar-de-baja">
              <Layers className="size-8 mb-1" />
              <span className="text-lg font-semibold">Dar de baja Áreas</span>
            </Link>
          </Button>


          <Button
            className="h-auto py-10 bg-amber-600 hover:bg-amber-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1"
            asChild
          >
            <Link to="/admin/categorias/crear">
              <Layers2 className="size-8 mb-1" />
              <span className="text-lg font-semibold">
                Agregar Categorías
              </span>
            </Link>
          </Button>
          <Button
            className="h-auto py-10 bg-amber-600 hover:bg-amber-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1"
            asChild
          >
            <Link to="/admin/categorias/editar">
              <Layers2 className="size-8 mb-1" />
              <span className="text-lg font-semibold">
                Editar Categorías
              </span>
            </Link>
          </Button>
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

          <Button
            className="h-auto py-10 bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="/gestionar-postulantes">
              <Users className="size-8 mb-1" />
              <span className="text-lg font-semibold">
                Gestionar postulantes
              </span>
            </Link>
          </Button>
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
          <Button
            className="h-auto py-10 bg-rose-600 hover:bg-rose-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="/admin/subirExcel">
              <FileUp className="size-8 mb-1" />
              <span className="text-lg font-semibold">Subir Excel</span>
            </Link>
          </Button>

          <Button
            className="h-auto py-10 bg-pink-600 hover:bg-pink-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="fases">
              <Clock className="size-8 mb-1" />
              <span className="text-lg font-semibold">Definir fases</span>
            </Link>
          </Button>
          <Button
            className="h-auto py-10 bg-slate-600 hover:bg-slate-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="/admin/asociarAreas">
              <Asociar className="size-8 mb-1" />
              <span className="text-lg font-semibold">Asociar áreas</span>
            </Link>
          </Button>
          <Button
            className="h-auto py-10 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="/admin/asociarCategorias">
              <Asociar className="size-8 mb-1" />
              <span className="text-lg font-semibold">Asociar Categorías</span>
            </Link>
          </Button>
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
          <Button
            className="h-auto py-10 bg-emerald-400 hover:bg-emerald-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="/admin/area/habilitar">
              <Check className="size-8 mb-1" />
              <span className="text-lg font-semibold">Habilitar un área</span>
            </Link>
          </Button>
          <Button
            className="h-auto py-10 bg-emerald-400 hover:bg-emerald-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="./reportes">
              <Check className="size-8 mb-1" />
              <span className="text-lg font-semibold">Reporte</span>
            </Link>
          </Button>

          <Button
            className="h-auto py-10 bg-indigo-500 hover:bg-indigo-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="./crear">
              <UserPlus className="size-8 mb-1" />
              <span className="text-lg font-semibold">Crear Usuario</span>
            </Link>
          </Button>

          <CrearRol />

          <Button
            className="h-auto py-10 bg-indigo-500 hover:bg-indigo-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="./asignar-roles">
              <ShieldUser className="size-8 mb-1" />
              <span className="text-lg font-semibold">Asignar Roles</span>
            </Link>
          </Button>

          <Button
            className="h-auto py-10 bg-indigo-500 hover:bg-indigo-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
            asChild
          >
            <Link to="./asignar-privilegios">
              <ShieldCheck className="size-8 mb-1" />
              <span className="text-lg font-semibold">Asignar Privilegios</span>
            </Link>
          </Button>
        </div>
      </div>
    );
}
