export type User = {
  id: number;
  createdAt: number | Date;
  updatedAt: number | Date;
  name: string;
  email: string;
  role: string;
  status: string;
  password: string;
};
export class SanitizedUser {
  createdAt: number;
  updatedAt: number;
  name: string;
  email: string;
  role: string;
  status: string;
  constructor(user: User) {
    this.createdAt = +user.createdAt;
    this.updatedAt = +user.updatedAt;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.status = user.status;
  }
}
