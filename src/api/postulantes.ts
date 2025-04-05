import type { ListaPostulantes } from "@/pages/inscribir/columns";

interface Values {
    [key: string]: string | number | boolean;
}

export const postDataPostulante = async (values: Values): Promise<void> => {
    console.log("Formulario enviado con datos:", values);
};

export const getListasPostulantes = async (
    uuid: string
): Promise<ListaPostulantes[]> => {
  console.log("UUID:", uuid);
  return [
      {
          cantidad_postulantes: 3,
          id: 1,
          nombre_lista: "Lista 1",
          codigo: "af5ds16s",
          estado: "PENDIENTE",
          fecha_creacion: new Date(),
      },
      {
          cantidad_postulantes: 5,
          id: 2,
          nombre_lista: "Lista 2",
          codigo: "fdsaf15s",
          estado: "PENDIENTE",
          fecha_creacion: new Date(),
      },
      {
          cantidad_postulantes: 10,
          id: 3,
          nombre_lista: "Lista 3",
          codigo: "af5ds16s",
          estado: "PENDIENTE",
          fecha_creacion: new Date(),
      },
  ];
};

export const crearListaPostulante = async (data: {
    uuid: string;
    nombre: string;
}) => {
    console.log(data);
    return data;
};
