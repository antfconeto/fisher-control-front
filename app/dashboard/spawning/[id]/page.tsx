"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./spawningDetails.module.css";
import {
  BsArrowLeft,
  BsCalendar3,
  BsEgg,
  BsThermometer,
  BsClock,
  BsGraphUp,
  BsInfoCircle,
  BsPlus,
} from "react-icons/bs";
import {
  FaFish,
  FaChartBar,
  FaUser,
  FaCalendarAlt,
  FaWeight,
  FaThermometerHalf,
  FaClock,
  FaEgg,
  FaUserTie,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import { ClockLoader } from "react-spinners";
import { Button } from "@/components/ui";
import { useErrorContext } from "@/contexts/errorContext";
import { ErrorBox } from "@/components/ErrorBox";
import { Animal, SpawningForm, Specie, Tank } from "@/types/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { InputDefault } from "@/components/Inputs/InputDefault/inputDefault";
import { getSpawnFormById } from "@/actions/spawnForm";
import { User } from "@/types/user";
import { getUserById } from "@/actions/user";
import { getAnimalByCode } from "@/actions/animal";
import { getSpecieById } from "@/actions/specie";
import { getTankById } from "@/actions/tank";
import { addMonitoringRecord } from "@/actions/spawnForm";

export default function SpawningDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { setErrorMessage, errorMessage } = useErrorContext();

  const [spawningForm, setSpawningForm] = useState<SpawningForm | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [specie, setSpecie] = useState<Specie | null>(null);
  const [tank, setTank] = useState<Tank | null>(null);
  const [showAddMonitoringModal, setShowAddMonitoringModal] = useState(false);
  const [newMonitoringRecord, setNewMonitoringRecord] = useState({
    hour: "",
    temperature: 0,
    hour_degree: 0,
  });
  const [loading, setLoading] = useState(true);

  // Função para carregar o spawning form e dados relacionados
  const loadSpawningForm = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      if (!params.id) {
        setErrorMessage("ID do spawning form não fornecido");
        return;
      }

      const response = await getSpawnFormById(params.id as string);
      if ("error" in response) {
        setErrorMessage(response.error);
        return;
      }

      // Converter o campo date de string para Date
      const spawnFormWithDateConversion = {
        ...response,
        date: new Date(response.date),
      };
      setSpawningForm(spawnFormWithDateConversion);

      // Buscar dados do usuário
      if (response.userId) {
        const userResponse = await getUserById(response.userId);
        if (!("error" in userResponse)) {
          setUser(userResponse);
        }
      } else if (response.user && response.user.id) {
        const userResponse = await getUserById(response.user.id);
        if (!("error" in userResponse)) {
          setUser(userResponse);
        }
      }

      // Buscar dados do animal
      if (response.animalId) {
        const animalResponse = await getAnimalByCode(response.animalId);
        if (!("error" in animalResponse)) {
          setAnimal(animalResponse);

          // Buscar dados da espécie usando o ID da espécie do animal
          if (animalResponse.specie) {
            const specieResponse = await getSpecieById(animalResponse.specie);
            if (!("error" in specieResponse)) {
              setSpecie(specieResponse);
            }
          }

          // Buscar dados do tanque usando o tankId do animal
          if (animalResponse.tankId) {
            const tankResponse = await getTankById(animalResponse.tankId);
            if (!("error" in tankResponse)) {
              setTank(tankResponse);
            }
          }
        }
      }
    } catch (error: any) {
      setErrorMessage(
        error.message || "Erro ao carregar detalhes do spawning form"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      loadSpawningForm();
    }
  }, [params.id, setErrorMessage]);

  const formatTime = (time: string) => {
    return time;
  };

  const formatNumber = (value: string, maxDecimals: number = 2): string => {
    // Remove caracteres não numéricos exceto vírgula e ponto
    let cleaned = value.replace(/[^\d,.-]/g, "");

    // Substitui vírgula por ponto para cálculos
    cleaned = cleaned.replace(",", ".");

    // Converte para número
    let num = parseFloat(cleaned);
    if (isNaN(num)) return "";

    // Formata com o número máximo de decimais
    return num.toFixed(maxDecimals).replace(".", ",");
  };

  const handleMonitoringInputChange = (
    field: string,
    value: string | number
  ) => {
    let formattedValue = value;

    // Aplicar formatação específica para cada campo
    if (field === "temperature" || field === "hour_degree") {
      if (typeof value === "string") {
        formattedValue =
          parseFloat(formatNumber(value, 1).replace(",", ".")) || 0;
      }
    }

    setNewMonitoringRecord((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
  };

  const handleAddMonitoringRecord = async () => {
    try {
      if (!newMonitoringRecord.hour || newMonitoringRecord.temperature === 0) {
        setErrorMessage("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      if (!spawningForm || !spawningForm._id) {
        setErrorMessage("Spawning form não encontrado.");
        return;
      }
      // Chamada correta para adicionar monitoramento
      const result = await addMonitoringRecord(spawningForm._id, [
        ...(spawningForm.monitoring || []),
        newMonitoringRecord,
      ]);
      if (result && result.error) {
        setErrorMessage(result.error);
        return;
      }
      // Recarregar os dados do spawning form
      await loadSpawningForm();

      // Limpar o formulário e fechar o modal
      setNewMonitoringRecord({
        hour: "",
        temperature: 0,
        hour_degree: 0,
      });
      setShowAddMonitoringModal(false);

      // Mostrar notificação de sucesso
      if (typeof window !== "undefined") {
        alert("Registro de monitoramento adicionado com sucesso!");
      }
    } catch (error: any) {
      setErrorMessage(
        error.message || "Erro ao adicionar registro de monitoramento"
      );
    }
  };

  const calculateWeightLoss = () => {
    if (!spawningForm) return 0;
    return (
      spawningForm.animal_weight.beforeSpawn -
      spawningForm.animal_weight.afterSpawn
    );
  };

  const getMonitoringChartData = () => {
    if (!spawningForm) return [];

    return spawningForm.monitoring.map((monitoring, index) => ({
      hour: monitoring.hour,
      temperature: monitoring.temperature,
      hourDegree: monitoring.hour_degree,
      index,
    }));
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <ClockLoader color="#0a58ca" size={60} />
        <p className={styles.loadingText}>
          Carregando detalhes do spawning form...
        </p>
      </div>
    );
  }

  if (!spawningForm) {
    return (
      <div className={styles.errorContainer}>
        <BsInfoCircle size={48} />
        <h2>Spawning Form não encontrado</h2>
        <p>O spawning form solicitado não foi encontrado.</p>
        <Button onClick={() => router.back()} variant="primary">
          <BsArrowLeft /> Voltar
        </Button>
      </div>
    );
  }

  return (
    <>
      {errorMessage && (
        <ErrorBox
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          otherClassName=""
        />
      )}

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Button
            onClick={() => router.back()}
            variant="secondary"
            className={styles.backButton}
          >
            <BsArrowLeft /> Voltar
          </Button>
          <h1 className={styles.title}>
            <BsEgg className={styles.titleIcon} /> Detalhes do Spawning Form
          </h1>
        </div>

        {/* Informações Principais */}
        <div className={styles.mainInfo}>
          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <BsCalendar3 className={styles.infoCardIcon} />
              <h3>Informações do Spawning</h3>
            </div>
            <div className={styles.spawningInfoGrid}>
              <div className={`${styles.spawningInfoItem} ${styles.dateCard}`}>
                <div>
                  <div className={styles.spawningInfoLabel}>
                    <BsCalendar3 className={styles.spawningInfoIcon} />
                    Data do Spawning
                  </div>
                  <div className={styles.spawningInfoValue}>
                    {spawningForm.date instanceof Date
                      ? spawningForm.date.toLocaleDateString("pt-BR")
                      : new Date(spawningForm.date).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              </div>

              <div
                className={`${styles.spawningInfoItem} ${styles.weightCard}`}
              >
                <div>
                  <div className={styles.spawningInfoLabel}>
                    <FaWeight className={styles.spawningInfoIcon} />
                    Peso Antes
                  </div>
                  <div className={styles.spawningInfoValue}>
                    {spawningForm.animal_weight.beforeSpawn}kg
                  </div>
                </div>
              </div>

              <div
                className={`${styles.spawningInfoItem} ${styles.weightCard}`}
              >
                <div>
                  <div className={styles.spawningInfoLabel}>
                    <FaWeight className={styles.spawningInfoIcon} />
                    Peso Depois
                  </div>
                  <div className={styles.spawningInfoValue}>
                    {spawningForm.animal_weight.afterSpawn}kg
                  </div>
                </div>
              </div>

              <div className={styles.spawningInfoItem}>
                <div>
                  <div className={styles.spawningInfoLabel}>
                    <BsThermometer className={styles.spawningInfoIcon} />
                    Perda de Peso
                  </div>
                  <div className={styles.spawningInfoValue}>
                    {calculateWeightLoss().toFixed(2)}kg
                  </div>
                </div>
              </div>

              <div className={styles.spawningInfoItem}>
                <div>
                  <div className={styles.spawningInfoLabel}>
                    <BsEgg className={styles.spawningInfoIcon} />
                    Peso dos Ovos
                  </div>
                  <div className={styles.spawningInfoValue}>
                    {spawningForm.egg_weight}kg
                  </div>
                </div>
              </div>

              <div
                className={`${styles.spawningInfoItem} ${styles.hormoneCard}`}
              >
                <div>
                  <div className={styles.spawningInfoLabel}>
                    <FaClock className={styles.spawningInfoIcon} />
                    Hormônio
                  </div>
                  <div className={styles.spawningInfoValue}>
                    {spawningForm.hormone.quantity}ml às{" "}
                    {spawningForm.hormone.hour_dosage}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Informações */}
        <div className={styles.infoGrid}>
          {/* Informações do Usuário */}
          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <FaUser className={styles.infoCardIcon} />
              <h3>Responsável</h3>
            </div>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Nome:</span>
                <span className={styles.infoValue}>{user?.username}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{user?.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Cargo:</span>
                <span className={styles.infoValue}>{user?.role}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Data de Cadastro:</span>
                <span className={styles.infoValue}>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("pt-BR")
                    : "Não informado"}
                </span>
              </div>
            </div>
          </div>

          {/* Informações do Animal */}
          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <FaFish className={styles.infoCardIcon} />
              <h3>Animal</h3>
            </div>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Código:</span>
                <span className={styles.infoValue}>{animal?.codeAnimal}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Espécie:</span>
                <span className={styles.infoValue}>{specie?.name}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Gênero:</span>
                <span className={styles.infoValue}>
                  {animal?.gender === "F" ? "Fêmea" : "Macho"}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Data de Nascimento:</span>
                <span className={styles.infoValue}>
                  {animal?.birthDate
                    ? (typeof animal.birthDate === "string"
                        ? new Date(animal.birthDate)
                        : animal.birthDate
                      ).toLocaleDateString("pt-BR")
                    : "Não informado"}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Código da Matriz:</span>
                <span className={styles.infoValue}>
                  {animal?.matriz_code || "Não informado"}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Tanque:</span>
                <span className={styles.infoValue}>
                  {tank?.name || "Não informado"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Monitoramento */}
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <BsGraphUp className={styles.chartIcon} />
            <h3>Monitoramento de Temperatura</h3>
            <Button
              onClick={() => setShowAddMonitoringModal(true)}
              variant="primary"
              className={styles.addMonitoringButton}
            >
              <BsPlus /> Adicionar Registro
            </Button>
          </div>

          <div className={styles.chartContainer}>
            {spawningForm.monitoring && spawningForm.monitoring.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getMonitoringChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="hour"
                    label={{
                      value: "Hora",
                      position: "insideBottom",
                      offset: -10,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Temperatura (°C)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      `${value}°C`,
                      name === "temperature" ? "Temperatura" : "Graus-Hora",
                    ]}
                    labelFormatter={(label) => `Hora: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#0a58ca"
                    strokeWidth={2}
                    dot={{ fill: "#0a58ca", strokeWidth: 2, r: 4 }}
                    activeDot={{
                      r: 6,
                      stroke: "#0a58ca",
                      strokeWidth: 2,
                      fill: "#fff",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles.chartPlaceholder}>
                <FaChartBar
                  style={{
                    fontSize: "4rem",
                    marginBottom: "1rem",
                    color: "#0a58ca",
                  }}
                />
                <h4>Nenhum dado de monitoramento</h4>
                <p>
                  Este spawning form não possui registros de monitoramento de
                  temperatura.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tabela de Monitoramento */}
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <BsClock className={styles.tableIcon} />
            <h3>Registros de Monitoramento</h3>
          </div>

          <div className={styles.tableContainer}>
            {spawningForm.monitoring && spawningForm.monitoring.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Temperatura (°C)</th>
                    <th>Graus-Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {spawningForm.monitoring.map((monitoring, index) => (
                    <tr key={index}>
                      <td>{monitoring.hour}</td>
                      <td>{monitoring.temperature}°C</td>
                      <td>{monitoring.hour_degree}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.chartPlaceholder}>
                <h4>Nenhum registro de monitoramento</h4>
                <p>Adicione registros para visualizar aqui.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para Adicionar Registro de Monitoramento */}
      {showAddMonitoringModal && (
        <div className={styles.modalOverlay}>
          <div
            className={styles.modalContent}
            // Remover o style inline de maxWidth e width para usar apenas o CSS
          >
            <div
              className={styles.modalHeader}
              style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: 12 }}
            >
              <h3 style={{ fontWeight: 700, color: "#0a58ca", fontSize: 22 }}>
                Adicionar Registro de Monitoramento
              </h3>
              <button
                onClick={() => setShowAddMonitoringModal(false)}
                className={styles.closeButton}
                aria-label="Fechar modal"
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 22,
                  color: "#888",
                  cursor: "pointer",
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div
              className={styles.modalBody}
              style={{ padding: "1.5rem 0.5rem 0.5rem 0.5rem" }}
            >
              <div className={styles.formGroup} style={{ marginBottom: 18 }}>
                <label
                  style={{ fontWeight: 500, color: "#222", marginBottom: 4 }}
                >
                  Hora:
                </label>
                <InputDefault
                  type="time"
                  value={newMonitoringRecord.hour}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleMonitoringInputChange("hour", e.target.value)
                  }
                  required
                  placeholder="HH:MM"
                  style={{
                    borderRadius: 8,
                    border: "1.5px solid #b6c1d6",
                    padding: "0.6rem 1rem",
                  }}
                />
              </div>
              <div className={styles.formGroup} style={{ marginBottom: 18 }}>
                <label
                  style={{ fontWeight: 500, color: "#222", marginBottom: 4 }}
                >
                  Temperatura (°C):
                </label>
                <InputDefault
                  type="text"
                  value={
                    newMonitoringRecord.temperature === 0
                      ? ""
                      : newMonitoringRecord.temperature.toString()
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleMonitoringInputChange("temperature", e.target.value)
                  }
                  required
                  placeholder="0,0"
                  style={{
                    borderRadius: 8,
                    border: "1.5px solid #b6c1d6",
                    padding: "0.6rem 1rem",
                  }}
                />
              </div>
              <div className={styles.formGroup} style={{ marginBottom: 18 }}>
                <label
                  style={{ fontWeight: 500, color: "#222", marginBottom: 4 }}
                >
                  Graus-Hora:
                </label>
                <InputDefault
                  type="text"
                  value={
                    newMonitoringRecord.hour_degree === 0
                      ? ""
                      : newMonitoringRecord.hour_degree.toString()
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleMonitoringInputChange("hour_degree", e.target.value)
                  }
                  required
                  placeholder="0,0"
                  style={{
                    borderRadius: 8,
                    border: "1.5px solid #b6c1d6",
                    padding: "0.6rem 1rem",
                  }}
                />
              </div>
            </div>
            <div
              className={styles.modalFooter}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                padding: "0.5rem 1rem 1rem 1rem",
              }}
            >
              <Button
                onClick={() => setShowAddMonitoringModal(false)}
                variant="secondary"
                style={{ minWidth: 110, borderRadius: 8 }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddMonitoringRecord}
                variant="primary"
                style={{ minWidth: 110, borderRadius: 8 }}
              >
                <FaSave /> Salvar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
