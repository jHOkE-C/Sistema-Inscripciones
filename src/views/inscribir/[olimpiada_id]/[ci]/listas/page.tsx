import Footer from "@/components/Footer";
import ReturnComponent from "@/components/ReturnComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ShareUrl from "@/views/inscribir/ShareUrl";
import { DataTable } from "@/views/inscribir/TableList";
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
    columnsWithActions
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
    <div className="flex flex-col min-h-screen items-center">
      <Header />
      <div className="flex flex-col  justify-center w-full p-4 max-w-7xl">
        <div className=" w-full mb-2">
          <ReturnComponent />
        </div>
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
      <Footer />
    </div>
  );
};

export default Page;
