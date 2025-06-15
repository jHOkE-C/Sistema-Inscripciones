import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { generarExcel } from "@/viewModels/utils/excel";

import { DownloadCloud, FileSpreadsheet, Info } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react"; // Import useEffect
import { useColegios } from "@/models/getCacheResponsable/useColegios";
import { useDepartamentosWithProvinces } from "@/models/getCacheResponsable/useUbicacion";
import { useOlimpiada } from "@/models/getCacheResponsable/useOlimpiadas";
import { useAreasConCategorias } from "@/models/getCacheResponsable/useCategoriasAreas";
import { toast } from "sonner";
import type { Olimpiada } from "@/models/interfaces/versiones.type";

const Page = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [fetchData, setFetchData] = useState(false);
    const { olimpiada_id } = useParams();

    const { data: colegios, isLoading: isLoadingColegios, isError: isErrorColegios } = useColegios({ queryKey: ["colegios"], enabled: fetchData });
    const { data: departamentosConProvincias, isLoading: isLoadingDepartamentos, isError: isErrorDepartamentos } = useDepartamentosWithProvinces({ queryKey: ["departamentosWithProvinces"], enabled: fetchData });
    const { data: olimpiadaData, isLoading: isLoadingOlimpiada, isError: isErrorOlimpiada } = useOlimpiada(Number(olimpiada_id), { queryKey: ["olimpiada", Number(olimpiada_id)], enabled: fetchData });
    const { data: areasCategorias, isLoading: isLoadingAreasCategorias, isError: isErrorAreasCategorias } = useAreasConCategorias(Number(olimpiada_id), { queryKey: ["areasConCategorias", Number(olimpiada_id)], enabled: fetchData });
    const olimpiada: Olimpiada | undefined = olimpiadaData;

    const isLoading = isLoadingColegios || isLoadingDepartamentos || isLoadingOlimpiada || isLoadingAreasCategorias;
    const isError = isErrorColegios || isErrorDepartamentos || isErrorOlimpiada || isErrorAreasCategorias;

    useEffect(() => {
        const generateExcelWhenReady = async () => {
            if (fetchData && !isLoading && !isError && colegios && departamentosConProvincias && olimpiada && areasCategorias) {
                try {
                    await generarExcel(olimpiada, departamentosConProvincias, colegios, areasCategorias, olimpiada.nombre);
                } catch (error) {
                    console.error("Error al generar el excel:", error);
                    toast.error("Error al generar el excel.");
                } finally {
                    setLoading(false);
                    setFetchData(false); 
                }
            } else if (fetchData && isError) {
                toast.error("Error al cargar los datos necesarios para generar el excel.");
                setLoading(false);
                setFetchData(false);
            }
        };

        generateExcelWhenReady();
    }, [fetchData, isLoading, isError, colegios, departamentosConProvincias, olimpiada, areasCategorias, olimpiada_id]);

    const handleDownload = () => {
        setFetchData(true); // Start fetching data when button is clicked
        setLoading(true); // Show loading state for Excel generation
    };

    return (
        <div className="flex justify-center items-center min-h-screen  p-6">
            <Card className="w-full max-w-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up">
                <CardHeader className="">
                    <div className="flex items-center space-x-3">
                        <div className="p-2  rounded-lg">
                            <FileSpreadsheet className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                Plantilla de Inscripción
                            </CardTitle>
                            <CardDescription className="mt-1 text-gray-600">
                                Descarga una plantilla de Excel con validaciones
                                integradas y formatos profesionales.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="py-6">
                    <Button
                        onClick={handleDownload}
                        className="w-full group relative transition-all duration-300 bg-gradient-to-br from-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-emerald-200"
                        disabled={loading || isLoading || isError}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            {loading || isLoading ? (
                                <>
                                    <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                                    <span>{isLoading ? "Cargando datos..." : "Generando plantilla..."}</span>
                                </>
                            ) : (
                                <>
                                    <DownloadCloud className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
                                    <span>Descargar Plantilla</span>
                                    <div className="absolute group-hover:opacity-20 transition-opacity" />
                                </>
                            )}
                        </div>
                    </Button>

                    <div className="mt-4 text-sm text-foreground/50 flex items-center space-x-2">
                        <Info className="w-4 h-4 text-foreground/40" />
                        <span>
                            El archivo incluye validaciones y formato
                            condicional
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
export default Page;
