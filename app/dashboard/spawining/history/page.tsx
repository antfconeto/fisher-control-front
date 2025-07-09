"use client";
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Table, Form, Badge } from "react-bootstrap";
import {
  FaArrowLeft,
  FaEye,
  FaEdit,
  FaTrash,
  FaFilter,
  FaDownload,
  FaFish,
  FaHistory,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import styles from "./history.module.css";

// Dados mockados para demonstração
const mockSpawningHistory = [
  {
    id: "1",
    specie: "Tilápia",
    date: "15/12/2024",
    tank: "Tanque A1",
    breeders: "5 machos, 8 fêmeas",
    fertilizationRate: 85,
    hatchingRate: 78,
    status: "Concluída",
    totalEggs: 45000,
    notes: "Desova induzida com sucesso",
  },
  {
    id: "2",
    specie: "Tambaqui",
    date: "10/12/2024",
    tank: "Tanque B2",
    breeders: "3 machos, 6 fêmeas",
    fertilizationRate: 78,
    hatchingRate: 72,
    status: "Concluída",
    totalEggs: 32000,
    notes: "Boa taxa de fertilização",
  },
  {
    id: "3",
    specie: "Pacu",
    date: "08/12/2024",
    tank: "Tanque C1",
    breeders: "4 machos, 7 fêmeas",
    fertilizationRate: 92,
    hatchingRate: 88,
    status: "Concluída",
    totalEggs: 28000,
    notes: "Excelente resultado",
  },
  {
    id: "4",
    specie: "Tilápia",
    date: "05/12/2024",
    tank: "Tanque A2",
    breeders: "6 machos, 9 fêmeas",
    fertilizationRate: 82,
    hatchingRate: 75,
    status: "Concluída",
    totalEggs: 52000,
    notes: "Desova natural",
  },
  {
    id: "5",
    specie: "Matrinxã",
    date: "03/12/2024",
    tank: "Tanque D1",
    breeders: "2 machos, 4 fêmeas",
    fertilizationRate: 88,
    hatchingRate: 82,
    status: "Em Andamento",
    totalEggs: 18000,
    notes: "Aguardando eclosão",
  },
];

export default function SpawningHistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [spawningData] = useState(mockSpawningHistory);
  const [filteredData, setFilteredData] = useState(mockSpawningHistory);
  const [filters, setFilters] = useState({
    specie: "",
    tank: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    let filtered = spawningData;

    if (filters.specie) {
      filtered = filtered.filter((item) =>
        item.specie.toLowerCase().includes(filters.specie.toLowerCase())
      );
    }

    if (filters.tank) {
      filtered = filtered.filter((item) =>
        item.tank.toLowerCase().includes(filters.tank.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter((item) => item.status === filters.status);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date.split("/").reverse().join("-"));
        const fromDate = new Date(filters.dateFrom);
        return itemDate >= fromDate;
      });
    }

    if (filters.dateTo) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date.split("/").reverse().join("-"));
        const toDate = new Date(filters.dateTo);
        return itemDate <= toDate;
      });
    }

    setFilteredData(filtered);
  }, [filters, spawningData]);

  const handleFilterChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      specie: "",
      tank: "",
      status: "",
      dateFrom: "",
      dateTo: "",
    });
  };

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
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p className={styles.loadingText}>
              Carregando histórico de desovas...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.title}>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => router.back()}
            className={styles.backButton}
          >
            <FaArrowLeft /> Voltar
          </Button>
          <h1 className={styles.pageTitle}>
            <FaHistory className={styles.pageTitleIcon} /> Histórico de Desovas
          </h1>
        </div>
      </div>

      {/* Filters Section */}
      <Card className={styles.filterCard}>
        <Card.Body>
          <div className={styles.filterHeader}>
            <FaFilter className={styles.filterIcon} />
            <h4 className={styles.filterTitle}>Filtros</h4>
          </div>

          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Espécie</Form.Label>
                <Form.Control
                  type="text"
                  name="specie"
                  value={filters.specie}
                  onChange={handleFilterChange}
                  placeholder="Filtrar por espécie"
                  className={styles.filterInput}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Tanque</Form.Label>
                <Form.Control
                  type="text"
                  name="tank"
                  value={filters.tank}
                  onChange={handleFilterChange}
                  placeholder="Filtrar por tanque"
                  className={styles.filterInput}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className={styles.filterInput}
                >
                  <option value="">Todos</option>
                  <option value="Concluída">Concluída</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Cancelada">Cancelada</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>De</Form.Label>
                <Form.Control
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  className={styles.filterInput}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Até</Form.Label>
                <Form.Control
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  className={styles.filterInput}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className={styles.filterActions}>
            <Button
              variant="outline-secondary"
              onClick={clearFilters}
              className={styles.clearFilterButton}
            >
              Limpar Filtros
            </Button>
            <Button variant="outline-primary" className={styles.exportButton}>
              <FaDownload /> Exportar
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Results Summary */}
      <div className={styles.resultsSummary}>
        <p>
          <strong>{filteredData.length}</strong> desovas encontradas
        </p>
      </div>

      {/* Table */}
      <Card className={styles.tableCard}>
        <Card.Body className="p-0">
          <div className={styles.tableContainer}>
            <Table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>Espécie</th>
                  <th>Data</th>
                  <th>Tanque</th>
                  <th>Reprodutores</th>
                  <th>Taxa Fertilização</th>
                  <th>Taxa Eclosão</th>
                  <th>Total Ovos</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className={styles.tableRow}>
                    <td>
                      <div className={styles.specieCell}>
                        <FaFish className={styles.specieIcon} />
                        {item.specie}
                      </div>
                    </td>
                    <td>{item.date}</td>
                    <td>{item.tank}</td>
                    <td>{item.breeders}</td>
                    <td>
                      <span className={styles.rateValue}>
                        {item.fertilizationRate}%
                      </span>
                    </td>
                    <td>
                      <span className={styles.rateValue}>
                        {item.hatchingRate}%
                      </span>
                    </td>
                    <td>
                      <span className={styles.eggsValue}>
                        {(item.totalEggs / 1000).toFixed(0)}k
                      </span>
                    </td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/dashboard/spawining/details/${item.id}`
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
                            router.push(`/dashboard/spawining/edit/${item.id}`)
                          }
                          className={styles.actionButton}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
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
        </Card.Body>
      </Card>
    </div>
  );
}
