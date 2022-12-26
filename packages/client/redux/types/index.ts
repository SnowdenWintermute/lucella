export interface IUser {
  name: string;
  email: string;
  role: string;
  token: string;
  _id: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface IGenericResponse {
  status: string;
  message: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
