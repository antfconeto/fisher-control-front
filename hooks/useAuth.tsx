"use client"
import React, { createContext, ReactNode, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types/types";
import { CustomConsole } from "@/utils/customLogger";

const logger = new CustomConsole();

export interface AuthContextProps {
  token: string | null;
  user: DecodedToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshToken: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp ? decoded.exp < currentTime : true;
    } catch (error) {
      logger.error(`Error checking token expiration: ${error}`);
      return true;
    }
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        
        if (storedToken && !isTokenExpired(storedToken)) {
          const decoded = jwtDecode<DecodedToken>(storedToken);
          setToken(storedToken);
          setUser(decoded);
          logger.info('User authenticated from stored token');
        } else if (storedToken) {
          // Token is expired, remove it
          localStorage.removeItem('authToken');
          logger.warn('Expired token removed from storage');
        }
      } catch (error) {
        logger.error(`Error initializing auth state: ${error}`);
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (newToken: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(newToken);
      
      if (isTokenExpired(newToken)) {
        throw new Error('Token is expired');
      }

      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(decoded);
      logger.info('User logged in successfully');
    } catch (error) {
      logger.error(`Error during login: ${error}`);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    logger.info('User logged out');
  };

  const refreshToken = () => {
    // This would typically make an API call to refresh the token
    // For now, we'll just check if the current token is still valid
    if (token && !isTokenExpired(token)) {
      logger.info('Token is still valid');
      return;
    }
    
    logger.warn('Token needs refresh or is invalid');
    logout();
  };

  const value: AuthContextProps = {
    token,
    user,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default useAuth;
