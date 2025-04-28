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
    { id: "1", nombre: "_1ro_Primaria" },
    { id: "2", nombre: "_2do_Primaria" },
    { id: "3", nombre: "_3ro_Primaria" },
    { id: "4", nombre: "_4to_Primaria" },
    { id: "5", nombre: "_5to_Primaria" },
    { id: "6", nombre: "_6to_Primaria" },
    { id: "7", nombre: "_1ro_Secundaria" },
    { id: "8", nombre: "_2do_Secundaria" },
    { id: "9", nombre: "_3ro_Secundaria" },
    { id: "10", nombre: "_4to_Secundaria" },
    { id: "11", nombre: "_5to_Secundaria" },
    { id: "12", nombre: "_6to_Secundaria" }
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