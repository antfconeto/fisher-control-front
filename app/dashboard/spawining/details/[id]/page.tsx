"use client";
import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Button } from "react-bootstrap";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaDownload,
  FaFish,
  FaFlask,
  FaEgg,
  FaClock,
  FaChartLine,
  FaIndustry,
  FaCheckCircle,
} from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";
import styles from "../details.module.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// Dados mockados para demonstração
const mockSpawningDetails = {
  id: "1",
  specie: "Tilápia",
  date: "15/12/2024",
  tank: "Tanque A1",
  inductionType: "Induzida",
  status: "Concluída",

  // Reprodutores
  breedersM: 5,
  breedersF: 8,
  breedersIds:
    "M001, M002, M003, M004, M005, F001, F002, F003, F004, F005, F006, F007, F008",
  avgWeight: 250,

  // Protocolo Hormonal
  hormone: "HCG",
  dose: "500 UI/kg",
  doses: 2,
  interval: 12,
  protocolNotes:
    "Protocolo padrão com duas doses de HCG com intervalo de 12 horas.",

  // Condições Ambientais
  temp: 28,
  ph: 7.2,
  oxygen: 6.5,
  photoperiod: 12,

  // Fertilização e Incubação
  eggs: 45000,
  semen: 2.5,
  incubator: "Incubadora Zuga",
  incubationTime: 72,
  incubationNotes:
    "Excelente taxa de fertilização. Eclosão ocorreu conforme esperado.",

  // Resultados
  totalLarvae: 35100,
  successRate: 78,
};

// Dados para gráficos
const timelineData = [
  { step: "Indução", time: "08:00", status: "Concluído", icon: FaFlask },
  { step: "Coleta", time: "20:00", status: "Concluído", icon: FaEgg },
  {
    step: "Fertilização",
    time: "20:30",
    status: "Concluído",
    icon: FaCheckCircle,
  },
  { step: "Incubação", time: "21:00", status: "Concluído", icon: FaIndustry },
  { step: "Eclosão", time: "72h", status: "Concluído", icon: FaFish },
];

