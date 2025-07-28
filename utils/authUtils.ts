import { Role } from "@/types/user";
import { DecodedToken } from "@/types/types";
import { jwtDecode } from "jwt-decode";
import { CustomConsole } from "./customLogger";
import { CustomError } from "./customError";
const consoler = new CustomConsole()

/**
 * Verifica se o usuário tem a role especificada
 * @param user - Objeto do usuário com role
 * @param requiredRole - Role necessária para acesso
 * @returns boolean indicando se o usuário tem permissão
 */
export const hasRole = (user: DecodedToken | null, requiredRole: Role): boolean => {
  if (!user) return false;
  return user.role === requiredRole;
};

/**
 * Verifica se o usuário é administrador
 * @param user - Objeto do usuário
 * @returns boolean indicando se o usuário é admin
 */
export const isAdmin = (user: DecodedToken | null): boolean => {
  return hasRole(user, Role.ADMIN);
};

/**
 * Verifica se o usuário é viewer
 * @param user - Objeto do usuário
 * @returns boolean indicando se o usuário é viewer
 */
export const isViewer = (user: DecodedToken | null): boolean => {
  return hasRole(user, Role.VIEWER);
};

/**
 * Decodifica o token JWT e retorna as informações do usuário
 * Pode ser usado no servidor
 * @param token - Token JWT
 * @returns DecodedToken ou null se inválido
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
};

/**
 * Verifica se o token está expirado
 * @param token - Token JWT
 * @returns boolean indicando se o token está expirado
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp ? decoded.exp < currentTime : true;
  } catch (error) {
    console.error("Erro ao verificar expiração do token:", error);
    return true;
  }
};

  export const isTokenExpirated = (token:string):boolean=>{
    const decoded = decodeToken(token)
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded!.exp && decoded!.exp < currentTime) {
      consoler.warn(" Expirated token!");
      return true;
    }
    return false
  }