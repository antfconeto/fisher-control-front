'use client';
import React from 'react';
import { useNotification } from '@/contexts/notificationContext';
import { Toast } from './Toast';
import styles from './ToastContainer.module.css';

export const ToastContainer = () => {
  const { notifications } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {notifications.map((notification) => (
        <Toast key={notification.id} notification={notification} />
      ))}
    </div>
  );
};
