import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import FormAddArea from "../FormAddArea";
import ListArea from "../ListArea";
import Header from "@/components/Header";
import { rutasAdmin } from "../../rutasAdmin";
import Footer from "@/components/Footer";
import ReturnComponent from "@/components/ReturnComponent";
import { AlertComponent } from "@/components/AlertComponent";
import { useAgregarPageViewModel } from "@/viewModels/usarVistaModelo/privilegios/area/agregar/useAgregarPageViewModel";

export const Page = () => {
  const {
    areas,
    loading,
    error,
    alert,
    setAlert,
    handleAddArea,
    handleDeleteArea,
    request,
  } = useAgregarPageViewModel();

  useEffect(() => {
    request("GET");
  }, [request]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header rutas={rutasAdmin} />
      <ReturnComponent to={`..\\..\\`} />
      <div className="container mx-auto max-w-4xl py-5 space-y-8">
        <Card>
          <CardTitle>
            <h2 className="text-4xl font-bold text-center py-5">
              Agregar Áreas
            </h2>
          </CardTitle>
          <CardDescription className="mx-auto">
            Agrega una nueva area para las olimpiadas Oh!SanSi
          </CardDescription>
          <CardContent>
            <FormAddArea onAdd={handleAddArea} />
            <ListArea
              areas={areas || []}
              loading={loading}
              error={error}
              onDelete={handleDeleteArea}
            />
          </CardContent>
        </Card>
        {alert && <AlertComponent {...alert} onClose={() => setAlert(null)} />}
      </div>
      <Footer />
    </div>
  );
};

export default Page;
