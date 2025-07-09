"use client";
import React from 'react';
import { useNotification } from '@/contexts/notificationContext';
import { NotificationToast } from '../NotificationToast';
import styles from './NotificationContainer.module.css';

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
}; 