import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { DataTable } from "../../../listaTabla";
import ShareUrl from "../../../compartir";
import FormResponsable from "../../../FormResponsable";
import NotFoundPage from "../../../../404";
import Loading from "@/components/Loading";
import ReturnComponent from "@/components/ReturnComponent";
import Footer from "@/components/Footer";
import { useGenerarOrdenViewModel } from "@/viewModels/usarVistaModelo/inscribir/olimpiada/generarOrden/usarGenerarOrdenViewModel";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import OrdenPago from "../ordenPago";
import { useParams } from "react-router-dom";
import type { Row } from "@tanstack/react-table";
import type { ListaPostulantes } from "@/views/inscribir/columnas";
import Header from "@/components/Header";

const Page = () => {
  const { ci, olimpiada_id } = useParams();
  const {
    data,
    openFormResponsable,
    setOpenFormResponsable,
    loading,
    isValidCI,
    columnsWithActions,
  } = useGenerarOrdenViewModel();

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

  const columnsWithComponents = columnsWithActions.map((column) => {
    if (column.id === "acciones") {
      return {
        ...column,
        cell: ({ row }: { row: Row<ListaPostulantes> }) => {
          const codigoLista = row.getValue("codigo_lista") as string;
          return row.original.estado === "Pago Pendiente" ? (
            <OrdenPago codigo_lista={codigoLista} />
          ) : (
            <Link to={`/inscribir/${olimpiada_id}/${ci}/${codigoLista}`}>
              <Button variant={"link"}>Abrir Incripción</Button>
            </Link>
          );
        },
      };
    }
    return column;
  });

  return (
    <>
      <Header />
      <ReturnComponent />
      <div className="flex justify-center w-full min-h-screen pt-4">
        <div className="w-5/6 mx-auto">
          <Card className="border-0 shadow-white">
            <CardTitle>
              <h2 className="text-3xl font-bold text-center">
                Inscripciones de Postulantes
              </h2>
            </CardTitle>
            <CardContent className="space-y-5 justify-between">
              <DataTable columns={columnsWithComponents} data={data} />
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
