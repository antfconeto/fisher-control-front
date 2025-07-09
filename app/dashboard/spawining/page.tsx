"use client";
import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { FaFish, FaEgg, FaChartLine, FaWater } from "react-icons/fa";
import SpeciesCard from "./components/SpeciesCard";
import styles from "./spawn.module.css";

// Dados mockados para demonstração
const mockSpeciesData = [
  {
    id: "1",
    name: "Tilápia",
    spawningCount: 12,
    lastSpawningDate: "15/12/2024",
    successRate: 85,
    totalEggs: 45000,
  },
  {
    id: "2",
    name: "Tambaqui",
    spawningCount: 8,
    lastSpawningDate: "10/12/2024",
    successRate: 78,
    totalEggs: 32000,
  },
  {
    id: "3",
    name: "Pacu",
    spawningCount: 6,
    lastSpawningDate: "08/12/2024",
    successRate: 92,
    totalEggs: 28000,
  },
  {
    id: "4",
    name: "Pirarucu",
    spawningCount: 3,
    lastSpawningDate: "05/12/2024",
    successRate: 65,
    totalEggs: 15000,
  },
  {
    id: "5",
    name: "Matrinxã",
    spawningCount: 9,
    lastSpawningDate: "12/12/2024",
    successRate: 88,
    totalEggs: 38000,
  },
  {
    id: "6",
    name: "Pintado",
    spawningCount: 5,
    lastSpawningDate: "03/12/2024",
    successRate: 75,
    totalEggs: 22000,
  },
];

export default function SpawningPage() {
  const [loading, setLoading] = useState(true);
  const [speciesData] = useState(mockSpeciesData);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const totalSpawns = speciesData.reduce(
    (sum, specie) => sum + specie.spawningCount,
    0
  );
  const totalEggs = speciesData.reduce(
    (sum, specie) => sum + specie.totalEggs,
    0
  );

  if (loading) {
    return (
      <div className="page-container">
        <div className="content-container">
          <div className="content-card">
            <div className={styles.loadingContainer}>
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
                <p className={styles.loadingText}>
                  Carregando dados das desovas...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-container">
        {/* Header Section */}
        <div className="content-card mb-4">
          <div className={styles.headerSection}>
            <div className={styles.headerContent}>
              <div className={styles.titleSection}>
                <div className={styles.titleIconWrapper}>
                  <FaEgg className={styles.titleIcon} />
                </div>
                <div>
                  <h1 className={styles.pageTitle}>Controle de Desovas</h1>
                  <p className={styles.pageSubtitle}>
                    Gerencie e acompanhe o processo de reprodução das espécies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="content-card mb-4">
          <div className={styles.statsSection}>
            <h3 className={styles.sectionTitle}>
              <FaChartLine className={styles.sectionIcon} />
              Visão Geral
            </h3>
            <Row className="justify-content-center g-4">
              <Col lg={4} md={6} sm={6} className="mb-3">
                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <FaEgg className={styles.statIcon} />
                  </div>
                  <div className={styles.statContent}>
                    <h4 className={styles.statValue}>{totalSpawns}</h4>
                    <p className={styles.statLabel}>Total de Desovas</p>
                  </div>
                </div>
              </Col>

              <Col lg={4} md={6} sm={6} className="mb-3">
                <div className={styles.statCard}>
                  <div
                    className={`${styles.statIconWrapper} ${styles.infoIcon}`}
                  >
                    <FaFish className={styles.statIcon} />
                  </div>
                  <div className={styles.statContent}>
                    <h4 className={styles.statValue}>{speciesData.length}</h4>
                    <p className={styles.statLabel}>Espécies</p>
                  </div>
                </div>
              </Col>

              <Col lg={4} md={6} sm={6} className="mb-3">
                <div className={styles.statCard}>
                  <div
                    className={`${styles.statIconWrapper} ${styles.warningIcon}`}
                  >
                    <FaWater className={styles.statIcon} />
                  </div>
                  <div className={styles.statContent}>
                    <h4 className={styles.statValue}>
                      {(totalEggs / 1000).toFixed(0)}k
                    </h4>
                    <p className={styles.statLabel}>Total de Ovos</p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* Species Section */}
        <div className="content-card">
          <div className={styles.speciesSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}>
                  <FaFish className={styles.sectionIcon} />
                  Desovas por Espécie
                </h3>
                <p className={styles.sectionDescription}>
                  Clique em uma espécie para ver o histórico completo ou criar
                  uma nova desova
                </p>
              </div>
            </div>

            <div className={styles.speciesGrid}>
              {speciesData.map((specie) => (
                <SpeciesCard key={specie.id} specie={specie} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
