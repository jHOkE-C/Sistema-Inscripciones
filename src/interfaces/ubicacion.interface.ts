

export interface Departamento {
    id: number;
    nombre: string;
    provincias: Provincia[];
}
export interface Provincia {
    departamento_id: string;
    nombre: string;
    id: number;
}
export interface Colegio {
    id: string;
    nombre: string;
}
