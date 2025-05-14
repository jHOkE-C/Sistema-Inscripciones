export type Version = {
    id: number;
    nombre: string;
    gestion: string;
    fecha_inicio: string;
    fecha_fin: string;
    created_at: string;
    updated_at: string;
};

export interface Olimpiada {
    id: number;
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    gestion: string;
    fase_actual?: Fase;
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
