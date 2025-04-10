import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";

export const Page = () => {
    return (
      <>
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
          <div className="w-4/5 mx-auto mt-10">
              <Card>
                  <CardTitle>
                      <h1 className="text-4xl font-bold text-center py-5">
                          Gestión de Áreas
                      </h1>
                  </CardTitle>
                  <CardDescription className="mx-auto">
                      Gestiona las áreas para las olimpiadas
                  </CardDescription>
                  <CardContent>
                      <div className="w-full flex justify-around">
                          <Link to={"/admin/area/agregar"}>
                              <Button
                                  variant={"outline"}
                                  className="flex flex-col h-auto"
                              >
                                  <div className="bg-black rounded-full text-white p-2">
                                      <Plus className="size-" />
                                  </div>
                                  Agregar un Área
                              </Button>
                          </Link>
                          <Link to={"/admin/area/dar-de-baja"}>
                              <Button
                                  variant={"outline"}
                                  className="flex flex-col h-auto"
                              >
                                  <Trash2 className="size-10" />
                                  Dar de baja un Área
                              </Button>
                          </Link>
                      </div>
                  </CardContent>
              </Card>
              
          </div>
      </>
  );
};

export default Page;