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
  animals?: Animal[];
}

export type Specie = {
  _id:string;
  name:string;
  quantity:number;
  description:string;
  color:string;
}

export interface SpawningForm {
  _id?: string;
  date: Date;
  animal_weight: {
      beforeSpawn: number;
      afterSpawn: number;
  };
  egg_weight: number;
  hormone: {
      hour_dosage: string;
      quantity: number;
  };
  monitoring: Monitoring[]
  animalId: string;
  user: {
    id:string;
    name:string;
  };

}

export type Monitoring = {
  hour: string;
  temperature: number;
  hour_degree: number;
}