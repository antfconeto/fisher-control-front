"use client";
import React from 'react';
import { useNotification } from '@/contexts/notificationContext';
import { Loader2 } from 'lucide-react';
import styles from './GlobalLoading.module.css';

const GlobalLoading: React.FC = () => {
  const { loadingState } = useNotification();

  if (!loadingState.isLoading) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}>
          <Loader2 size={32} className={styles.spinnerIcon} />
        </div>
        
        {loadingState.message && (
          <p className={styles.message}>{loadingState.message}</p>
        )}
        
        {loadingState.progress !== undefined && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${loadingState.progress}%` }}
              />
            </div>
            <span className={styles.progressText}>
              {Math.round(loadingState.progress)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalLoading; 