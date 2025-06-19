import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useColegios } from "@/models/getCacheResponsable/useColegios";
import { useDepartamentosWithProvinces } from "@/models/getCacheResponsable/useUbicacion";
import { useOlimpiada } from "@/models/getCacheResponsable/useOlimpiadas";
import { useAreasConCategorias } from "@/models/getCacheResponsable/useCategoriasAreas";
import { toast } from "sonner";
import { generarExcel } from "@/viewModels/utils/excel";
import type { Olimpiada } from "@/models/interfaces/versiones";

export function useGenerarExcel() {
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchData, setFetchData] = useState(false);
  const { olimpiada_id } = useParams();

  const {
    data: colegios,
    isLoading: isLoadingColegios,
    isError: isErrorColegios,
  } = useColegios({ queryKey: ["colegios"], enabled: fetchData });
  const {
    data: departamentosConProvincias,
    isLoading: isLoadingDepartamentos,
    isError: isErrorDepartamentos,
  } = useDepartamentosWithProvinces({
    queryKey: ["departamentosWithProvinces"],
    enabled: fetchData,
  });
  const {
    data: olimpiadaData,
    isLoading: isLoadingOlimpiada,
    isError: isErrorOlimpiada,
  } = useOlimpiada(Number(olimpiada_id), {
    queryKey: ["olimpiada", Number(olimpiada_id)],
    enabled: fetchData,
  });
  const {
    data: areasCategorias,
    isLoading: isLoadingAreasCategorias,
    isError: isErrorAreasCategorias,
  } = useAreasConCategorias(Number(olimpiada_id), {
    queryKey: ["areasConCategorias", Number(olimpiada_id)],
    enabled: fetchData,
  });
  const olimpiada: Olimpiada | undefined = olimpiadaData;

  const isLoading =
    isLoadingColegios ||
    isLoadingDepartamentos ||
    isLoadingOlimpiada ||
    isLoadingAreasCategorias;
  const isError =
    isErrorColegios ||
    isErrorDepartamentos ||
    isErrorOlimpiada ||
    isErrorAreasCategorias;

  useEffect(() => {
    const generateExcelWhenReady = async () => {
      if (
        fetchData &&
        !isLoading &&
        !isError &&
        colegios &&
        departamentosConProvincias &&
        olimpiada &&
        areasCategorias
      ) {
        try {
          await generarExcel(
            olimpiada,
            departamentosConProvincias,
            colegios,
            areasCategorias,
            olimpiada.nombre
          );
        } catch (error) {
          console.error("Error al generar el excel:", error);
          toast.error("Error al generar el excel.");
        } finally {
          setLoading(false);
          setFetchData(false);
        }
      } else if (fetchData && isError) {
        toast.error(
          "Error al cargar los datos necesarios para generar el excel."
        );
        setLoading(false);
        setFetchData(false);
      }
    };

    generateExcelWhenReady();
  }, [
    fetchData,
    isLoading,
    isError,
    colegios,
    departamentosConProvincias,
    olimpiada,
    areasCategorias,
    olimpiada_id,
  ]);

  const handleDownload = () => {
    setFetchData(true);
    setLoading(true);
  };

  return {
    loading,
    isLoading,
    isError,
    handleDownload,
  };
}
