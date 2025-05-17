import { Role } from "./user";

export enum OperationLog {
  SUCCESS = "✅ - [SUCCESS]",
  ERROR = "❌ - [ERROR]",
  PROCESSING = "🔄️ - [PROCESSING]",
  INFO = "❕ - [INFO]",
  WARNING = "⚠️ - [WARNING]",
}

export type ResponseError = {
  error: string;
  statusCode: number;
};

export type DecodedToken = {
  email: string;
  password: string;
  role:Role;
  id: string;
  iat: number;
  exp: number;
};


export type AnimalPagination = { 
  currentPage: number; 
  totalPages: number; 
  totalItems: number; 
  totalAnimals:number;
  animals: Animal[]; 
}


export interface Animal {
  codeAnimal: string;
  _id:string;
  specie:string;
  birthDate: Date;
  gender: "M" | "F";
  matriz_code: string;
  tankId:string;
}

export interface Tank {
  _id: string;
  name:string;
  capacity: number;
  size:{
      width: number;
      height: number;
  }
  fishManagerId:string;
  animals?: Animal[];
}

export type FishManager = {
    _id:string;
    name:string;
    description:string;
    userRequireApprove:string[];
    users:string[];
    createdAt:Date;
    ownerId:string;
    updatedAt:Date;
}

export type Specie = {
  _id:string;
  name:string;
  quantity:number;
  description:string;
  color:string;
}