export interface Provincia {
    departamento_id: string;
    nombre: string;
    id: number;
}

export interface Departamento {
    id: number;
    nombre: string;
    Provincias: Provincia[];
}

export interface Colegio {
    id: string;
    nombre: string;
}
