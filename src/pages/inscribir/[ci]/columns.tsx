import type { ColumnDef } from "@tanstack/react-table";
export type Postulante = {
    id: string;
    nombres: string;
    apellidos: string;
    fecha_nacimiento: string;
    provincia_id: string;
    email: string;
    ci: string;
    curso: string;
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

export const inscripciones: Lista[] = [
    {
        id: "1",
        nombre_lista: "BIOLOGIA 2024",
        codigo_lista: "a20dd8de-98de-4e64-bdaf-6e48000b0690",
        id_responsable: "f1e1601f-39f5-4fd0-9661-fa1c16802e77",
        estado: "pendiente",
        fecha_creacion: "2025-04-07 18:12:09",
        responsable: {
            id: "8",
            uuid: "f1e1601f-39f5-4fd0-9661-fa1c16802e77",
            ci: "4654665421",
            nombre_completo: "Juan Perez",
            email: "juan@examaple.com",
            telefono: "76543210",
        },
        inscripciones: [
            {
                id: "4",
                fecha_inscripcion: "2025-04-07 14:20:06",
                postulante_id: "4",
                lista_id: "a20dd8de-98de-4e64-bdaf-6e48000b0690",
                area_id: "4",
                categoria_id: "5",
                colegio_id: "1",
                olimpiada_id: "3",
                orden_pago_id: "",
                email: "iojaifo@jaofds.com",
                tipo_contacto_email: "profesor",
                telefono: "15163516",
                tipo_contacto_telefono: "profesor",
                estado: "pendiente",
                postulante: {
                    id: "4",
                    nombres: "akñafdsj",
                    apellidos: "joajoijf",
                    fecha_nacimiento: "2002-10-02",
                    provincia_id: "5",
                    email: "joijf23@ijafs.com",
                    ci: "213551",
                    curso: "10",
                },
            },
        ],
    },
];

export const columns: ColumnDef<DataTable>[] = [
    {
        accessorKey: "nombre",
        header: "Nombre",
    },
    {
        accessorKey: "apellido",
        header: "Apellido",
    },
    {
        accessorKey: "area",
        header: "Area",
    },
    {
        accessorKey: "Categoria",
        header: "categoria",
    },
];
