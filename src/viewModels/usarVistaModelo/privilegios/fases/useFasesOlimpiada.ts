import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, { type AxiosError } from "axios";
import { differenceInCalendarDays } from "date-fns";
import { toast } from "sonner";
import { API_URL } from "@/viewModels/hooks/useApiRequest.tsx";
import {
  type Cronograma,
  type OlimpiadaData,
} from "@/models/interfaces/olimpiada";
import { apiClient } from "@/models/api/solicitudes";

interface Fase {
  id: string;
  nombre_fase: string;
}

export function useFasesOlimpiada() {
  const nav = useNavigate();
  const { olimpiada_id } = useParams();

  const [data, setData] = useState<OlimpiadaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedIdFases, setSelectedTipos] = useState<string[]>([]);
  const [cronos, setCronos] = useState<Cronograma[]>([]);
  const [errors, setErrors] = useState<{ start: boolean; end: boolean }[]>([]);
  const [fases, setFases] = useState<Fase[]>([]);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      const res = await axios.get<OlimpiadaData>(
        `${API_URL}/api/olimpiadas/${olimpiada_id}/cronogramas`
      );
      setData(res.data);
      const cronogramas = res.data.olimpiada.cronogramas;

      if (cronogramas.length > 0) {
        setCronos(cronogramas);
      }

      const fases = await axios.get<Fase[]>(`${API_URL}/api/fases`);
      setFases(fases.data);

      const selected = cronogramas.map(({ id_fase }) => id_fase);

      setSelectedTipos(selected);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  function parseLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function onSelectDate(
    date: Date,
    tipo: string,
    field: "fecha_inicio" | "fecha_fin"
  ) {
    setCronos((prev) =>
      prev.map((c) => {
        if (c.fase.nombre_fase === tipo) {
          return {
            ...c,
            [field]: date.toISOString().split("T")[0],
          };
        }
        return c;
      })
    );
  }

  function validateAll(): boolean {
    if (!data) return false;
    const { olimpiada } = data;
    const vStart = parseLocalDate(olimpiada.fecha_inicio);
    const vEnd = parseLocalDate(olimpiada.fecha_fin);

    const newErrors: { start: boolean; end: boolean }[] = [];
    let valid = true;

    for (let i = 0; i < cronos.length; i++) {
      const c = cronos[i];
      const start = c.fecha_inicio ? parseLocalDate(c.fecha_inicio) : null;
      const end = c.fecha_fin ? parseLocalDate(c.fecha_fin) : null;
      const phaseName = c.fase.nombre_fase;
      const errorFlags = { start: false, end: false };

      if (!start || !end) {
        if (!start) {
          errorFlags.start = true;
          toast.error(`La fase "${phaseName}" necesita fecha de inicio.`);
        }
        if (!end) {
          errorFlags.end = true;
          toast.error(`La fase "${phaseName}" necesita fecha de fin.`);
        }
        valid = false;
      } else {
        if (start.getTime() < vStart.getTime()) {
          errorFlags.start = true;
          toast.error(
            `La fecha de inicio de "${phaseName}" está antes del rango válido.`
          );
          valid = false;
        }
        if (end > vEnd) {
          errorFlags.end = true;
          toast.error(
            `La fecha de fin de "${phaseName}" excede el rango permitido.`
          );
          valid = false;
        }
        if (differenceInCalendarDays(end, start) < 0) {
          errorFlags.start = true;
          errorFlags.end = true;
          toast.error(
            `En "${phaseName}", la fecha de fin debe ser posterior a la de inicio.`
          );
          valid = false;
        }
        if (i > 0) {
          const prevPhase = cronos[i - 1].fase.nombre_fase;
          const prevEnd = parseLocalDate(cronos[i - 1].fecha_fin);
          if (start < prevEnd) {
            errorFlags.start = true;
            newErrors[i - 1] = newErrors[i - 1] || {
              start: false,
              end: false,
            };
            newErrors[i - 1].end = true;
            toast.error(
              `La fase "${phaseName}" se solapa con la fase anterior "${prevPhase}".`
            );
            valid = false;
          }
        }
      }

      newErrors[i] = errorFlags;
    }

    setErrors(newErrors);
    return valid;
  }

  async function onSave() {
    if (!data) return;
    const { olimpiada } = data;
    const payload = {
      id_olimpiada: olimpiada.id,
      cronogramas: cronos,
    };
    if (!validateAll()) return;
    try {
      await axios.put(`${API_URL}/api/cronogramas/fases/fechas`, payload);
      toast.success(
        "Se registraron las fases y sus respectivas fechas exitosamente."
      );
      nav(`/admin/`);
    } catch (e) {
      const errorMessage =
        (e as AxiosError<{ error?: string }>).response?.data?.error ||
        "Error al guardar. Inténtalo de nuevo.";
      toast.error(errorMessage);
    }
  }

  function toggleTipo(id_fase: string) {
    if (id_fase == "1" && selectedIdFases.includes(id_fase)) {
      toast.info("no se puede quitar la fase de Preparación");
      return;
    }
    setSelectedTipos((prev) => {
      if (prev.includes(id_fase)) {
        return prev.filter((id) => id !== id_fase);
      } else {
        return [...prev, id_fase];
      }
    });
  }

  const idFasesCronogramas = cronos.map(({ id_fase }) => id_fase);
  const agregar = selectedIdFases.filter(
    (id) => !idFasesCronogramas.includes(id)
  );
  const eliminar = idFasesCronogramas.filter(
    (id) => !selectedIdFases.includes(id)
  );

  async function changePhase(confirm?: boolean) {
    setLoading(true);
    try {
      if (!confirm && eliminar.length > 0) {
        setOpenConfirm(true);
        return;
      }

      const data = {
        id_olimpiada: olimpiada_id,
        fases_agregar: agregar,
        fases_borrar: eliminar,
      };

      await apiClient.put("/api/cronogramas/fases/olimpiada", data);
      refresh();
      setOpenConfirm(false);
      setOpenAdd(false);
    } catch {
      toast.error("Ocurrio un error al agregar fases");
    } finally {
      setLoading(false);
    }
  }

  const getTipoPlazoLabel = (text: string) => {
    return text
      .split(" ")
      .map((t) => t.at(0)?.toUpperCase() + t.slice(1) + " ");
  };

  const FasesActualesPasadas = cronos.filter(
    ({ fecha_inicio }) => new Date(fecha_inicio) < new Date()
  );
  const idsFasesActualesPasadas = FasesActualesPasadas.map(
    ({ id_fase }) => id_fase
  );

  return {
    data,
    loading,
    openAdd,
    setOpenAdd,
    openConfirm,
    setOpenConfirm,
    selectedIdFases,
    cronos,
    errors,
    fases,
    onSelectDate,
    onSave,
    toggleTipo,
    parseLocalDate,
    changePhase,
    getTipoPlazoLabel,
    idsFasesActualesPasadas,
    eliminar,
  };
}
