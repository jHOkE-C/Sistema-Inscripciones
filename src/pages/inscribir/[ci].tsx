import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CreateList } from "./CreateList";
import { DataTable } from "./TableList";
import { columns, ListaPostulantes } from "./columns";
import React, { Suspense, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ShareUrl from "./ShareUrl";
import { getListasPostulantes } from "@/api/postulantes";
import FormResponsable from "./FormResponsable";
import NotFoundPage from "../404";
import { AlertComponent } from "@/components/AlertComponent";
import Loading from "@/components/Loading";
import ReturnComponent from "@/components/ReturnComponent";
const FileUploadModal = React.lazy(
  () => import("./viaExcel/file-upload-modal")
);
import { Download} from "lucide-react";
import Footer from "@/components/Footer";
import {Toaster } from "sonner";

const Page = () => {
  const [data, setData] = useState<ListaPostulantes[]>([]);
  const { ci } = useParams();
  const [openFormResponsable, setOpenFormResponsable] = useState(false);
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (ci && ci.length >= 7 && ci.length <= 10) fetchData();
  }, []);

  if (!ci || ci.length < 7 || ci.length > 10) {
    return <NotFoundPage />;
  }

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getListasPostulantes(ci);
      setData(data.data);
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
      console.error("Error al obtener las listas de postulantes");
    }
  };
  if (loading) return <Loading />;
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster />
      <div className="p-2">
        <ReturnComponent to={`/`} />
      </div>
      {openFormResponsable && (
        <FormResponsable
          onClose={() => {
            setOpenFormResponsable(false);
            setSuccess("¡Registro de Responsable Exitoso!");
          }}
        />
      )}
      <div className="m py-5">
        <div className="container mx-auto ">
          <Card className="border-0 shadow-white">
            <CardTitle>
              <h1 className="text-3xl font-bold text-center">
                Listas de Postulantes
              </h1>
            </CardTitle>
            <CardContent className="space-y-5 justify-between">
              <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
                <Link
                  to="/plantilla-excel.xlsx"
                  className="text-sm inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors hover:underline underline-offset-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Descargar plantilla de Excel</span>
                </Link>

                <div className="flex gap-2 items-center">
                  <Suspense fallback={<Loading />}>
                    <FileUploadModal
                      maxFiles={1}
                      maxSize={10}
                      accept=".xlsx,.xls"
                      onFilesChange={(files) =>
                        console.log("Files changed:", files)
                      }
                      triggerText="Añadir archivo Excel"
                      title="Añadir archivo Excel"
                      description="Selecciona un archivo de Excel de tu dispositivo o arrástralo y suéltalo aquí."
                    />
                  </Suspense>

                  <CreateList refresh={fetchData} number={data.length + 1} />
                </div>
              </div>
              <DataTable columns={columns} data={data} />
            </CardContent>
          </Card>
        </div>
        <ShareUrl />
      </div>
      {error && (
        <AlertComponent
          description={error}
          variant="destructive"
          onClose={() => setError(null)}
        />
      )}
      {success && (
        <AlertComponent
          description={success}
          onClose={() => setSuccess(null)}
        />
      )}
      <Footer />
    </div>
  );
};

export default Page;
