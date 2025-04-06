import { ColumnDef } from "@tanstack/react-table";

export type ListaPostulantes = {
    id: number;
    nombre_lista: string;
    cantidad_postulantes: number ;
    fecha_creacion: Date;
    estado: string;
    codigo_lista: string;
    id_responsable:string;
};

export const columns: ColumnDef<ListaPostulantes>[] = [
    {
        accessorKey: "nombre_lista",
        header: "Nombre de la Lista",
    },
    {
        accessorKey: "cantidad_postulantes",
        header: "Cantidad de Postulantes",
    },
    {
        accessorKey: "fecha_creacion",
        header: "Fecha de Creación",
    },
    {
        accessorKey: "estado",
        header: "Estado",
    },
    {
        accessorKey: "codigo",
        header: "Código",
    },
];
