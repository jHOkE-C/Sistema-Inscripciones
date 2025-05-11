import { format } from "date-fns";
import { es } from "date-fns/locale";

export interface Fase {
  id: string;
  nombre_fase : string;
  orden: number;
}

export interface Cronograma {
  id: string;
  fecha_inicio: string;
  fecha_fin: string;
  olimpiada_id?: number;
  id_fase: string;  
  fase: Fase
}

export interface Olimpiada {
  id: string;
  nombre: string;
  gestion: string;
  fecha_inicio: string;
  fecha_fin: string;
  vigente: boolean;
  precio_inscripcion:string;
  url_plantilla?:string;
  descripcion_convocatoria: string;
  limite_inscripciones: number;
  cronogramas: Cronograma[];
}

export interface OlimpiadaData {
  olimpiada: Olimpiada;
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString + "T00:00:00");
  return format(date, "dd MMMM yyyy", { locale: es });
};