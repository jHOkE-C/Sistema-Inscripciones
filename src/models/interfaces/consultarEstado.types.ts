export interface Lista {
    codigo_lista: string;
    cantidad_inscritos: number;
    estado: string;
    fecha_creacion: string;
}

export interface ParticipacionResponsable {
    olimpiada: string;
    listas: Lista[];
}

export interface Responsable {
    ci: string;
    nombre: string;
    correo: string;
    telefono: string;
    participaciones: ParticipacionResponsable[];
}

export interface InscripcionPostulante {
    nivel_competencia: string;
    estado: string;
}

export interface ParticipacionPostulante {
    olimpiada: string;
    inscripciones: InscripcionPostulante[];
}

export interface Postulante {
    nombres: string;
    apellidos: string;
    ci: string;
    departamento: string;
    participaciones: ParticipacionPostulante[];
}

export interface Consulta {
    responsable?: Responsable;
    postulante?: Postulante;
} 