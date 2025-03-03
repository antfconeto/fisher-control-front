import { jwtDecode } from "jwt-decode";
import { CustomConsole } from "./customLogger";
import { DecodedToken } from "@/types/types";
import { CustomError } from "./customError";
const consoler = new CustomConsole()
export const decodeToken = (token: string): DecodedToken => {
    try {
      const decoded:DecodedToken = jwtDecode(token);
      return decoded;
    } catch (error:any) {
      consoler.error(` Error to decode token erro: ${error.message}`);
      throw new CustomError(` Error to decode token erro: ${error.message}`, error.statusCode || 500)
    }
  };

  export const isTokenExpirated = (token:string):boolean=>{
    const decoded = decodeToken(token)
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      consoler.warn(" Expirated token!");
      return true;
    }
    return false
  }