"use client";

import { useState, useEffect, useRef } from "react";
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
  BsPencil,
  BsTrash,
  BsDownload,
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
import { Animal, ResponseError, SpawningForm, Specie, Tank, Monitoring } from "@/types/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { InputDefault } from "@/components/Inputs/InputDefault/inputDefault";
import { getSpawnFormById } from "@/actions/spawnForm";
import { User } from "@/types/user";
import { getUserById } from "@/actions/user";
import { getAnimalByCode } from "@/actions/animal";
import { getSpecieById } from "@/actions/specie";
import { getTankById } from "@/actions/tank";
import { addMonitoringRecord, deleteSpawnForm } from "@/actions/spawnForm";
import { generateSpawningPDF } from "@/components/SpawningPDF";
import { AdminOnly } from "@/components/Authorization";

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
  const [monitoringTimeError, setMonitoringTimeError] = useState<string | null>(null);
  const [organizedMonitoring, setOrganizedMonitoring] = useState<Monitoring[]>([]);
  const [hasMonitoringError, setHasMonitoringError] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState(350);

  // Função para gerar e baixar PDF
  const handleDownloadPDF = async () => {
    try {
      if (!spawningForm) {
        setErrorMessage("Dados da desova não disponíveis");
        return;
      }

      setIsGeneratingPDF(true);
      setErrorMessage("");

      await generateSpawningPDF({
        spawningForm,
        user,
        animal,
        specie,
        tank,
        organizedMonitoring,
      });
    } catch (error: any) {
      setErrorMessage("Erro ao gerar PDF: " + error.message);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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

      // Preparar todas as chamadas em paralelo
      const promises: Promise<{ type: string; data: any }>[] = [];

      // Buscar dados do usuário
      if (response.user && response.user.id) {
        promises.push(
          getUserById(response.user.id).then(userResponse => {
            if ((userResponse as ResponseError).error) {
              throw new Error((userResponse as ResponseError).error);
            }
            return { type: 'user', data: userResponse as User };
          })
        );
      }

      // Buscar dados do animal
      if (response.animalId) {
        promises.push(
          getAnimalByCode(response.animalId).then(animalResponse => {
            if ((animalResponse as ResponseError).error) {
              throw new Error((animalResponse as ResponseError).error);
            }
            return { type: 'animal', data: animalResponse as Animal };
          })
        );
      }

      // Executar todas as chamadas em paralelo
      const results = await Promise.all(promises);

      // Processar resultados
      for (const result of results) {
        if (result.type === 'user') {
          setUser(result.data as User);
        } else if (result.type === 'animal') {
          const animalData = result.data as Animal;
          setAnimal(animalData);
          
          // Buscar dados relacionados ao animal em paralelo
          const animalPromises: Promise<{ type: string; data: any } | null>[] = [];
          
          if (animalData.specie) {
            animalPromises.push(
              getSpecieById(animalData.specie).then(specieResponse => {
                if (!("error" in specieResponse)) {
                  return { type: 'specie', data: specieResponse as Specie };
                }
                return null;
              })
            );
          }
          
          if (animalData.tankId) {
            animalPromises.push(
              getTankById(animalData.tankId).then(tankResponse => {
                if (!("error" in tankResponse)) {
                  return { type: 'tank', data: tankResponse as Tank };
                }
                return null;
              })
            );
          }
          
          // Executar chamadas relacionadas ao animal em paralelo
          const animalResults = await Promise.all(animalPromises);
          
          for (const animalResult of animalResults) {
            if (animalResult) {
              if (animalResult.type === 'specie') {
                setSpecie(animalResult.data as Specie);
              } else if (animalResult.type === 'tank') {
                setTank(animalResult.data as Tank);
              }
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

  // Função para converter horário (HH:MM) em minutos para comparação
  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Função para organizar monitoring por horário e calcular graus-hora
  const organizeMonitoringData = (monitoring: Monitoring[]): Monitoring[] => {
    // Filtrar apenas itens com hora e temperatura válidos
    const validItems = monitoring.filter(item => item.hour && item.temperature > 0);
    
    // Ordenar por horário
    const sortedItems = validItems.sort((a, b) => {
      const timeA = convertTimeToMinutes(a.hour);
      const timeB = convertTimeToMinutes(b.hour);
      return timeA - timeB;
    });

    // Calcular graus-hora automaticamente
    return sortedItems.map((item, index) => {
      if (index === 0) {
        return { ...item, hour_degree: 0 };
      } else {
        const previousHourDegree = sortedItems[index - 1].hour_degree || 0;
        const currentTemperature = item.temperature || 0;
        return { ...item, hour_degree: currentTemperature + previousHourDegree };
      }
    });
  };

  // Função para validar se os horários estão em ordem cronológica
  const validateMonitoringTimes = (monitoring: Monitoring[]): string | null => {
    const validItems = monitoring.filter(item => item.hour && item.temperature > 0);
    
    if (validItems.length < 2) return null;
    
    // Verificar horários duplicados
    const times = validItems.map(item => item.hour);
    const uniqueTimes = new Set(times);
    if (times.length !== uniqueTimes.size) {
      return "Erro: Existem horários duplicados. Cada horário deve ser único.";
    }
    
    for (let i = 1; i < validItems.length; i++) {
      const currentTime = validItems[i].hour;
      const previousTime = validItems[i - 1].hour;
      
      if (currentTime && previousTime) {
        const currentMinutes = convertTimeToMinutes(currentTime);
        const previousMinutes = convertTimeToMinutes(previousTime);
        
        if (currentMinutes <= previousMinutes) {
          return `Erro na ordem dos horários: ${currentTime} não pode ser igual ou anterior a ${previousTime}. Os horários devem estar em ordem cronológica crescente.`;
        }
      }
    }
    
    return null;
  };

  // Atualizar organizedMonitoring quando spawningForm mudar
  useEffect(() => {
    if (spawningForm && spawningForm.monitoring) {
      const organized = organizeMonitoringData(spawningForm.monitoring);
      setOrganizedMonitoring(organized);
      
      // Validar horários
      const timeError = validateMonitoringTimes(organized);
      setMonitoringTimeError(timeError);
      setHasMonitoringError(!!timeError);
    }
  }, [spawningForm]);

  // Validar horários em tempo real quando novo registro for adicionado
  useEffect(() => {
    if (showAddMonitoringModal && spawningForm && newMonitoringRecord.hour && newMonitoringRecord.temperature > 0) {
      const tempMonitoring = [...(spawningForm.monitoring || []), newMonitoringRecord];
      const timeError = validateMonitoringTimes(tempMonitoring);
      setHasMonitoringError(!!timeError);
    } else {
      setHasMonitoringError(false);
    }
  }, [newMonitoringRecord, showAddMonitoringModal, spawningForm]);

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

  const handleDeleteSpawning = async () => {
    try {
      if (!spawningForm || !spawningForm._id) {
        setErrorMessage("Spawning form não encontrado.");
        return;
      }

      // Confirmar exclusão
      const confirmDelete = window.confirm(
        "Tem certeza que deseja excluir esta desova? Esta ação não pode ser desfeita."
      );

      if (!confirmDelete) {
        return;
      }

      const result = await deleteSpawnForm(spawningForm._id);
      if (result && typeof result === 'object' && 'error' in result) {
        setErrorMessage(result.error);
        return;
      }

      // Redirecionar para a lista de spawning forms
      router.push("/dashboard/spawning");
    } catch (error: any) {
      setErrorMessage(
        error.message || "Erro ao excluir spawning form"
      );
    }
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

      // Criar array temporário com o novo registro para validação
      const tempMonitoring = [...(spawningForm.monitoring || []), newMonitoringRecord];
      
      // Validar horários antes de adicionar
      const timeError = validateMonitoringTimes(tempMonitoring);
      if (timeError) {
        setErrorMessage(timeError);
        return;
      }

      // Organizar e calcular graus-hora automaticamente
      const organizedMonitoring = organizeMonitoringData(tempMonitoring);
      
      // Chamada para adicionar monitoramento com dados organizados
      const result = await addMonitoringRecord(spawningForm._id, organizedMonitoring);
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
    if (!organizedMonitoring.length) return [];

    return organizedMonitoring.map((monitoring, index) => ({
      hour: monitoring.hour,
      "Temperatura": monitoring.temperature,
      "Graus-Hora": monitoring.hour_degree,
      index,
    }));
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Ajustar altura do gráfico baseado no tamanho da tela
  useEffect(() => {
    const updateChartHeight = () => {
      const width = window.innerWidth;
      if (width <= 360) {
        setChartHeight(220);
      } else if (width <= 480) {
        setChartHeight(250);
      } else if (width <= 700) {
        setChartHeight(300);
      } else {
        setChartHeight(350);
      }
    };

    updateChartHeight();
    window.addEventListener('resize', updateChartHeight);
    return () => window.removeEventListener('resize', updateChartHeight);
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <ClockLoader color="#0a58ca" size={60} />
        <p className={styles.loadingText}>
          Carregando detalhes da desova...
        </p>
      </div>
    );
  }

  if (!spawningForm) {
    return (
      <div className={styles.errorContainer}>
        <BsInfoCircle size={48} />
        <h2>Desova não encontrada</h2>
        <p>A desova solicitada não foi encontrada.</p>
        <Button onClick={() => router.push("/dashboard/spawning")} variant="primary">
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

      {isGeneratingPDF && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(5px)'
        }}>
          <ClockLoader color="#0a58ca" size={60} />
          <p style={{
            marginTop: '1rem',
            fontSize: '1.1rem',
            color: '#0a58ca',
            fontWeight: '500'
          }}>
            Gerando PDF da desova...
          </p>
        </div>
      )}

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Button
            onClick={() => router.push("/dashboard/spawning")}
            variant="secondary"
            className={styles.backButton}
          >
            <BsArrowLeft /> Voltar
          </Button>
          <h1 className={styles.title}>
            <BsEgg className={styles.titleIcon} /> DETALHES DA DESOVA
          </h1>
          <div className={styles.headerActions}>
            <Button
              onClick={handleDownloadPDF}
              variant="secondary"
              className={styles.downloadButton}
              disabled={isGeneratingPDF}
            >
              <BsDownload /> {isGeneratingPDF ? 'Gerando...' : 'Baixar PDF'}
            </Button>
            <AdminOnly>
            <div className={styles.dropdownContainer} ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className={styles.dropdownButton}
              >
                <BsPencil /> Ações
              </button>
              <div className={`${styles.dropdownContent} ${showDropdown ? styles.show : ''}`}>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    router.push(`/dashboard/spawning/update/${params.id}`);
                  }}
                  className={`${styles.dropdownItem} ${styles.update}`}
                >
                  <BsPencil /> Atualizar
                </button>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleDeleteSpawning();
                  }}
                  className={`${styles.dropdownItem} ${styles.delete}`}
                >
                  <BsTrash /> Excluir
                </button>
              </div>
            </div>
            </AdminOnly>
          </div>
        </div>

        {/* Informações Principais */}
        <div className={styles.mainInfo}>
          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <BsCalendar3 className={styles.infoCardIcon} />
              <h3>Informações da Desova</h3>
            </div>
            <div className={styles.spawningInfoGrid}>
              <div className={`${styles.spawningInfoItem} ${styles.dateCard}`}>
                <div>
                  <div className={styles.spawningInfoLabel}>
                    <BsCalendar3 className={styles.spawningInfoIcon} />
                    Data da Desova
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
            <AdminOnly>
            <Button
              onClick={() => setShowAddMonitoringModal(true)}
              variant="primary"
              className={styles.addMonitoringButton}
            >
              <BsPlus /> Adicionar Registro
            </Button>
            </AdminOnly>
          </div>

          <div className={styles.chartContainer}>
            {organizedMonitoring.length > 0 ? (
              <ResponsiveContainer width="100%" height={chartHeight}>
                <LineChart data={getMonitoringChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <Legend 
                    wrapperStyle={{
                      fontSize: chartHeight <= 250 ? '10px' : chartHeight <= 300 ? '11px' : '13px',
                      paddingTop: '10px'
                    }}
                  />
                  <XAxis
                    dataKey="hour"
                    label={{
                      value: "Hora",
                      position: "insideBottom",
                      offset: -5,
                    }}
                    tick={{ fontSize: chartHeight <= 250 ? 9 : chartHeight <= 300 ? 10 : 12 }}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    label={{
                      value: "Temperatura",
                      angle: -90,
                      position: "insideLeft",
                    }}
                    tick={{ fontSize: chartHeight <= 250 ? 9 : chartHeight <= 300 ? 10 : 12 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "Graus-Hora",
                      angle: 90,
                      position: "insideRight",
                    }}
                    tick={{ fontSize: chartHeight <= 250 ? 9 : chartHeight <= 300 ? 10 : 12 }}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "Temperatura") {
                        return [`${value}°C`, "Temperatura"];
                      } else if (name === "Graus-Hora") {
                        return [`${value}`, "Graus-Hora"];
                      }
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Hora: ${label}`}
                    contentStyle={{
                      fontSize: chartHeight <= 250 ? '11px' : chartHeight <= 300 ? '12px' : '14px',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0'
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="Temperatura"
                    name="Temperatura"
                    stroke="#0a58ca"
                    strokeWidth={chartHeight <= 250 ? 1 : chartHeight <= 300 ? 1.5 : 2}
                    dot={{ 
                      fill: "#0a58ca", 
                      strokeWidth: chartHeight <= 250 ? 1 : chartHeight <= 300 ? 1.5 : 2, 
                      r: chartHeight <= 250 ? 2 : chartHeight <= 300 ? 3 : 4 
                    }}
                    activeDot={{
                      r: chartHeight <= 250 ? 4 : chartHeight <= 300 ? 5 : 6,
                      stroke: "#0a58ca",
                      strokeWidth: chartHeight <= 250 ? 1 : chartHeight <= 300 ? 1.5 : 2,
                      fill: "#fff",
                    }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="Graus-Hora"
                    name="Graus-Hora"
                    stroke="#28a745"
                    strokeWidth={chartHeight <= 250 ? 1 : chartHeight <= 300 ? 1.5 : 2}
                    dot={{ 
                      fill: "#28a745", 
                      strokeWidth: chartHeight <= 250 ? 1 : chartHeight <= 300 ? 1.5 : 2, 
                      r: chartHeight <= 250 ? 2 : chartHeight <= 300 ? 3 : 4 
                    }}
                    activeDot={{
                      r: chartHeight <= 250 ? 4 : chartHeight <= 300 ? 5 : 6,
                      stroke: "#28a745",
                      strokeWidth: chartHeight <= 250 ? 1 : chartHeight <= 300 ? 1.5 : 2,
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

          {/* Mostrar erro de validação se houver */}
          {monitoringTimeError && (
            <div style={{ 
              color: "#dc3545", 
              backgroundColor: "#f8d7da", 
              border: "1px solid #f5c6cb", 
              borderRadius: "6px", 
              padding: "0.75rem", 
              marginBottom: "1rem", 
              fontSize: "0.9rem" 
            }}>
              ⚠️ {monitoringTimeError}
            </div>
          )}

          <div className={styles.tableContainer}>
            {organizedMonitoring.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Temperatura (°C)</th>
                    <th>Graus-Hora (Calculado)</th>
                  </tr>
                </thead>
                <tbody>
                  {organizedMonitoring.map((monitoring, index) => (
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
              {/* Mostrar dados organizados existentes */}
              {organizedMonitoring.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <h4 style={{ color: "#0a58ca", marginBottom: "0.5rem", fontSize: "1rem" }}>
                    Registros Existentes (Ordenados por Horário):
                  </h4>
                  <div style={{ 
                    maxHeight: "150px", 
                    overflowY: "auto", 
                    border: "1px solid #e0e0e0", 
                    borderRadius: "6px", 
                    padding: "0.5rem",
                    backgroundColor: "#f8f9fa"
                  }}>
                    {organizedMonitoring.map((monitoring, index) => (
                      <div key={index} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.25rem 0",
                        fontSize: "0.9rem",
                        borderBottom: index < organizedMonitoring.length - 1 ? "1px solid #e0e0e0" : "none"
                      }}>
                        <span><strong>{monitoring.hour}</strong></span>
                        <span>{monitoring.temperature}°C</span>
                        <span style={{ color: "#666" }}>Graus-Hora: {monitoring.hour_degree}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <small style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1rem", display: "block" }}>
                💡 Graus-Hora são calculados automaticamente: temperatura atual + graus-hora anterior
              </small>
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
                  inputMode="decimal"
                  value={
                    newMonitoringRecord.temperature === 0
                      ? ""
                      : newMonitoringRecord.temperature.toString().replace(".", ",")
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
                  step="0.1"
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
                variant={hasMonitoringError ? "danger" : "primary"}
                style={{ 
                  minWidth: 110, 
                  borderRadius: 8,
                  backgroundColor: hasMonitoringError ? "#dc3545" : undefined,
                  borderColor: hasMonitoringError ? "#dc3545" : undefined
                }}
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
