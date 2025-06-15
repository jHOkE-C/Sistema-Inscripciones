import { Button } from "@/components/ui/button";
import { Building2,  Edit, PlusCircle, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import ReturnComponent from "@/components/ReturnComponent";

export default function Page() {
  return (
    <>
    <ReturnComponent  />
    <div className="min-h-screen bg-background">
      <div className=" px-4 max-w-6xl mx-auto">

        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-4xl font-extrabold mb-2">Gestión de Categorías</h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Administra las categorías de la olimpiada de manera eficiente:
            crea, edita o desactiva categoria según tus necesidades.
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
              <CardDescription>Agrega una nueva categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/50">
                Define y añade nuevas áreas de competencia para organizar
                las diferentes disciplinas de la olimpiada.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/categorias/crear" className="w-full">
                <Button className="w-full">Ir a Agregar Categoria</Button>
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
              <p className="text-sm text-foreground/50">
                Actualiza nombres, descripciones o atributos de las
                categorías activas en tu plataforma.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/categorias/editar" className="w-full">
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  Ir a Editar Categoria
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card className="shadow-lg hover:shadow-2xl transform hover:scale-101 transition hover:border-red-600">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Trash2 className="h-6 w-6 text-red-600" />
                <CardTitle className="text-xl font-semibold">Dar de Baja</CardTitle>
              </div>
              <CardDescription>Desactiva una categoría obsoleta</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/50">
              Marca categorías que ya no sean necesarias para que no aparezcan
              en futuras convocatorias.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/categorias/dar-de-baja" className="w-full">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                Ir a Dar de Baja Área
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

    </div>
    </>
  );
}
