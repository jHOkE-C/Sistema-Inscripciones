import { format } from "date-fns";
import { es } from "date-fns/locale";

export interface Cronograma {
  id?: number;
  tipo_plazo: string;
  fecha_inicio: string;
  fecha_fin: string;
  olimpiada_id: number;
}

export interface Olimpiada {
  id: number;
  nombre: string;
  gestion: string;
  fecha_inicio: string;
  fecha_fin: string;
  cronogramas: Cronograma[];
}

export interface OlimpiadaData {
  olimpiada: Olimpiada;
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString + "T00:00:00");
  return format(date, "dd MMMM yyyy", { locale: es });
};