export type Postulante = {
    id: string;
    nombres: string;
    apellidos: string;
    fecha_nacimiento: string;
    provincia_id: string;
    email: string;
    ci: string;
    curso: string;
    area: string;
    categoria: string;
};

export type Inscripcion = {
    id: string;
    fecha_inscripcion: string;
    postulante_id: string;
    lista_id: string;
    area_id: string;
    categoria_id: string;
    colegio_id: string;
    olimpiada_id: string;
    orden_pago_id: string;
    email: string;
    tipo_contacto_email: string;
    telefono: string;
    tipo_contacto_telefono: string;
    estado: string;
    postulante: Postulante;
};
export type Responsable = {
    id: string;
    uuid: string;
    ci: string;
    nombre_completo: string;
    email: string;
    telefono: string;
};
export type Lista = {
    id: string;
    nombre_lista: string;
    codigo_lista: string;
    id_responsable: string;
    estado: string;
    fecha_creacion: string;
    responsable: Responsable;
    inscripciones: Inscripcion[];
};

export type DataTable = {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    area: string;
    categoria: string;
    colegio: string;
    departamento: string;
    provincia: string;
};
