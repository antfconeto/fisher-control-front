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
} from "react-icons/fa";
import { ClockLoader } from "react-spinners";
import { Button } from "@/components/ui";
import { useErrorContext } from "@/contexts/errorContext";
import { ErrorBox } from "@/components/ErrorBox";
import { SpawningForm, Monitoring } from "@/types/types";
import { useSpawning } from "@/hooks/useSpawning";

// Dados mockados para demonstração
const mockUser = {
  id: "USER001",
  name: "João Silva",
  email: "joao.silva@fisher.com",
  role: "Técnico",
  phone: "(11) 99999-9999",
};

const mockAnimal = {
  id: "ANM001",
  codeAnimal: "ANM001",
  specie: "Tilápia do Nilo",
  birthDate: new Date("2023-01-15"),
  gender: "F" as "M" | "F",
  matriz_code: "MAT001",
  tankId: "TANK001",
  weight: 2.5,
  length: 25,
  healthStatus: "Saudável",
};

export default function SpawningDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { setErrorMessage, errorMessage } = useErrorContext();
  const { getSpawningFormById } = useSpawning();

  const [spawningForm, setSpawningForm] = useState<SpawningForm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSpawningForm = async () => {
      try {
        setLoading(true);
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const form = getSpawningFormById(params.id as string);
        if (form) {
          setSpawningForm(form);
        } else {
          setErrorMessage("Spawning form não encontrado");
        }
      } catch (error: any) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadSpawningForm();
    }
  }, [params.id, getSpawningFormById, setErrorMessage]);

  const formatTime = (time: string) => {
    return time;
  };

  const calculateWeightLoss = () => {
    if (!spawningForm) return 0;
    return spawningForm.animal_weight.beforeSpawn - spawningForm.animal_weight.afterSpawn;
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
        <p className={styles.loadingText}>Carregando detalhes do spawning form...</p>
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
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Data:</span>
                <span className={styles.infoValue}>
                  {spawningForm.date.toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Peso Antes:</span>
                <span className={styles.infoValue}>
                  {spawningForm.animal_weight.beforeSpawn}kg
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Peso Depois:</span>
                <span className={styles.infoValue}>
                  {spawningForm.animal_weight.afterSpawn}kg
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Perda de Peso:</span>
                <span className={styles.infoValue}>
                  {calculateWeightLoss().toFixed(2)}kg
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Peso dos Ovos:</span>
                <span className={styles.infoValue}>
                  {spawningForm.egg_weight}kg
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Hormônio:</span>
                <span className={styles.infoValue}>
                  {spawningForm.hormone.quantity}ml às {spawningForm.hormone.hour_dosage}
                </span>
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
                <span className={styles.infoValue}>{mockUser.name}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{mockUser.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Cargo:</span>
                <span className={styles.infoValue}>{mockUser.role}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Telefone:</span>
                <span className={styles.infoValue}>{mockUser.phone}</span>
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
                <span className={styles.infoValue}>{mockAnimal.codeAnimal}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Espécie:</span>
                <span className={styles.infoValue}>{mockAnimal.specie}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Gênero:</span>
                <span className={styles.infoValue}>
                  {mockAnimal.gender === "F" ? "Fêmea" : "Macho"}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Data de Nascimento:</span>
                <span className={styles.infoValue}>
                  {mockAnimal.birthDate.toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Peso Atual:</span>
                <span className={styles.infoValue}>{mockAnimal.weight}kg</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Comprimento:</span>
                <span className={styles.infoValue}>{mockAnimal.length}cm</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Status de Saúde:</span>
                <span className={styles.infoValue}>{mockAnimal.healthStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Monitoramento */}
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <BsGraphUp className={styles.chartIcon} />
            <h3>Monitoramento de Temperatura</h3>
          </div>
          
          <div className={styles.chartContainer}>
            <div className={styles.chartPlaceholder}>
              <FaChartBar style={{ fontSize: '4rem', marginBottom: '1rem', color: '#0a58ca' }} />
              <h4>Gráfico de Monitoramento</h4>
              <p>Implementar com biblioteca de gráficos (Chart.js, Recharts, etc.)</p>
              <div className={styles.monitoringData}>
                <h5>Dados de Monitoramento:</h5>
                <div className={styles.monitoringList}>
                  {getMonitoringChartData().map((data, index) => (
                    <div key={index} className={styles.monitoringItem}>
                      <div className={styles.monitoringTime}>
                        <BsClock /> {data.hour}
                      </div>
                      <div className={styles.monitoringTemp}>
                        <BsThermometer /> {data.temperature}°C
                      </div>
                      <div className={styles.monitoringDegree}>
                        <BsGraphUp /> {data.hourDegree} graus-hora
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Monitoramento */}
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <BsClock className={styles.tableIcon} />
            <h3>Registros de Monitoramento</h3>
          </div>
          
          <div className={styles.tableContainer}>
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
          </div>
        </div>
      </div>
    </>
  );
} 