import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import { Olimpiada } from "@/models/interfaces/versiones";
import {
  CategoriaExtendida,
  UploadResponse,
  newExcelPostulante,
  newPostulante,
} from "@/models/interfaces/postulantes";
import { ValidationError, ErroresDeFormato } from "@/models/interfaces/errores";
import { newValidarFila } from "@/viewModels/usarVistaModelo/inscribir/excel/validations";
import { ExcelParser } from "@/lib/ExcelParser";
import { useUbicacion } from "@/viewModels/context/UbicacionContext";
import { useCategorias } from "@/viewModels/context/CategoriasContext";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

interface UseFileUploadModalProps {
  olimpiada: Olimpiada;
  onSubmit?: () => void;
}

export const useFileUploadModalViewModel = ({
  olimpiada,
  onSubmit = () => {},
}: UseFileUploadModalProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const { ci, codigo, codigo_lista } = useParams();
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState<ValidationError[]>([]);
  const [erroresDeFormatoExcel, setErroresDeFormatoExcel] = useState<
    ErroresDeFormato[]
  >([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(false);
  const [areasCategorias, setAreasCategorias] = useState<
    Map<string, CategoriaExtendida[]>
  >(new Map());

  const { departamentos, provincias, colegios } = useUbicacion();
  const { getAreasCategoriasPorOlimpiada } = useCategorias();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && open) {
      setCargandoCategorias(true);
      const fetchData = async () => {
        try {
          const areasMap = await getAreasCategoriasPorOlimpiada(
            Number(olimpiada.id)
          );
          setAreasCategorias(areasMap);
        } catch (error) {
          console.error("Error al cargar datos de validación:", error);
        } finally {
          setCargandoCategorias(false);
        }
      };

      fetchData();
    }
  }, [loading, open, olimpiada.id, getAreasCategoriasPorOlimpiada]);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const generarSufijo = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  const inscribirPostulantes = async (postulantes: newPostulante[]) => {
    if (errores.length > 0) return;

    try {
      setLoading(true);
      const nombreLista = `excel${generarSufijo()}`;
      const payload = {
        ci: ci,
        nombre_lista: nombreLista,
        codigo_lista: codigo_lista || codigo,
        olimpiada_id: olimpiada.id,
        listaPostulantes: postulantes,
      };

      await axios.post<UploadResponse>(
        `${API_URL}/api/inscripciones/bulk`,
        payload
      );
      toast.success("Postulantes registrados exitosamente");
      onSubmit();
      setOpen(false);
      setFiles([]);
      if (codigo || codigo_lista) {
        navigate(`./${codigo || codigo_lista}`);
      }
    } catch (err: unknown) {
      let errorMessage = "Error al procesar el archivo.";
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data.mensaje;
        setLoading(false);
        setErrores(
          err.response?.data.errores.map((error: string) => {
            const errorDividido = error.split(" ");
            return {
              fila: parseInt(errorDividido[errorDividido.length - 1]),
              mensaje: error,
            };
          })
        );
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleProcesar = async () => {
    if (files.length === 0) return;

    const selectedFile = files[0];
    setLoading(true);

    try {
      const { jsonData, erroresDeFormato: formatoErrors } = await ExcelParser(
        selectedFile
      );
      setErroresDeFormatoExcel(formatoErrors);
      if (formatoErrors.length > 0) {
        setLoading(false);
        return;
      }

      let encontroFilaVacia = false;
      const postulantesData: newExcelPostulante[] = jsonData[0]
        .slice(1)
        .filter((fila) => {
          if (encontroFilaVacia) return false;

          const filaVacia = fila.every(
            (campo) =>
              campo === null ||
              (typeof campo === "string" && campo.trim() === "")
          );

          if (filaVacia) {
            encontroFilaVacia = true;
            return false;
          }

          return true;
        })
        .map((fila) => {
          let inscripciones: string[] = [];
          for (let index = 13; index < fila.length; index++) {
            inscripciones = [
              ...inscripciones,
              fila[index]?.toString().trim() || "",
            ];
          }

          return {
            nombres: fila[0]?.toString().trim() || "",
            apellidos: fila[1]?.toString().trim() || "",
            ci: fila[2]?.toString().trim() || "",
            fecha_nacimiento: fila[3]?.toString().trim() || "",
            correo_electronico: fila[4]?.toString().trim() || "",
            departamento: fila[5]?.toString().trim() || "",
            provincia: fila[6]?.toString().trim() || "",
            colegio: fila[7]?.toString().trim() || "",
            grado: fila[8]?.toString().trim() || "",
            telefono_referencia: fila[9]?.toString().trim() || "",
            telefono_pertenece_a: fila[10]?.toString().trim() || "",
            correo_referencia: fila[11]?.toString().trim() || "",
            correo_pertenece_a: fila[12]?.toString().trim() || "",
            inscripciones: [
              ...new Set(inscripciones.filter((inscripcion) => inscripcion)),
            ],
          };
        });

      if (postulantesData.length === 0) {
        throw new Error("No hay postulantes en el archivo");
      }

      const todosErrores: ValidationError[] = [];
      const postulantesConvertidos: newPostulante[] = [];
      postulantesData.forEach((fila, index) => {
        const erroresFila = newValidarFila(
          fila,
          index + 2,
          departamentos,
          provincias,
          colegios,
          areasCategorias,
          postulantesConvertidos
        );
        todosErrores.push(...erroresFila);
      });

      setErrores(todosErrores);
      setLoading(false);
      if (todosErrores.length > 0) return;
      inscribirPostulantes(postulantesConvertidos);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Error al procesar el archivo, " + error.message);
      } else {
        toast.error("Error al procesar el archivo, " + error);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    files,
    setFiles,
    open,
    setOpen,
    loading,
    errores,
    erroresDeFormatoExcel,
    cargandoCategorias,
    handleFilesChange,
    handleProcesar,
  };
};
