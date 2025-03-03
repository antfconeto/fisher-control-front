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
