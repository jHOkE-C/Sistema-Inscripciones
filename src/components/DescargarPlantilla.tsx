import { Download } from "lucide-react";
import { useState, useEffect } from "react"; // Import useEffect
import { Button } from "./ui/button";
import type { Olimpiada } from "@/types/versiones.type";
import { generarExcel } from "@/utils/excel";
import { useColegios } from "../hooks/getCacheResponsable/useColegios";
import { useDepartamentosWithProvinces } from "../hooks/getCacheResponsable/useUbicacion";
import { useAreasConCategorias } from "../hooks/getCacheResponsable/useCategoriasAreas";
import { toast } from "sonner";

const DescargarPlantilla = ({ olimpiada }: { olimpiada: Olimpiada }) => {
    const [loadingExcel, setLoadingExcel] = useState(false);
    const [fetchData, setFetchData] = useState(false);

    const { data: colegios, isLoading: isLoadingColegios, isError: isErrorColegios } = useColegios({ queryKey: ["colegios"], enabled: fetchData });
    const { data: departamentosConProvincias, isLoading: isLoadingDepartamentos, isError: isErrorDepartamentos } = useDepartamentosWithProvinces({ queryKey: ["departamentosWithProvinces"], enabled: fetchData });
    const { data: areasCategorias, isLoading: isLoadingAreasCategorias, isError: isErrorAreasCategorias } = useAreasConCategorias(olimpiada.id, { queryKey: ["areasConCategorias", olimpiada.id], enabled: fetchData });

    const isLoading = isLoadingColegios || isLoadingDepartamentos || isLoadingAreasCategorias;
    const isError = isErrorColegios || isErrorDepartamentos || isErrorAreasCategorias;

    useEffect(() => {
        const generateExcelWhenReady = async () => {
            if (fetchData && !isLoading && !isError && colegios && departamentosConProvincias && areasCategorias) {
                try {
                    await generarExcel(olimpiada, departamentosConProvincias, colegios, areasCategorias, olimpiada.nombre);
                } catch (error) {
                    console.error("Error al generar el excel:", error);
                    toast.error("Error al generar el excel.");
                } finally {
                    setLoadingExcel(false);
                    setFetchData(false); // Reset fetchData after generation
                }
            } else if (fetchData && isError) {
                toast.error("Error al cargar los datos necesarios para generar el excel.");
                setLoadingExcel(false);
                setFetchData(false); // Reset fetchData on error
            }
        };

        generateExcelWhenReady();
    }, [fetchData, isLoading, isError, colegios, departamentosConProvincias, areasCategorias, olimpiada]);

    const onClick = () => {
        setFetchData(true); // Start fetching data
        setLoadingExcel(true); // Show loading state for Excel generation
    };

    return (
        <>
            <Button
                variant={"link"}
                disabled={loadingExcel || isLoading || isError}
                className=" mb-2  text-green-600 border-green-200 hover:text-green-500 transition-colors"
                onClick={onClick} // Changed to direct onClick
            >
                {loadingExcel || isLoading ? (
                    <div className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full" />
                        {isLoading ? "Cargando datos..." : "Descargando..."}
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
