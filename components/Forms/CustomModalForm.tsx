import React from "react";
import { FaTimes } from "react-icons/fa";
import styles from "./CustomModalForm.module.css";

export interface CustomFormField {
  name: string;
  label: string;
  type: "text" | "date" | "select" | "number" | "email";
  value: any;
  placeholder?: string;
  options?: { label: string; value: string }[]; // para select
  onChange: (value: any) => void;
  disabled?: boolean;
}

interface CustomModalFormProps {
  title: string;
  fields: CustomFormField[];
  onSubmit: () => void;
  onClose: () => void;
  infoBox?: React.ReactNode; // permite passar JSX para a caixinha de informações
  isSubmitting?: boolean;
}

export const CustomModalForm: React.FC<CustomModalFormProps> = ({
  title,
  fields,
  onSubmit,
  onClose,
  infoBox,
  isSubmitting = false,
}) => {
  // Verifica se todos os campos estão desabilitados (modo visualização)
  const isViewMode = fields.every((field) => field.disabled);
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button
            className={styles.modalCloseButton}
            onClick={onClose}
            disabled={isSubmitting}
          >
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalBody}>
          {fields.map((field) => (
            <div key={field.name} className={styles.formGroup}>
              <label className={styles.formLabel}>{field.label}</label>
              {field.type === "select" ? (
                <select
                  className={styles.formInput}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={field.disabled || isSubmitting}
                >
                  <option value="">Selecione</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  className={styles.formInput}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={field.placeholder}
                  disabled={field.disabled || isSubmitting}
                />
              )}
            </div>
          ))}

          {infoBox && <div className={styles.infoBox}>{infoBox}</div>}
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isSubmitting}
          >
            <FaTimes /> {isViewMode ? "Fechar" : "Cancelar"}
          </button>
          {!isViewMode && (
            <button
              className={styles.saveButton}
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
