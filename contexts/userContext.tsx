"use client";
import { getUserData } from "@/actions/getUserData";
import { useRequest } from "@/hooks/useRequest";
import { User } from "@/types/user";
import { CustomConsole } from "@/utils/customLogger";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useErrorContext } from "./errorContext";

interface UserContextProps {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

// Componente UserProvider que fornece o contexto
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  //hook request
  const { data, error, loading, sendRequest } = useRequest();
  const { errorMessage, setErrorMessage } = useErrorContext();
  //consoler
  const consoler = new CustomConsole();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      if (!user) {
        consoler.process(`🔁 Quering data of user`);
        const response = await sendRequest(getUserData);
        if (response) {
          consoler.success(
            ` Getted data from user: ${(response as User).username}`
          );
          setUser(response as User);
        }
      }
    } catch (error: any) {
      consoler.error(
        `Error fetching user data: ${
          error.message || error.error || "Erro desconhecido"
        }`
      );
      // Se o erro for relacionado ao token (401, 403), não mostrar erro ao usuário
      // apenas logar para debug
      if (
        error.statusCode &&
        (error.statusCode === 401 || error.statusCode === 403)
      ) {
        consoler.warn(`Token inválido ou expirado: ${error.message}`);
        // Não definir mensagem de erro para o usuário neste caso
        return;
      }

      // Se for erro de usuário não encontrado (404), não bloquear a navegação
      if (error.statusCode === 404) {
        consoler.warn(
          `Usuário não encontrado no banco de dados: ${error.message}`
        );
        // Não definir mensagem de erro para o usuário neste caso
        return;
      }

      // Se for erro de conexão com o backend, não bloquear a navegação
      if (
        error.message &&
        (error.message.includes("fetch failed") ||
          error.message.includes("Failed to fetch"))
      ) {
        consoler.warn(`Backend não disponível: ${error.message}`);
        // Não definir mensagem de erro para o usuário neste caso
        return;
      }

      setErrorMessage(
        error.message || error.error || "Erro ao carregar dados do usuário"
      );
    }
  };
  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
