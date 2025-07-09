"use client"
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextProps {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  successNotification: (title: string, message?: string, options?: Partial<Notification>) => string;
  errorNotification: (title: string, message?: string, options?: Partial<Notification>) => string;
  warningNotification: (title: string, message?: string, options?: Partial<Notification>) => string;
  infoNotification: (title: string, message?: string, options?: Partial<Notification>) => string;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
  maxNotifications?: number;
  defaultDuration?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 5,
  defaultDuration = 5000,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>): string => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? defaultDuration,
    };

    setNotifications(prev => {
      // Remove notificações com o mesmo título antes de adicionar a nova
      const filtered = prev.filter(n => n.title !== newNotification.title);
      const updated = [newNotification, ...filtered];
      // Mantém apenas as últimas notificações até maxNotifications
      return updated.slice(0, maxNotifications);
    });

    // Auto-remove notification after duration (unless persistent)
    if (!notification.persistent && newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, [defaultDuration, maxNotifications]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const successNotification = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'success',
      title,
      message: message || '',
      ...options,
    });
  }, [addNotification]);

  const errorNotification = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'error',
      title,
      message: message || '',
      ...options,
    });
  }, [addNotification]);

  const warningNotification = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'warning',
      title,
      message: message || '',
      ...options,
    });
  }, [addNotification]);

  const infoNotification = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'info',
      title,
      message: message || '',
      ...options,
    });
  }, [addNotification]);

  // Garante que apenas uma notificação por título seja renderizada
  const uniqueNotifications = React.useMemo(() => {
    const seenTitles = new Set<string>();
    return notifications.filter((notification) => {
      if (seenTitles.has(notification.title)) return false;
      seenTitles.add(notification.title);
      return true;
    });
  }, [notifications]);

  const value: NotificationContextProps = {
    notifications: uniqueNotifications,
    addNotification,
    removeNotification,
    clearAll,
    successNotification,
    errorNotification,
    warningNotification,
    infoNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 