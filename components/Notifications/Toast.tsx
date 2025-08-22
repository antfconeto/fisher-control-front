'use client';
import React, { useEffect, useState } from 'react';
import { NotificationItem, useNotification } from '@/contexts/notificationContext';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import styles from './Toast.module.css';

interface ToastProps {
  notification: NotificationItem;
}

export const Toast = ({ notification }: ToastProps) => {
  const { removeNotification } = useNotification();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      removeNotification(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className={styles.icon} />;
      case 'error':
        return <AlertCircle className={styles.icon} />;
      case 'warning':
        return <AlertTriangle className={styles.icon} />;
      case 'info':
        return <Info className={styles.icon} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`${styles.toast} ${styles[notification.type]} ${
        isVisible ? styles.visible : ''
      }`}
    >
      <div className={styles.content}>
        {getIcon()}
        <div className={styles.textContent}>
          <h4 className={styles.title}>{notification.title}</h4>
          <p className={styles.message}>{notification.message}</p>
        </div>
      </div>
      <button onClick={handleClose} className={styles.closeButton}>
        <X size={16} />
      </button>
    </div>
  );
};
