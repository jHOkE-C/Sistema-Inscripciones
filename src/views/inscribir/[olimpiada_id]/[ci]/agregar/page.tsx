import Footer from "@/components/Footer";
import ReturnComponent from "@/components/ReturnComponent";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/views/inscribir/TableList";
import NotFoundPage from "@/views/404";
import Loading from "@/components/Loading";
import FormResponsable from "@/views/inscribir/FormResponsable";
import ShareUrl from "@/views/inscribir/ShareUrl";
import { usarAgregarPageViewModel } from "@/viewModels/usarVistaModelo/inscribir/olimpiada/agregar/usarAgregarPageViewModel";
import Header from "@/components/Header";

const Page = () => {
    const {
        data,
        openFormResponsable,
        setOpenFormResponsable,
        loading,
        isValidCI,
        columnsWithActions
    } = usarAgregarPageViewModel();

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
            <div className="flex justify-center w-full min-h-screen">
                <div className="w-5/6 mx-auto">
                    <Card className="border-0 shadow-white">
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
                            <DataTable
                                goToCode
                                columns={columnsWithActions}
                                data={data}
                            />
                        </CardContent>
                    </Card>
                </div>
                <ShareUrl />
            </div>
            <Footer />
        </>
    );
};

export default Page;
