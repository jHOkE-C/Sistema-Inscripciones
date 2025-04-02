interface Values {
    [key: string]: string | number | boolean;
}
import { API_URL } from "@/hooks/useApiRequest";

export const getUuid = async (values) => {
    console.log("Enviando datos...", values);

    return "12345678-uuid"
    
};

export const getInscripcion = async (values)=> {
    return ""
}


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