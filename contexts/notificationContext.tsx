import React, { createContext, useContext, ReactNode } from "react";

interface NotificationContextProps {
  successNotification: (title: string, message: string) => void;
  errorNotification: (title: string, message: string) => void;
  infoNotification: (title: string, message: string) => void;
  warningNotification: (title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  // Funções mock para evitar erro de build
  const successNotification = (title: string, message: string) => {
    // Aqui você pode integrar com seu sistema de toast/notification
    console.log(`SUCCESS: ${title} - ${message}`);
  };
  const errorNotification = (title: string, message: string) => {
    console.error(`ERROR: ${title} - ${message}`);
  };
  const infoNotification = (title: string, message: string) => {
    console.info(`INFO: ${title} - ${message}`);
  };
  const warningNotification = (title: string, message: string) => {
    console.warn(`WARNING: ${title} - ${message}`);
  };

  return (
    <NotificationContext.Provider
      value={{
        successNotification,
        errorNotification,
        infoNotification,
        warningNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification deve ser usado dentro de um NotificationProvider"
    );
  }
  return context;
};
