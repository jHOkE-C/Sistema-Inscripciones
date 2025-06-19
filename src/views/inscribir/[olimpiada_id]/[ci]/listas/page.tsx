import Footer from "@/components/Footer";
import ReturnComponent from "@/components/ReturnComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ShareUrl from "@/views/inscribir/compartir";
import { DataTable } from "@/views/inscribir/listaTabla";
import NotFoundPage from "@/views/404";
import Loading from "@/components/Loading";
import Header from "@/components/Header";
import FormResponsable from "@/views/inscribir/FormResponsable";
import { useListasPageViewModel } from "@/viewModels/usarVistaModelo/inscribir/olimpiada/listas/usarListasPageViewModel";

const Page = () => {
  const {
    data,
    openFormResponsable,
    setOpenFormResponsable,
    loading,
    isValidCI,
    columnsWithActions,
  } = useListasPageViewModel();

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
    <>
      <Header />
      <ReturnComponent />
      <div className="flex flex-col items-center justify-center w-full pt-4">
        <div className="flex flex-col min-h-screen w-5/6">
          <Card className="border-0 shadow-white w-full ">
            <CardHeader>
              <CardTitle>
                <h2 className="text-3xl font-bold text-center">
                  Inscripciones de Postulantes
                </h2>
              </CardTitle>
              <CardDescription className="text-center">
                Selecciona una inscripcion para inscribir postulantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 justify-between">
              <DataTable goToCode columns={columnsWithActions} data={data} />
            </CardContent>
          </Card>
          <ShareUrl />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page;
