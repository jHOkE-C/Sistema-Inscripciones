import { type Role } from "./roles";

export interface UserData {
  id: number;
  nombre_usuario: string;
  roles: Role[];
}
