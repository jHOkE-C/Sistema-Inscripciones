export interface ExcelPostulante {
    nombres: string;
    apellidos: string;
    ci: string;
    fecha_nacimiento: string;
    correo_electronico: string;
    departamento: string;
    provincia: string;
    colegio: string;
    grado: string;
    telefono_referencia: string;
    telefono_pertenece_a: string;
    correo_referencia: string;
    correo_pertenece_a: string;
    area_categoria1: string;
    area_categoria2: string;
}

export interface ValidationError {
    campo: string;
    fila: number;
    ci: string;
    mensaje: string;
}

export const CONTACTOS_PERMITIDOS = ['ESTUDIANTE', 'MAMA', 'PAPA', 'TUTOR', 'PROFESOR'];

export const grados = [
    { id: "1", nombre: "1ro Primaria" },
    { id: "2", nombre: "2do Primaria" },
    { id: "3", nombre: "3ro Primaria" },
    { id: "4", nombre: "4to Primaria" },
    { id: "5", nombre: "5to Primaria" },
    { id: "6", nombre: "6to Primaria" },
    { id: "7", nombre: "1ro Secundaria" },
    { id: "8", nombre: "2do Secundaria" },
    { id: "9", nombre: "3ro Secundaria" },
    { id: "10", nombre: "4to Secundaria" },
    { id: "11", nombre: "5to Secundaria" },
    { id: "12", nombre: "6to Secundaria" }
];
export interface Departamento {
    ID: number;
    Nombre: string;
    Provincias: Provincia[];
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
export interface Categoria {
    id: string;
    nombre: string;
}   
// Estados iniciales
export interface EstadosIniciales {
    departamentos: Departamento[];
    provincias: Provincia[];
    colegios: Colegio[];
    areasCategoriasPorGrado: Map<string, Categoria[]>;
}

export const estadosIniciales: EstadosIniciales = {
    departamentos: [],
    provincias: [],
    colegios: [],
    areasCategoriasPorGrado: new Map()
};

export type CategoriaExtendida = Categoria & {
    areaId: number;
    areaNombre: string;
};