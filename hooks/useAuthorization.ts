import { useAuth } from "@/contexts/authContext";
import { Role } from "@/types/user";
import { hasRole, isAdmin, isViewer } from "@/utils/authUtils";
import { useUser } from "./userHook";

/**
 * Hook personalizado para verificação de autorização
 * Pode ser usado tanto no cliente quanto no servidor
 */
export const useAuthorization = () => {
  const { user } = useUser();

  return {
    /**
     * Verifica se o usuário tem a role especificada
     */
    hasRole: (requiredRole: Role) => hasRole(user, requiredRole),
    
    /**
     * Verifica se o usuário é administrador
     */
    isAdmin: () => isAdmin(user),
    
    /**
     * Verifica se o usuário é viewer
     */
    isViewer: () => isViewer(user),
    
    /**
     * Retorna a role atual do usuário
     */
    currentRole: user?.role || null,
    
    /**
     * Retorna se o usuário está autenticado
     */
    isAuthenticated: !!user,
  };
};

/**
 * Hook específico para verificar se o usuário é admin
 */
export const useAdminAuth = () => {
  const { user } = useUser();
  return isAdmin(user);
};

/**
 * Hook específico para verificar se o usuário é viewer
 */
export const useViewerAuth = () => {
  const { user } = useUser();
  return isViewer(user);
}; 