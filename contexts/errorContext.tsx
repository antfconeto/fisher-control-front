"use client";
import React, { createContext, ReactNode, useContext } from "react";
import { useError, ErrorHook } from "@/hooks/useError";

const ErrorContext = createContext<ErrorHook | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const error = useError();

  return (
    <ErrorContext.Provider value={error}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = (): ErrorHook => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useErrorContext must be used within an ErrorProvider");
  }
  return context;
};