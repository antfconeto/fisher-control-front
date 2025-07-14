import React from "react";
import styles from "@/components/Forms/ConfirmModal/ConfirmModal.module.css";
import { FaTimes } from "react-icons/fa";

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  isSubmitting = false,
}) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button
            className={styles.modalCloseButton}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <FaTimes />
          </button>
        </div>
        <div className={styles.modalBody}>
          <p>{message}</p>
        </div>
        <div className={styles.modalFooter}>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            className={styles.confirmButton}
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Excluindo..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
};
