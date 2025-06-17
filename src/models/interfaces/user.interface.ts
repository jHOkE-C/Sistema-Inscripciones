import { type Role } from './role.interface';

export interface UserData {
  id: number;
  nombre_usuario: string;
  roles: Role[];
}
