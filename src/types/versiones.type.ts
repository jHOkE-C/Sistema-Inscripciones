export type Version = {
    id: number;
    nombre: string;
    gestion: string;
    fecha_inicio: string;
    fecha_fin: string;
    created_at: string;
    updated_at: string;
};
export type Olimpiada = {
    id: number;
    nombre: string;
    gestion: string;
    fecha_inicio: string;
    fecha_fin: string;
    vigente?: boolean;
    fase_actual?: Fase;
    url_plantilla?: string;
};

// Tipos para los datos de olimpiadas
export interface Fase {
    id: number;
    tipo_plazo: string;
    fecha_inicio: string;
    fecha_fin: string;
    olimpiada_id: number;
}
