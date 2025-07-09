import React from "react";
import { jsPDF } from "jspdf";
import styles from "../spawn.module.css";

interface SpawningDetailsProps {
  spawning: {
    id: string;
    specie: string;
    date: string;
    tank: string;
    status: string;
    totalEggs: number;
    notes?: string;
  };
}

export default function SpawningDetails({ spawning }: SpawningDetailsProps) {
  const exportPDF = () => {
    const doc = new jsPDF();

    // Cabeçalho
    doc.setFontSize(18);
    doc.text("Relatório de Desova", 14, 22);

    // Dados principais
    doc.setFontSize(12);
    doc.text(`Espécie: ${spawning.specie}`, 14, 30);
    doc.text(`Data: ${spawning.date}`, 14, 38);
    doc.text(`Tanque: ${spawning.tank}`, 14, 46);
    doc.text(`Status: ${spawning.status}`, 14, 54);
    doc.text(
      `Total de Ovos: ${(spawning.totalEggs / 1000).toFixed(0)}k`,
      14,
      62
    );

    // Observações
    if (spawning.notes) {
      doc.text(`Observações: ${spawning.notes}`, 14, 70);
    }

    doc.save(`desova_${spawning.id}.pdf`);
  };

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.detailsHeader}>
        <h2>Detalhes da Desova</h2>
        <button onClick={exportPDF} className={styles.exportButton}>
          Exportar PDF
        </button>
      </div>

      <div className={styles.detailsContent}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Espécie:</span>
          <span className={styles.detailValue}>{spawning.specie}</span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Data:</span>
          <span className={styles.detailValue}>{spawning.date}</span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Tanque:</span>
          <span className={styles.detailValue}>{spawning.tank}</span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Status:</span>
          <span className={styles.detailValue}>{spawning.status}</span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Total de Ovos:</span>
          <span className={styles.detailValue}>
            {(spawning.totalEggs / 1000).toFixed(0)}k
          </span>
        </div>

        {spawning.notes && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Observações:</span>
            <span className={styles.detailValue}>{spawning.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
}
