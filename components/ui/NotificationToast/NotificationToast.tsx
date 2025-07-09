"use client";
import React, { useEffect, useState } from 'react';
import { Notification } from '@/contexts/notificationContext';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Button } from '../Button';
import styles from './NotificationToast.module.css';

interface NotificationToastProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ 
  notification, 
  onRemove 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Animate entrance
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!notification.duration || notification.persistent) return;

    let animationFrame: number;
    let startTime: number;

    const updateProgress = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      
      if (!isPaused) {
        const elapsed = currentTime - startTime;
        const remaining = Math.max(0, notification.duration! - elapsed);
        const newProgress = (remaining / notification.duration!) * 100;
        
        setProgress(newProgress);

        if (remaining > 0) {
          animationFrame = requestAnimationFrame(updateProgress);
        } else {
          handleRemove();
        }
      } else {
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [notification.duration, notification.persistent, isPaused]);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(notification.id), 300);
  };

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  const getIcon = () => {
    const iconProps = { size: 20, className: styles.icon };
    
    switch (notification.type) {
      case 'success':
        return <CheckCircle {...iconProps} />;
      case 'error':
        return <XCircle {...iconProps} />;
      case 'warning':
        return <AlertTriangle {...iconProps} />;
      case 'info':
        return <Info {...iconProps} />;
      default:
        return <Info {...iconProps} />;
    }
  };

  const getTypeClass = () => {
    return styles[notification.type];
  };

  return (
    <div 
      className={`${styles.notification} ${getTypeClass()} ${isVisible ? styles.visible : ''}`}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
    >
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          {getIcon()}
        </div>
        
        <div className={styles.content}>
          <h4 className={styles.title}>{notification.title}</h4>
          {notification.message && (
            <p className={styles.message}>{notification.message}</p>
          )}
        </div>
        
        <div className={styles.actions}>
          {notification.action && (
            <Button
              variant="light"
              size="sm"
              onClick={notification.action.onClick}
              className={styles.actionButton}
            >
              {notification.action.label}
            </Button>
          )}
          
          <button 
            className={styles.closeButton} 
            onClick={handleRemove}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {notification.duration && notification.duration > 0 && !notification.persistent && (
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