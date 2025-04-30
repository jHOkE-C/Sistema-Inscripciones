

export interface Departamento {
    id: number;
    nombre: string;
    provincias: Provincia[];
}
export interface Provincia {
    departamento_id: string;
    nombre: string;
    id: number;
}
export interface Colegio {
    id: string;
    nombre: string;
}

export interface excelColumna {
    posicion: number;
    columna: string;
}

export const excelCol: excelColumna[] = [
    { "posicion": 0, "columna": "A" },
    { "posicion": 1, "columna": "B" },
    { "posicion": 2, "columna": "C" },
    { "posicion": 3, "columna": "D" },
    { "posicion": 4, "columna": "E" },
    { "posicion": 5, "columna": "F" },
    { "posicion": 6, "columna": "G" },
    { "posicion": 7, "columna": "H" },
    { "posicion": 8, "columna": "I" },
    { "posicion": 9, "columna": "J" },
    { "posicion": 10, "columna": "K" },
    { "posicion": 11, "columna": "L" },
    { "posicion": 12, "columna": "M" },
    { "posicion": 13, "columna": "N" },
    { "posicion": 14, "columna": "O" },
    { "posicion": 15, "columna": "P" },
    { "posicion": 16, "columna": "Q" },
    { "posicion": 17, "columna": "R" },
    { "posicion": 18, "columna": "S" },
    { "posicion": 19, "columna": "T" },
    { "posicion": 20, "columna": "U" },
    { "posicion": 21, "columna": "V" },
    { "posicion": 22, "columna": "W" },
    { "posicion": 23, "columna": "X" },
    { "posicion": 24, "columna": "Y" },
    { "posicion": 25, "columna": "Z" }
  ]
  