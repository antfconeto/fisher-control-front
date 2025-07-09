"use client";
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Table, Badge } from "react-bootstrap";
import {
  FaArrowLeft,
  FaEye,
  FaEdit,
  FaTrash,
  FaFish,
  FaChartLine,
  FaPlus,
  FaWater,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import styles from "../../spawn.module.css";

// Dados mockados para demonstração
const mockSpecieData = {
  id: "1",
  name: "Tilápia",
  totalSpawns: 12,
  totalEggs: 450000,
  successRate: 85,
};

const mockSpawningHistory = [
  {
    id: "1",
    date: "15/12/2024",
    tank: "Tanque A1",
    breeders: "5 machos, 8 fêmeas",
    status: "Concluída",
    totalEggs: 45000,
    notes: "Desova induzida com sucesso",
    hormone: "HCG",
    dose: "500 UI/kg",
    temperature: "28°C",
    ph: "7.2",
  },
  {
    id: "2",
    date: "05/12/2024",
    tank: "Tanque A2",
    breeders: "6 machos, 9 fêmeas",
    status: "Concluída",
    totalEggs: 52000,
    notes: "Desova natural",
    hormone: "Natural",
    dose: "-",
    temperature: "27°C",
    ph: "7.0",
  },
  {
    id: "3",
    date: "25/11/2024",
    tank: "Tanque A1",
    breeders: "4 machos, 7 fêmeas",
    status: "Concluída",
    totalEggs: 38000,
    notes: "Excelente resultado",
    hormone: "HCG",
    dose: "600 UI/kg",
    temperature: "29°C",
    ph: "7.1",
  },
  {
    id: "4",
    date: "15/11/2024",
    tank: "Tanque A2",
    breeders: "5 machos, 8 fêmeas",
    status: "Concluída",
    totalEggs: 42000,
    notes: "Resultado satisfatório",
    hormone: "HCG",
    dose: "500 UI/kg",
    temperature: "28°C",
    ph: "7.3",
  },
  {
    id: "5",
    date: "05/11/2024",
    tank: "Tanque A1",
    breeders: "3 machos, 6 fêmeas",
    status: "Concluída",
    totalEggs: 35000,
    notes: "Melhor resultado do mês",
    hormone: "HCG",
    dose: "550 UI/kg",
    temperature: "28°C",
    ph: "7.2",
  },
  {
    id: "6",
    date: "25/10/2024",
    tank: "Tanque A2",
    breeders: "4 machos, 7 fêmeas",
    status: "Concluída",
    totalEggs: 41000,
    notes: "Bom resultado",
    hormone: "HCG",
    dose: "500 UI/kg",
    temperature: "28°C",
    ph: "7.1",
  },
  {
    id: "7",
    date: "15/10/2024",
    tank: "Tanque A1",
    breeders: "5 machos, 8 fêmeas",
    status: "Concluída",
    totalEggs: 48000,
    notes: "Resultado regular",
    hormone: "HCG",
    dose: "450 UI/kg",
    temperature: "27°C",
    ph: "7.0",
  },
  {
    id: "8",
    date: "05/10/2024",
    tank: "Tanque A2",
    breeders: "3 machos, 6 fêmeas",
    status: "Concluída",
    totalEggs: 36000,
    notes: "Excelente fertilização",
    hormone: "HCG",
    dose: "600 UI/kg",
    temperature: "29°C",
    ph: "7.2",
  },
  {
    id: "9",
    date: "25/09/2024",
    tank: "Tanque A1",
    breeders: "4 machos, 7 fêmeas",
    status: "Concluída",
    totalEggs: 39000,
    notes: "Resultado satisfatório",
    hormone: "HCG",
    dose: "500 UI/kg",
    temperature: "28°C",
    ph: "7.1",
  },
  {
    id: "10",
    date: "15/09/2024",
    tank: "Tanque A2",
    breeders: "5 machos, 8 fêmeas",
    status: "Concluída",
    totalEggs: 44000,
    notes: "Bom desempenho",
    hormone: "HCG",
    dose: "550 UI/kg",
    temperature: "28°C",
    ph: "7.3",
  },
];

// Dados para gráficos
const pieData = [
  { name: "Concluída", value: 10, color: "#28a745" },
  { name: "Em Andamento", value: 0, color: "#ffc107" },
  { name: "Cancelada", value: 0, color: "#dc3545" },
];

// Gerar chartData dinamicamente
type Spawning = {
  id: string;
  date: string;
  tank: string;
  breeders: string;
  status: string;
  totalEggs: number;
  notes: string;
  hormone: string;
  dose: string;
  temperature: string;
  ph: string;
};

function getMonthlyChartData(
  spawningHistory: Spawning[]
): { month: string; spawns: number }[] {
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const counts: Record<string, number> = {};
  spawningHistory.forEach((spawn: Spawning) => {
    const [, month, year] = spawn.date.split("/");
    const key = `${months[parseInt(month, 10) - 1]}/${year}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  // Ordenar por ano/mês decrescente
  const sortedKeys = Object.keys(counts).sort((a, b) => {
    const [ma, ya] = a.split("/");
    const [mb, yb] = b.split("/");
    if (ya !== yb) return Number(yb) - Number(ya);
    return months.indexOf(mb) - months.indexOf(ma);
  });
  return sortedKeys.map((key) => ({ month: key, spawns: counts[key] }));
}

export default function SpecieHistoryPage() {
  const router = useRouter();
  const params = useParams();
  const specieId = params.specieId as string;

  const [loading, setLoading] = useState(true);
  const [specieData] = useState(mockSpecieData);
  const [spawningData] = useState(mockSpawningHistory);
  const chartData = getMonthlyChartData(spawningData);

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Cálculos de paginação
  const totalPages = Math.ceil(spawningData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSpawns = spawningData.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Concluída":
        return <Badge bg="success">{status}</Badge>;
      case "Em Andamento":
        return (
          <Badge bg="warning" text="dark">
            {status}
          </Badge>
        );
      case "Cancelada":
        return <Badge bg="danger">{status}</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

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
                  Carregando histórico da espécie...
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
          <div
            className={`${styles.headerSection} ${styles.specificationPage}`}
          >
            <div className={styles.headerContent}>
              <div className={styles.titleSection}>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => router.back()}
                  className={styles.backButton}
                >
                  <FaArrowLeft /> Voltar
                </Button>
                <div className={styles.titleIconWrapper}>
                  <FaFish className={styles.titleIcon} />
                </div>
                <div>
                  <h1 className={styles.pageTitle}>{specieData.name}</h1>
                  <p className={styles.pageSubtitle}>Histórico de Desovas</p>
                </div>
              </div>
              <Button
                variant="primary"
                className={styles.createButton}
                onClick={() =>
                  router.push(`/dashboard/spawining/new?specie=${specieId}`)
                }
              >
                <FaPlus /> Nova Desova
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="content-card mb-4">
          <div
            className={`${styles.statsSection} ${styles.specificationPage}`}
            style={{ textAlign: "center" }}
          >
            <h3 className={styles.sectionTitle}>
              <FaChartLine className={styles.sectionIcon} />
              Estatísticas da Espécie
            </h3>
            <Row className="justify-content-center g-4">
              <Col lg={3} md={6} sm={6} className="mb-3">
                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <FaFish className={styles.statIcon} />
                  </div>
                  <div className={styles.statContent}>
                    <h4 className={styles.statValue}>
                      {specieData.totalSpawns}
                    </h4>
                    <p className={styles.statLabel}>Total de Desovas</p>
                  </div>
                </div>
              </Col>
              <Col lg={3} md={6} sm={6} className="mb-3">
                <div className={styles.statCard}>
                  <div
                    className={`${styles.statIconWrapper} ${styles.warningIcon}`}
                  >
                    {" "}
                    <FaWater className={styles.statIcon} />{" "}
                  </div>
                  <div className={styles.statContent}>
                    <h4 className={styles.statValue}>
                      {(specieData.totalEggs / 1000).toFixed(0)}k
                    </h4>
                    <p className={styles.statLabel}>Total de Ovos</p>
                  </div>
                </div>
              </Col>
              <Col lg={3} md={6} sm={6} className="mb-3">
                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <FaChartLine className={styles.statIcon} />
                  </div>
                  <div className={styles.statContent}>
                    <h4 className={styles.statValue}>15/12/2024</h4>
                    <p className={styles.statLabel}>Última Desova</p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* Charts Section */}
        <div className="content-card mb-4">
          <div
            className={`${styles.chartsSection} ${styles.specificationPage}`}
            style={{ textAlign: "center" }}
          >
            <h3 className={styles.sectionTitle}>
              <FaChartLine className={styles.sectionIcon} />
              Análise Gráfica
            </h3>
            <Row className="g-4 justify-content-center">
              <Col lg={6} md={12} className="mb-3">
                <div className={styles.chartCard}>
                  <h5 className={styles.chartTitle}>Status das Desovas</h5>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#0d6efd"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}`}
                        isAnimationActive={true}
                        stroke="#fff"
                        strokeWidth={2}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          background: "#f0f7ff",
                          color: "#0d6efd",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ marginTop: 12 }}>
                    {pieData.map((entry) => (
                      <span
                        key={entry.name}
                        style={{
                          display: "inline-block",
                          marginRight: 16,
                          color: entry.color,
                          fontWeight: 600,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: 12,
                            height: 12,
                            background: entry.color,
                            borderRadius: "50%",
                            marginRight: 6,
                            border: "2px solid #fff",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                          }}
                        />
                        {entry.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Col>
              <Col lg={6} md={12} className="mb-3">
                <div className={styles.chartCard}>
                  <h5 className={styles.chartTitle}>Desempenho Mensal</h5>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData} barCategoryGap={30}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          background: "#f0f7ff",
                          color: "#0d6efd",
                        }}
                      />
                      <Bar
                        dataKey="spawns"
                        fill="url(#colorSpawns)"
                        radius={[8, 8, 0, 0]}
                        isAnimationActive={true}
                      >
                        <defs>
                          <linearGradient
                            id="colorSpawns"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#0d6efd"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor="#0a58ca"
                              stopOpacity={0.7}
                            />
                          </linearGradient>
                        </defs>
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* Table Section */}
        <div className="content-card mb-4">
          <div
            className={`${styles.tableSection} ${styles.specificationPage}`}
            style={{ textAlign: "center" }}
          >
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}>
                  <FaFish className={styles.sectionIcon} />
                  Histórico Detalhado
                </h3>
                <p className={styles.sectionDescription}>
                  Lista completa de todas as desovas realizadas para esta
                  espécie
                </p>
              </div>
              {/* Controles de comparação */}
              <div className={styles.tableControls}></div>
            </div>
            <div
              className={styles.tableContainer}
              style={{
                boxShadow: "0 6px 24px rgba(13,110,253,0.08)",
                borderRadius: 16,
                overflow: "hidden",
                background: "linear-gradient(145deg, #f0f7ff, #ffffff)",
              }}
            >
              <Table
                className={styles.compactTable}
                style={{
                  textAlign: "center",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
                striped
                hover
                responsive
              >
                <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
                  <tr>
                    {/* <th className={styles.checkboxColumn} style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        className={styles.selectAllCheckbox}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSpawns(
                              currentSpawns.slice(0, 2).map((s) => s.id)
                            );
                          } else {
                            setSelectedSpawns([]);
                          }
                        }}
                      />
                    </th> */}
                    <th>ID</th>
                    <th>Data</th>
                    <th>Tanque</th>
                    <th>Total Ovos</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSpawns.map((spawning, idx) => (
                    <tr
                      key={spawning.id}
                      className={idx % 2 === 0 ? styles.zebraRow : ""}
                    >
                      {/* <td className={styles.checkboxColumn} style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={selectedSpawns.includes(spawning.id)}
                          onChange={() => toggleSpawnSelection(spawning.id)}
                          disabled={
                            selectedSpawns.length >= 2 &&
                            !selectedSpawns.includes(spawning.id)
                          }
                          className={styles.rowCheckbox}
                        />
                      </td> */}
                      <td style={{ textAlign: "center" }}>
                        <strong className={styles.idCell}>
                          #{spawning.id}
                        </strong>
                      </td>
                      <td style={{ textAlign: "center" }}>{spawning.date}</td>
                      <td style={{ textAlign: "center" }}>{spawning.tank}</td>
                      <td style={{ textAlign: "center" }}>
                        <strong>
                          {(spawning.totalEggs / 1000).toFixed(0)}k
                        </strong>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {getStatusBadge(spawning.status)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div className={styles.actionButtons}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/dashboard/spawining/details/${spawning.id}`
                              )
                            }
                            className={styles.actionButton}
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/dashboard/spawining/edit/${spawning.id}`
                              )
                            }
                            title="Editar"
                            className={styles.actionButton}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="Excluir"
                            className={styles.actionButton}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className={styles.paginationContainer}>
                <div className={styles.paginationInfo}>
                  <span
                    style={{
                      fontWeight: 500,
                      color: "#0d6efd",
                      fontSize: "1rem",
                    }}
                  >
                    Mostrando <b>{startIndex + 1}</b> a{" "}
                    <b>{Math.min(endIndex, spawningData.length)}</b> de{" "}
                    <b>{spawningData.length}</b> desovas
                  </span>
                </div>
                <div className={styles.paginationControls}>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={styles.paginationButton}
                  >
                    <FaChevronLeft /> Anterior
                  </Button>

                  <div className={styles.pageNumbers}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={
                            currentPage === page ? "primary" : "outline-primary"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={styles.pageNumberButton}
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>

                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={styles.paginationButton}
                  >
                    Próxima <FaChevronRight />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
