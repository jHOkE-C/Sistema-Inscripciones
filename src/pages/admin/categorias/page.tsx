import { Button } from "@/components/ui/button";
import { Building2, ChevronLeft, Edit, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Toaster } from "sonner";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-4 px-4 max-w-6xl mx-auto">
        <Link to="/admin">
          <Button variant="ghost" className="flex items-center gap-2 mb-6">
            <ChevronLeft className="h-5 w-5" />
            Volver
          </Button>
        </Link>

        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold mb-2">Gestión de Categorías</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Administra las categorías de la olimpiada de manera eficiente:
            crea, edita o desactiva áreas según tus necesidades.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Agregar */}
          <Card className="shadow-lg hover:shadow-2xl transform hover:scale-101 transition hover:border-primary">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <PlusCircle className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl font-semibold">Agregar</CardTitle>
              </div>
              <CardDescription>Crea una nueva categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Define y añade nuevas áreas de competencia para organizar
                las diferentes disciplinas de la olimpiada.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/categorias/crear" className="w-full">
                <Button className="w-full">Ir a Agregar Área</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Editar */}
          <Card className="shadow-lg hover:shadow-2xl transform hover:scale-101 transition hover:border-amber-600">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Edit className="h-6 w-6 text-amber-600" />
                <CardTitle className="text-xl font-semibold">Editar</CardTitle>
              </div>
              <CardDescription>Modifica las categorías existentes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Actualiza nombres, descripciones o atributos de las
                categorías activas en tu plataforma.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/categorias/editar" className="w-full">
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  Ir a Editar Área
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Dar de baja */}
          {/* <Card className="shadow-lg hover:shadow-2xl transform hover:scale-105 transition">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Trash2 className="h-8 w-8 text-red-600" />
                <CardTitle className="text-xl font-semibold">Dar de baja</CardTitle>
              </div>
              <CardDescription>Desactiva una categoría obsoleta</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Marca categorías que ya no sean necesarias para que no aparezcan
                en futuras convocatorias.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/categorias/dar-de-baja" className="w-full">
                <Button variant="outline" className="w-full text-red-600 border-red-400">
                  Ir a Dar de Baja Área
                </Button>
              </Link>
            </CardFooter>
          </Card> */}
        </div>
      </div>

    </div>
  );
}
