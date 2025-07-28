"use client";

import React, { ReactNode } from "react";
import { useAuth } from "@/contexts/authContext";
import { Role } from "@/types/user";
import { hasRole } from "@/utils/authUtils";

interface AuthorizationProps {
  children: ReactNode;
  requiredRole: Role;
  fallback?: ReactNode;
}

/**
 * Componente de autorização que renderiza condicionalmente baseado na role do usuário
 * @param children - Componentes a serem renderizados se autorizado
 * @param requiredRole - Role necessária para acesso
 * @param fallback - Componente alternativo a ser renderizado se não autorizado (opcional)
 */
export const Authorization: React.FC<AuthorizationProps> = ({
  children,
  requiredRole,
  fallback = null,
}) => {
  const { user } = useAuth();

  if (hasRole(user, requiredRole)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

/**
 * Componente específico para verificar se o usuário é admin
 */
export const AdminOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback = null,
}) => {
  return (
    <Authorization requiredRole={Role.ADMIN} fallback={fallback}>
      {children}
    </Authorization>
  );
};

/**
 * Componente específico para verificar se o usuário é viewer
 */
export const ViewerOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback = null,
}) => {
  return (
    <Authorization requiredRole={Role.VIEWER} fallback={fallback}>
      {children}
    </Authorization>
  );
}; 