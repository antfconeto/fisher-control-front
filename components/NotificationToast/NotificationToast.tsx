"use client";
import React, { useEffect, useState } from 'react';
import { useNotification, Notification } from '@/contexts/notificationContext';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import styles from './NotificationToast.module.css';

interface NotificationToastProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Animar entrada
    setIsVisible(true);

    // Progress bar
    if (notification.duration && notification.duration > 0) {
      const startTime = Date.now();
      const endTime = startTime + notification.duration;

      const updateProgress = () => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        const newProgress = (remaining / notification.duration) * 100;
        setProgress(newProgress);

        if (remaining > 0) {
          requestAnimationFrame(updateProgress);
        }
      };

      requestAnimationFrame(updateProgress);
    }
  }, [notification.duration]);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(notification.id), 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getTypeClass = () => {
    switch (notification.type) {
      case 'success':
        return styles.success;
      case 'error':
        return styles.error;
      case 'warning':
        return styles.warning;
      case 'info':
        return styles.info;
      default:
        return styles.info;
    }
  };

  return (
    <div className={`${styles.notification} ${getTypeClass()} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          {getIcon()}
        </div>
        <div className={styles.content}>
          <h4 className={styles.title}>{notification.title}</h4>
          <p className={styles.message}>{notification.message}</p>
        </div>
        <button className={styles.closeButton} onClick={handleRemove}>
          <X size={16} />
        </button>
      </div>
      
      {notification.duration && notification.duration > 0 && (
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationToast; 