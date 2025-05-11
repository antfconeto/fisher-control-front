"use client";
import { getUserData } from "@/actions/getUserData";
import { useRequest } from "@/hooks/useRequest";
import { User } from "@/types/user";
import { CustomConsole } from "@/utils/customLogger";
import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
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
  const {errorMessage,setErrorMessage} = useErrorContext()
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
     setErrorMessage(error.message || 'Erro Desconhecido')
    }
  };
  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
