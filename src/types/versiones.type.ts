export type Version = {
    id: number;
    nombre: string;
    gestion: string;
    fecha_inicio: string;
    fecha_fin: string;
    created_at: string;
    updated_at: string;
};
export interface Fase {
    id: number;
    fecha_inicio: string;
    fecha_fin: string;
    olimpiada_id: number;
    fase: { id: number; nombre_fase: string; orden: number };
}

export interface Olimpiada {
    id: number;
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    gestion: string;
    fase_actual?: Fase;
    url_plantilla?: string;
}

