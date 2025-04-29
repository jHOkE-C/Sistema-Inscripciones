import { Building2, ChevronLeft, PlusCircle, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Page = () => {
  return (
    <>
      <div className="pt-4 px-4">
        <Link to="/admin">
          <Button variant="ghost" className="flex items-center gap-1 mb-4">
            <ChevronLeft className="h" />
            Volver
          </Button>
        </Link>
      </div>
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <Building2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Gestión de Áreas
          </h1>
          <p className="text-muted-foreground max-w-md">
            Administre las áreas de la olimpiada de manera eficiente. Agregue
            nuevas áreas para las competencias o desactive las que ya no sean
            necesarias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" />
                Agregar Área
              </CardTitle>
              <CardDescription>
                Cree una nueva área para su organización
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Defina y cree nuevas áreas de competencia para organizar, planificar y gestionar de manera más eficiente las diferentes disciplinas y actividades de la olimpiada.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/area/agregar" className="w-full">
                <Button className="w-full">Ir a Agregar Área</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-2 border-destructive/10 hover:border-destructive/30 transition-all duration-300 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                Dar de Baja un Área
              </CardTitle>
              <CardDescription>
                Desactive áreas que ya no son necesarias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Desactive áreas de competencias que ya no sean relevantes o que
                hayan sido reemplazadas por nuevas disciplinas en la olimpiada.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/admin/area/dar-de-baja" className="w-full">
                <Button
                  className="w-full  bg-red-600 hover:bg-red-700"
                >
                  Ir a Dar de Baja Área
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Page;