export default function SpawningDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const spawningId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [spawningData] = useState(mockSpawningDetails);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    const canvas = await html2canvas(printRef.current, {
      scale: 2, // aumenta a resolução
      useCORS: true, // se tiver imagens externas
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`desova_${spawningData.id}.pdf`);
  };

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir esta desova?")) {
      // Implementar exclusão
      alert("Desova excluída!");
      router.push("/dashboard/spawining");
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
                  Carregando detalhes da desova...
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
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => router.back()}
                  className={styles.backButton}
                >
                  <FaArrowLeft /> Voltar
                </Button>
                <div className={styles.titleIconWrapper}>
                  <FaEgg className={styles.titleIcon} />
                </div>
                <div>
                  <h1 className={styles.pageTitle}>
                    Desova #{spawningData.id}
                  </h1>
                  <p className={styles.pageSubtitle}>
                    {spawningData.specie} - {spawningData.date}
                  </p>
                </div>
              </div>
              <div className={styles.headerActions}>
                <Button
                  variant="outline-warning"
                  onClick={() =>
                    router.push(`/dashboard/spawining/edit/${spawningId}`)
                  }
                  className={`${styles.actionButton} ${styles.editButton}`}
                  style={{ width: 200 }}
                >
                  <FaEdit /> Editar
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={handleDelete}
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  style={{ width: 200 }}
                >
                  <FaTrash /> Excluir
                </Button>
                <Button
                  variant="success"
                  onClick={handleExportPDF}
                  className={styles.exportButton}
                >
                  <FaDownload /> Exportar PDF
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="content-card mb-4">
          <div className={styles.statsSection}>
            <h3 className={styles.sectionTitle}>
              <FaChartLine className={styles.sectionIcon} />
              Resumo
            </h3>
            <Row className={styles.summaryRow}>
              <Col md={3} sm={6} className="mb-2">
                <div className={styles.summaryCard}>
                  <FaChartLine className={styles.summaryIcon} />
                  <div>
                    <div className={styles.summaryValue}>
                      {spawningData.status}
                    </div>
                    <div className={styles.summaryLabel}>Status</div>
                  </div>
                </div>
              </Col>
              <Col md={3} sm={6} className="mb-2">
                <div className={styles.summaryCard}>
                  <FaEgg className={styles.summaryIcon} />
                  <div>
                    <div className={styles.summaryValue}>
                      {(spawningData.eggs / 1000).toFixed(0)}k
                    </div>
                    <div className={styles.summaryLabel}>Total de Ovos</div>
                  </div>
                </div>
              </Col>
              <Col md={3} sm={6} className="mb-2">
                <div className={styles.summaryCard}>
                  <FaFish className={styles.summaryIcon} />
                  <div>
                    <div className={styles.summaryValue}>
                      {spawningData.totalLarvae}
                    </div>
                    <div className={styles.summaryLabel}>Total de Larvas</div>
                  </div>
                </div>
              </Col>
              <Col md={3} sm={6} className="mb-2">
                <div className={styles.summaryCard}>
                  <FaClock className={styles.summaryIcon} />
                  <div>
                    <div className={styles.summaryValue}>
                      {spawningData.date}
                    </div>
                    <div className={styles.summaryLabel}>Data</div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* Timeline */}
        <div className={styles.sectionCard}>
          <h4 className={styles.sectionTitle}>
            <FaClock style={{ marginRight: 8 }} /> Cronograma
          </h4>
          <div className={styles.timelineContainer}>
            {timelineData.map((item, idx) => (
              <div key={idx} className={styles.timelineItem}>
                <div className={styles.timelineIcon}>
                  <item.icon size={28} />
                </div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineStep}>{item.step}</div>
                  <div className={styles.timelineTime}>{item.time}</div>
                  <span
                    className={
                      styles.timelineStatus + " " + styles.timelineStatusSuccess
                    }
                  >
                    {item.status}
                  </span>
                </div>
                {idx < timelineData.length - 1 && (
                  <div className={styles.timelineConnector}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Information */}
        <Row className="g-4">
          {/* Dados Básicos */}
          <Col lg={12}>
            <div className={styles.sectionCard}>
              <h4 className={styles.sectionTitle}>Dados Básicos</h4>
              <div className={styles.sectionContent}>
                <div>
                  <b>Espécie:</b> {spawningData.specie}
                </div>
                <div>
                  <b>Tanque:</b> {spawningData.tank}
                </div>
                <div>
                  <b>Data:</b> {spawningData.date}
                </div>
                <div>
                  <b>Tipo:</b> {spawningData.inductionType}
                </div>
              </div>
            </div>
          </Col>

          {/* Reprodutores */}
          <Col lg={12}>
            <div className={styles.sectionCard}>
              <h4 className={styles.sectionTitle}>Reprodutores</h4>
              <div className={styles.sectionContent}>
                <div>
                  <b>Machos:</b> {spawningData.breedersM}
                </div>
                <div>
                  <b>Fêmeas:</b> {spawningData.breedersF}
                </div>
                <div>
                  <b>Peso Médio:</b> {spawningData.avgWeight}g
                </div>
                <div>
                  <b>IDs dos Peixes:</b> {spawningData.breedersIds}
                </div>
              </div>
            </div>
          </Col>

          {/* Protocolo Hormonal */}
          <Col lg={12}>
            <div className={styles.sectionCard}>
              <h4 className={styles.sectionTitle}>Protocolo Hormonal</h4>
              <div className={styles.sectionContent}>
                <div>
                  <b>Hormônio:</b> {spawningData.hormone}
                </div>
                <div>
                  <b>Dose:</b> {spawningData.dose}
                </div>
                <div>
                  <b>Nº de Doses:</b> {spawningData.doses}
                </div>
                <div>
                  <b>Intervalo:</b> {spawningData.interval}h
                </div>
                <div>
                  <b>Observações:</b> {spawningData.protocolNotes}
                </div>
              </div>
            </div>
          </Col>

          {/* Condições Ambientais */}
          <Col lg={12}>
            <div className={styles.sectionCard}>
              <h4 className={styles.sectionTitle}>Condições Ambientais</h4>
              <div className={styles.sectionContent}>
                <div>
                  <b>Temperatura:</b> {spawningData.temp}°C
                </div>
                <div>
                  <b>pH:</b> {spawningData.ph}
                </div>
                <div>
                  <b>Oxigênio:</b> {spawningData.oxygen} mg/L
                </div>
                <div>
                  <b>Fotoperíodo:</b> {spawningData.photoperiod}h
                </div>
              </div>
            </div>
          </Col>

          {/* Fertilização e Incubação */}
          <Col lg={12}>
            <div className={styles.sectionCard}>
              <h4 className={styles.sectionTitle}>Fertilização e Incubação</h4>
              <div className={styles.sectionContent}>
                <div>
                  <b>Óvulos:</b> {(spawningData.eggs / 1000).toFixed(0)}k
                </div>
                <div>
                  <b>Sêmen:</b> {spawningData.semen} mL
                </div>
                <div>
                  <b>Incubadora:</b> {spawningData.incubator}
                </div>
                <div>
                  <b>Tempo:</b> {spawningData.incubationTime}h
                </div>
                <div>
                  <b>Observações:</b> {spawningData.incubationNotes}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div ref={printRef}>
        {/* TODO: Coloque aqui todo o conteúdo que você quer exportar */}
        {/* ... */}
      </div>
    </div>
  );
}
