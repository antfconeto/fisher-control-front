import React from 'react';
import styles from './Card.module.css';

interface CardProps extends React.AllHTMLAttributes<HTMLDivElement>{
  children: React.ReactNode;
}
interface ErrorCardProps extends React.AllHTMLAttributes<HTMLDivElement>{
  error:string;
  statusCode:number;
}

export function Card({ children, ...props }: CardProps) {
  return <div className={styles.card} {...props}>{children}</div>;
}

export function CardHeader({ children, ...props }: CardProps) {
  return <div className={styles.cardHeader} {...props}>{children}</div>;
}

export function CardContent({ children, ...props }: CardProps) {
  return <div className={styles.cardContent} {...props}>{children}</div>;
}

export function CardFooter({ children, ...props }: CardProps) {
  return <div className={styles.cardFooter} {...props}>{children}</div>;
}

export function CardTitle({ children, ...props }: CardProps) {
  return <h2 className={styles.cardTitle} {...props}>{children}</h2>;
}

export function ErrorCard ({ error, statusCode, ...props }:ErrorCardProps) {
  return (
    <div className={styles.cardError} {...props}>
      <h3 className={styles.cardErrorTitle}>Erro: {statusCode}</h3>
      <div className={styles.cardErrorDescription}>
      <h3 className={styles.cardErrorSubTitle}>Description Error:</h3>
      <p className={styles.errorMessage}>{error}</p>
      </div>
    </div>
  );
};

