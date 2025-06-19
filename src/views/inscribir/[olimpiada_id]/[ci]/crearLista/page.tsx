import Footer from "@/components/Footer";
import ReturnComponent from "@/components/ReturnComponent";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import ShareUrl from "@/views/inscribir/compartir";
import { DataTable } from "@/views/inscribir/listaTabla";
import NotFoundPage from "@/views/404";
import Loading from "@/components/Loading";
import FormResponsable from "@/views/inscribir/FormResponsable";
import { Button } from "@/components/ui/button";
import { usarCrearListaViewModel } from "@/viewModels/usarVistaModelo/inscribir/olimpiada/crearLista/usarCrearListaViewModel";

const Page = () => {
  const {
    data,
    openFormResponsable,
    setOpenFormResponsable,
    loading,
    isValidCI,
    columnsWithActions,
    crearLista,
  } = usarCrearListaViewModel();

  if (!isValidCI) {
    return <NotFoundPage />;
  }

  if (loading) return <Loading />;
  if (openFormResponsable)
    return (
      <FormResponsable
        onClose={() => {
          setOpenFormResponsable(false);
        }}
      />
    );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-2">
        <ReturnComponent />
      </div>
      <div className="m py-5">
        <div className="container mx-auto ">
          <Card className="border-0 shadow-white">
            <CardTitle>
              <h2 className="text-3xl font-bold text-center">
                Listas de Postulantes
              </h2>
            </CardTitle>
            <CardContent className="space-y-5 justify-between">
              <div className="flex gap-2 items-center justify-end">
                <Button onClick={crearLista}>Crear Lista</Button>
              </div>
              <DataTable columns={columnsWithActions} data={data} />
            </CardContent>
          </Card>
        </div>
        <ShareUrl />
      </div>

      <Footer />
    </div>
  );
};

export default Page;
