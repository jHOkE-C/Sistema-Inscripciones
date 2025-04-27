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

export interface Postulante {
    nombres: string;
    apellidos: string;
    ci: string;
    fecha_nacimiento: string;        // formato ISO (DD-MM-YYYY)
    correo_postulante: string;
    email_contacto: string;
    tipo_contacto_email: number;
    telefono_contacto: string;
    tipo_contacto_telefono: number;  

    idDepartamento: number;
    idProvincia: number;
    idColegio: number;
    idCurso: number;
    idArea1: number;
    idCategoria1: number;
    idArea2: number;
    idCategoria2: number;
}

export const CONTACTOS_PERMITIDOS = [
    {id:3, contacto: "Estudiante"}, 
    {id:1, contacto: "Madre/Padre"}, 
    {id:2, contacto: "Responsable"}
];

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

// Moved types from viaExcel/types.ts
export type UploadResponse = {
    message: string;
};

//utilizado para el response de una peticion de all areas con categorias
export type AreaConCategorias = {
    id: number;
    nombre: string;
    categorias: Categoria[];
};

//utilizado para el mapeo de categorias utilizadas en el evento
export interface Categoria {
    id: string;
    nombre: string;
}
export interface CategoriaExtendida extends Categoria {
    areaId: number;
    areaNombre: string;
}