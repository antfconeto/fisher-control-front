"use client"
import React, {createContext, ReactNode, useState} from "react";

export interface AuthContextProps{
    token: string | null;
    setToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [token, setToken] = useState<string | null>(null)
    return (
        <AuthContext.Provider value={{token, setToken}}>
            {children}
        </AuthContext.Provider>
    )
}