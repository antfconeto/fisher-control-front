"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

interface LoadingContextProps {
  loadingState: LoadingState;
  setLoading: (isLoading: boolean, message?: string) => void;
  setProgress: (progress: number) => void;
  clearLoading: () => void;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: undefined,
    progress: undefined,
  });

  const setLoading = useCallback((isLoading: boolean, message?: string) => {
    setLoadingState(prev => ({
      ...prev,
      isLoading,
      message: isLoading ? message : undefined,
      progress: isLoading ? prev.progress : undefined,
    }));
  }, []);

  const setProgress = useCallback((progress: number) => {
    setLoadingState(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress)),
    }));
  }, []);

  const clearLoading = useCallback(() => {
    setLoadingState({
      isLoading: false,
      message: undefined,
      progress: undefined,
    });
  }, []);

  const value: LoadingContextProps = {
    loadingState,
    setLoading,
    setProgress,
    clearLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}; 