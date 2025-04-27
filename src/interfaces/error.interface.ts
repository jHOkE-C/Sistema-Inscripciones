export type ValidationError = {
    campo: string;
    fila: number;
    ci: string;
    mensaje: string;
};
export interface ErroresDeFormato {
    fila: number;
    columna: string;
    mensaje: string;
    hoja: number;
    campo: string;
};