import { Download } from "lucide-react";
import { useState, useEffect } from "react"; // Import useEffect
import { Button } from "./ui/button";
import type { Olimpiada } from "@/models/types/versiones.type";
import { generarExcel } from "@/viewModels/utils/excel";
import { useColegios } from "@/models/getCacheResponsable/useColegios";
import { useDepartamentosWithProvinces } from "@/models/getCacheResponsable/useUbicacion";
import { useAreasConCategorias } from "@/models/getCacheResponsable/useCategoriasAreas";
import { toast } from "sonner";

const DescargarPlantilla = ({ olimpiada }: { olimpiada: Olimpiada }) => {
    const [loadingExcel, setLoadingExcel] = useState(false);
    const [fetchData, setFetchData] = useState(false);

    const { data: colegios, isLoading: isLoadingColegios, isError: isErrorColegios } = useColegios({ queryKey: ["colegios"], enabled: fetchData });
    const { data: departamentosConProvincias, isLoading: isLoadingDepartamentos, isError: isErrorDepartamentos } = useDepartamentosWithProvinces({ queryKey: ["departamentosWithProvinces"], enabled: fetchData });
    const { data: areasCategorias, isLoading: isLoadingAreasCategorias, isError: isErrorAreasCategorias } = useAreasConCategorias(olimpiada.id, { queryKey: ["areasConCategorias", olimpiada.id], enabled: fetchData });

    const isDataLoading = isLoadingColegios || isLoadingDepartamentos || isLoadingAreasCategorias;
    const isDataError = isErrorColegios || isErrorDepartamentos || isErrorAreasCategorias;

    useEffect(() => {
        const generateExcelWhenReady = async () => {
            if (fetchData && !isDataLoading && !isDataError && colegios && departamentosConProvincias && areasCategorias) {
                try {
                    await generarExcel(olimpiada, departamentosConProvincias, colegios, areasCategorias, olimpiada.nombre);
                    toast.success("Plantilla generada correctamente.");
                } catch (error) {
                    console.error("Error al generar el excel:", error);
                    toast.error("Error al generar el excel.");
                } finally {
                    setLoadingExcel(false);
                    setFetchData(false);
                }
            } else if (fetchData && isDataError) {
                toast.error("Error al cargar los datos necesarios para generar el excel.");
                setLoadingExcel(false);
                setFetchData(false);
            }
        };

        generateExcelWhenReady();
    }, [fetchData, isDataLoading, isDataError, colegios, departamentosConProvincias, areasCategorias, olimpiada]);

    const onClick = () => {
        setFetchData(true); 
        setLoadingExcel(true);
    };

    return (
        <>
            <Button
                variant={"link"}
                disabled={loadingExcel || isDataLoading || isDataError}
                className=" mb-2  text-green-600 border-green-200 hover:text-green-500 transition-colors"
                onClick={onClick}
            >
                {loadingExcel ? (
                    <div className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full" />
                        Descargando...
                    </div>
                ) : isDataLoading ? (
                    <div className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Plantilla de Inscripción
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Plantilla de Inscripción
                    </div>
                )}
            </Button>
        </>
    );
};

export default DescargarPlantilla;
