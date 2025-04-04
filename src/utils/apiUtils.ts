interface Values {
    [key: string]: string | number | boolean;
}
import { API_URL } from "@/hooks/useApiRequest";
import type { ListaPostulantes } from "@/pages/inscribir/columns";

interface UuidValues {
    [key: string]: string | number | boolean;
}

export const getUuid = async (values: UuidValues): Promise<string> => {
    console.log("Enviando datos...", values);

    return "12345678-uuid";
};

// Removed unused interface InscripcionValues

export const getInscripcion = async (): Promise<string> => {
    return "";
};

export const postDataPostulante = async (values: Values): Promise<void> => {
    console.log("Formulario enviado con datos:", values);
};

export interface Area {
    id: string;
    nombre: string;
}

export const getAreaPorGrado = async (grado: string): Promise<Area[]> => {
    try {
        const response = await fetch(
            API_URL + "/api/curso/" + grado + "/areas"
        );
        if (!response.ok) {
            console.error(`Error al obtener areas`);
        } else {
            const data: Area[] = await response.json();
            console.log("areas", data);
            return data;
        }
    } catch (error) {
        console.error(`Error en areas:`, error);
    }
    return [];
};

export const crearListaPostulante = async (data: { nombre: string }) => {
    return data;
};

export const getListasPostulantes = async (
    uuid: string
): Promise<ListaPostulantes[]> => {
    console.log("UUID:", uuid);
    return [];
};
