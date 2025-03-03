import React from 'react';
import styles from './label.module.css';

export function Label({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement> ) {
  return (
    <label className={styles.label} {...props}>
      {children}
    </label>
  );
}

