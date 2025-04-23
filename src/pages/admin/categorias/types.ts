export interface Area {
  id: number;
  nombre: string;
}

export interface Category {
  id: number;
  nombre: string;
  minimo_grado: number;
  maximo_grado: number;
  areas: Area[];
  vigente: boolean;
}
