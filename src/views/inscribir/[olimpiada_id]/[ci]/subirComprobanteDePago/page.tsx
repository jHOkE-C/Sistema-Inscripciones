import Footer from "@/components/Footer";
import ReturnComponent from "@/components/ReturnComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { columns, type ListaPostulantes } from "@/views/inscribir/columnas";
import ShareUrl from "@/views/inscribir/compartir";
import { DataTable } from "@/views/inscribir/listaTabla";
import type { ColumnDef } from "@tanstack/react-table";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFoundPage from "@/views/404";
import { getListasPostulantes } from "@/models/api/postulantes";
import Loading from "@/components/Loading";
import FormResponsable from "@/views/inscribir/FormResponsable";
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
      setData(
        data.filter(
          ({ olimpiada_id: id, estado }) =>
            id == olimpiada_id && estado == "Pago Pendiente"
        )
      );
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
    <>
      <Header />
      <ReturnComponent />
      <div className="flex justify-center w-full min-h-screen pt-4">
        <div className="w-5/6 mx-auto">
          <Card className="border-0 shadow-white">
            <CardHeader>
              <CardTitle>
                <h2 className="text-3xl font-bold text-center">
                  Inscripciones de Postulantes
                </h2>
              </CardTitle>
              <CardDescription className="text-center text-indigo-500">
                Selecciona una inscripcion para subir el comprobante de pago
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 justify-between">
              <DataTable goToCode columns={columnsWithActions} data={data} />
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
