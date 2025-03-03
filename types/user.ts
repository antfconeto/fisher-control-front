export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  role: Role
  createdAt: Date;
  updatedAt: Date;
}


export type UserCredentials = {
  email: string;
  password: string
}

export type UserLoginResponse = {
  token: string,
  user: User
}

export enum Role {
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
}