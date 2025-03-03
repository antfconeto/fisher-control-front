import React from 'react';
import styles from './inputDefault.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export function InputDefault({ icon, ...props }: InputProps) {
  return (
    <div className={styles.inputWrapper}>
      {icon && <span className={styles.inputIcon}>{icon}</span>}
      <input className={styles.input} {...props} />
    </div>
  );
}

