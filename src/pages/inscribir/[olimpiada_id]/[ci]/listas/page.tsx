import Footer from "@/components/Footer";
import ReturnComponent from "@/components/ReturnComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { columns, type ListaPostulantes } from "@/pages/inscribir/columns";
import ShareUrl from "@/pages/inscribir/ShareUrl";
import { DataTable } from "@/pages/inscribir/TableList";
import type { ColumnDef } from "@tanstack/react-table";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFoundPage from "@/pages/404";
import { getListasPostulantes } from "@/api/postulantes";
import Loading from "@/components/Loading";
import FormResponsable from "@/pages/inscribir/FormResponsable";
import Header from "@/components/Header";

const Page = () => {
  const [data, setData] = useState<ListaPostulantes[]>([]);
  const [openFormResponsable, setOpenFormResponsable] = useState(false);
  const [loading, setLoading] = useState(false);
  const { ci, olimpiada_id } = useParams();
  useEffect(() => {
    if (ci && ci.length >= 7 && ci.length <= 10) fetchData();
  }, []);

  if (!ci || ci.length < 7 || ci.length > 10) {
    return <NotFoundPage />;
  }
  if (!olimpiada_id) return;

  const refresh = async () => {
    setLoading(true);
    try {
      const { data } = await getListasPostulantes(ci);

      setData(data.filter(({ olimpiada_id: id }) => id == olimpiada_id));
    } catch {
      setOpenFormResponsable(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      refresh();
    } catch {
      console.error("Error al obtener las inscripciones de postulantes");
    }
  };

  const columnsWithActions: ColumnDef<ListaPostulantes, unknown>[] = [
    ...columns,
  ];

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
