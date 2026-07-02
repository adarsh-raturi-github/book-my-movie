import { Permission, Role } from "../enums";
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  permissions: Permission[];
  role: Role;
}
