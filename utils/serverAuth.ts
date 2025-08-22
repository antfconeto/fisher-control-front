import { cookies } from 'next/headers';
import { decodeToken, isTokenExpired, hasRole } from './authUtils';
import { Role } from '@/types/user';
import { DecodedToken } from '@/types/types';

/**
 * Obtém o token do usuário a partir dos cookies no servidor
 * @returns string | null - Token do usuário ou null se não encontrado
 */
export const getServerToken = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    return token || null;
  } catch (error) {

    return null;
  }
};

/**
 * Obtém as informações do usuário a partir do token no servidor
 * @returns DecodedToken | null - Informações do usuário ou null se inválido
 */
export const getServerUser = async (): Promise<DecodedToken | null> => {
  try {
    const token = await getServerToken();
    if (!token) return null;

    if (isTokenExpired(token)) {

      return null;
    }

    return decodeToken(token);
  } catch (error) {

    return null;
  }
};

/**
 * Verifica se o usuário tem a role especificada no servidor
 * @param requiredRole - Role necessária para acesso
 * @returns boolean - Se o usuário tem permissão
 */
export const checkServerRole = async (requiredRole: Role): Promise<boolean> => {
  const user = await getServerUser();
  return hasRole(user, requiredRole);
};

/**
 * Verifica se o usuário é administrador no servidor
 * @returns boolean - Se o usuário é admin
 */
export const checkServerAdmin = async (): Promise<boolean> => {
  return checkServerRole(Role.ADMIN);
};

/**
 * Verifica se o usuário é viewer no servidor
 * @returns boolean - Se o usuário é viewer
 */
export const checkServerViewer = async (): Promise<boolean> => {
  return checkServerRole(Role.VIEWER);
};

/**
 * Obtém a role atual do usuário no servidor
 * @returns Role | null - Role do usuário ou null se não autenticado
 */
export const getServerUserRole = async (): Promise<Role | null> => {
  const user = await getServerUser();
  return user?.role || null;
}; 