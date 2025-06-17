import FormResponsable from "../../FormResponsable";
import NotFoundPage from "../../../404";
import Loading from "@/components/Loading";
import ReturnComponent from "@/components/ReturnComponent";
import Footer from "@/components/Footer";
import ButtonsGrid from "@/components/ButtonsGrid";
import InscribirPostulante from "../../../../components/InscribirPostulante";
import ShareUrl from "../../ShareUrl";
import OlimpiadaNoEnCurso from "@/components/OlimpiadaNoEnCurso";
import InscribirExcel from "@/components/InscribirExcel";
import Header from "@/components/Header";
import Pasos from "./pasos";
import { usePageViewModel } from "@/viewModels/usarVistaModelo/inscribir/olimpiada/usarPageViewModel";

const Page = () => {
  const {
    openFormResponsable,
    setOpenFormResponsable,
    loading,
    olimpiada,
    olimpiadaLoading,
    buttons,
    isValidCI,
    isInscripcionPhase,
    fetchData
  } = usePageViewModel();

  if (!isValidCI) {
    return <NotFoundPage />;
  }
  if (olimpiadaLoading) return <Loading />;
  if (loading) return <Loading />;
  if (openFormResponsable)
    return (
      <FormResponsable
        onClose={() => {
          setOpenFormResponsable(false);
        }}
      />
    );
  if (!olimpiada) return <NotFoundPage />;
  if (!isInscripcionPhase) {
    return <OlimpiadaNoEnCurso olimpiada={olimpiada} />;
  }

  return (
    <div className="flex flex-col min-h-screen items-center">
      <Header />
      
      <div className="flex flex-col items-center justify-center w-full p-4 max-w-6xl">
        <div className=" w-full">
          <ReturnComponent to="/" />
        </div>

        <h2 className="text-3xl font-bold text-center">
          Bienvenido a la Olimpiada {olimpiada?.nombre}
        </h2>
        <Pasos />
        <div className="w-full p-4  mx-auto my-auto gap-3 flex flex-col">
          <ButtonsGrid buttons={buttons}>
            <InscribirPostulante olimpiada={olimpiada} />
            <InscribirExcel
              olimpiada={olimpiada}
              onSubmit={() => fetchData()}
            />
          </ButtonsGrid>
        </div>
        <ShareUrl />
      </div>
      <Footer />
    </div>
  );
};

export default Page;
