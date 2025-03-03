import { ResponseError } from "@/types/types";

export class CustomError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number, errorResponse?:ResponseError) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  