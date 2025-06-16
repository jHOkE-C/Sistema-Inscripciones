import type { Responsable } from "@/models/interfaces/consultar-estado.types";

interface ResponsableData {
    responsable: Responsable;
}

interface Data {
    data: ResponsableData;
}

export const useResponsableCardViewModel = ({ data }: Data) => {
    const { responsable } = data;

    return {
        responsable
    };
}; 