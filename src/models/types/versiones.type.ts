export type Version = {
    id: number;
    nombre: string;
    gestion: string;
    fecha_inicio: string;
    fecha_fin: string;
    limite_inscripciones: number;
    precio_inscripcion: string;
    fase?: Fase;
};

export interface Olimpiada {
    id: number;
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    gestion: string;
    fase?: Fase;
    url_plantilla?: string;
    limite_inscripciones?: number;
}
export interface Olimpiada2 {
    id: number;
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    gestion: string;
    fase_actual: Fase;
    url_plantilla?: string;
}
export interface Fase {
    id: number;
    fecha_inicio: string;
    fecha_fin: string;
    olimpiada_id: number;
    fase: { id: number; nombre_fase: FaseNombre; orden: number };
}

export type FaseNombre =
    | "Preparación"
    | "Lanzamiento"
    | "Primera inscripción"
    | "Segunda inscripción"
    | "Tercera inscripción"
    | "Cuarta inscripción"
    | "Primera clasificación"
    | "Segunda clasificación"
    | "Tercera clasificación"
    | "Final"
    | "Segunda Final"
    | "Premiación"
    | "Segunda premiación";

export type FiltroGlobal = "pasadas" | "futuras";

export type VersionFilter = FiltroGlobal | FaseNombre;

export interface Cronograma {
    id_fase: string;
    fecha_inicio: string;
    fecha_fin: string;
    fase: { id: string; nombre_fase: string; orden: number };
}

export interface OlimpiadaData {
    olimpiada: Olimpiada;
    cronogramas: Cronograma[];
}
