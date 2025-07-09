"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FaFish, FaPlus, FaHistory } from "react-icons/fa";
import styles from "../spawn.module.css";

interface SpeciesCardProps {
  specie: {
    id: string;
    name: string;
    spawningCount: number;
    lastSpawningDate: string;
    successRate: number;
    totalEggs: number;
  };
}

export default function SpeciesCard({ specie }: SpeciesCardProps) {
  const router = useRouter();

  return (
    <div className={styles.speciesCard}>
      {/* Top accent bar */}
      <div className={styles.speciesCardAccent} />

      {/* Header */}
      <div className={styles.speciesCardHeader}>
        <div className={styles.speciesCardIcon}>
          <FaFish />
        </div>
        <div>
          <h3 className={styles.speciesCardTitle}>{specie.name}</h3>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.speciesCardStats}>
        <div className={styles.speciesCardStat}>
          <div className={styles.speciesCardStatValue}>
            {specie.spawningCount}
          </div>
          <div className={styles.speciesCardStatLabel}>desovas registradas</div>
        </div>

        <div className={styles.speciesCardStatRow}>
          <div className={styles.speciesCardStatItem}>
            <span className={styles.speciesCardStatLabel}>
              Taxa de Sucesso:
            </span>
            <span className={styles.speciesCardStatValue}>
              {specie.successRate}%
            </span>
          </div>
          <div className={styles.speciesCardStatItem}>
            <span className={styles.speciesCardStatLabel}>Total de Ovos:</span>
            <span className={styles.speciesCardStatValue}>
              {(specie.totalEggs / 1000).toFixed(0)}k
            </span>
          </div>
        </div>

        <div className={styles.speciesCardLastDate}>
          <span>Última: {specie.lastSpawningDate}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.speciesCardActions}>
        <button
          className={styles.speciesCardButton}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/dashboard/spawining/history/${specie.id}`);
          }}
        >
          <FaHistory /> Histórico
        </button>
        <button
          className={`${styles.speciesCardButton} ${styles.primaryButton}`}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/dashboard/spawining/new?specie=${specie.name}`);
          }}
        >
          <FaPlus /> Nova Desova
        </button>
      </div>
    </div>
  );
}
