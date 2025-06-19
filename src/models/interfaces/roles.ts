export interface Privilege {
  id: number;
  nombre: string;
}

export interface Role {
  id: number;
  nombre: string;
  servicios: Privilege[];
}
