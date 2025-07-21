"use client";

import { useState, useEffect } from "react";
import styles from "./spawning.module.css";
import {
  BsFilter,
  BsCalendar3,
  BsGraphUp,
  BsPencil,
  BsTrash,
  BsEye,
  BsEgg,
  BsThermometer,
  BsDroplet,
  BsInfoCircle,
} from "react-icons/bs";
import {
  FaFish,
  FaChartBar,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaRegUser,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { ClockLoader } from "react-spinners";
import { Button } from "@/components/ui";
import { CustomModalForm } from "@/components/Forms/CustomModalForm";
import { ConfirmModal } from "@/components/Forms/ConfirmModal/ConfirmModal";
import { useErrorContext } from "@/contexts/errorContext";
import { ErrorBox } from "@/components/ErrorBox";
import { SpawningForm } from "@/types/types";
import { useSpawningPagination } from "@/hooks/useSpawningPagination";
import {
  createSpawnForm,
  updateSpawnForm,
  deleteSpawnForm,
} from "@/actions/spawnForm";
import { GiFishEggs } from "react-icons/gi";
import { useAuth } from "@/contexts/authContext";
import { useNotification } from "@/contexts/notificationContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUser } from "@/hooks/userHook";
import { getDashboardStats } from "@/actions/dashboard";

enum ModalMode {
  CREATE = "create",
  UPDATE = "update",
  VIEW = "view",
}

const defaultSpawningForm: Omit<SpawningForm, "_id"> = {
  date: new Date(),
  animal_weight: {
    beforeSpawn: 0,
    afterSpawn: 0,
  },
  egg_weight: 0,
  hormone: {
    hour_dosage: "",
    quantity: 0,
  },
  monitoring: [],
  animalId: "",
  user: {
    id: "",
    name: "",
  },
};

export default function SpawningPage() {
  const router = useRouter();
  const { setErrorMessage, errorMessage } = useErrorContext();
  const { user } = useUser();
  const { successNotification } = useNotification();

  // Filtros iniciais (removido userId)
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    userName: "",
    animalId: "",
  });
  const itemsPerPage = 6;
  const {
    spawnForms,
    pagination,
    loading,
    error,
    filters: hookFilters,
    setFilters: setHookFilters,
    currentPage,
    setCurrentPage,
    totalSpawn,
  } = useSpawningPagination(filters, itemsPerPage);

  // Adicionar estados para datas do filtro
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;

  // Handlers para filtros
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
    setHookFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Atualizar handleDateChange para funcionar com react-datepicker
  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setDateRange([start, end]);
    setFilters((prev) => ({
      ...prev,
      startDate: start ? start.toISOString() : "",
      endDate: end ? end.toISOString() : "",
    }));
    setCurrentPage(1);
    setHookFilters((prev) => ({
      ...prev,
      startDate: start ? start.toISOString() : "",
      endDate: end ? end.toISOString() : "",
    }));
  };

  // Estados principais
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.CREATE);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentSpawningForm, setCurrentSpawningForm] = useState<SpawningForm>(
    defaultSpawningForm as SpawningForm
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Novo estado para stats do backend
  const [dashboardStats, setDashboardStats] = useState<{
    totalEggWeight: number;
    averageWeightLoss: number;
    totalSpawns: number;
  } | null>(null);

  useEffect(() => {
    // Buscar stats do backend ao carregar a página
    getDashboardStats().then((stats) => {
      setDashboardStats({
        totalEggWeight: stats.totalEggWeight,
        averageWeightLoss: stats.averageWeightLoss,
        totalSpawns: stats.totalSpawns,
      });
    });
  }, []);

  // Funções de filtro
  const filteredSpawningForms = spawnForms.filter((form) => {
    const matchesAnimal =
      !filters.animalId ||
      form.animalId.toLowerCase().includes(filters.animalId.toLowerCase());

    return matchesAnimal;
  });

  // Paginação
  const totalPages = Math.ceil(filteredSpawningForms.length / itemsPerPage);
  const paginatedSpawningForms = filteredSpawningForms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Funções de modal
  const openUpdateModal = (form: SpawningForm) => {
    setModalMode(ModalMode.UPDATE);
    setCurrentSpawningForm(form);
    setShowModal(true);
  };

  const openViewModal = (form: SpawningForm) => {
    setModalMode(ModalMode.VIEW);
    setCurrentSpawningForm(form);
    setShowModal(true);
  };

  // Função para recarregar dados
  const reloadData = () => {
    setCurrentPage(1);
    setHookFilters({ ...hookFilters });
  };

  const handleSaveSpawningForm = async () => {
    try {
      setIsSubmitting(true);
      const formToSend = {
        ...currentSpawningForm,
        user: {
          id: user?._id || "",
          name: user?.username || "",
        },
      };
      if (modalMode === ModalMode.CREATE) {
        const result = await createSpawnForm(formToSend);
        if ("error" in result) {
          setErrorMessage(result.error);
          return;
        }
        successNotification("Sucesso", "Spawning form criado com sucesso!");
      } else if (modalMode === ModalMode.UPDATE) {
        const result = await updateSpawnForm(formToSend);
        if ("error" in result) {
          setErrorMessage(result.error);
          return;
        }
        successNotification("Sucesso", "Spawning form atualizado com sucesso!");
      }
      setShowModal(false);
      // Recarregar dados automaticamente
      reloadData();
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSpawningForm = async () => {
    try {
      setIsSubmitting(true);
      const result = await deleteSpawnForm(currentSpawningForm._id!);
      if (typeof result === "object" && "error" in result) {
        setErrorMessage(result.error);
        return;
      }
      successNotification("Sucesso", "Spawning form excluído com sucesso!");
      setShowConfirmModal(false);
      // Recarregar dados automaticamente
      reloadData();
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToSpawningDetails = (spawningId: string) => {
    router.push(`/dashboard/spawning/${spawningId}`);
  };

  // Funções de formatação automática
  const formatNumber = (value: string, maxDecimals: number = 2): string => {
    // Remove tudo exceto números e vírgula/ponto
    let cleaned = value.replace(/[^\d,.-]/g, "");

    // Substitui vírgula por ponto para cálculos
    cleaned = cleaned.replace(",", ".");

    // Permite apenas um ponto decimal
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts.slice(1).join("");
    }

    // Limita casas decimais
    if (parts.length === 2 && parts[1].length > maxDecimals) {
      cleaned = parts[0] + "." + parts[1].substring(0, maxDecimals);
    }

    // Converte de volta para formato brasileiro
    return cleaned.replace(".", ",");
  };

  const formatTime = (value: string): string => {
    // Remove tudo exceto números e :
    let cleaned = value.replace(/[^\d:]/g, "");

    // Adiciona : se necessário
    if (cleaned.length >= 2 && !cleaned.includes(":")) {
      cleaned = cleaned.substring(0, 2) + ":" + cleaned.substring(2);
    }

    // Limita a HH:MM
    if (cleaned.length > 5) {
      cleaned = cleaned.substring(0, 5);
    }

    return cleaned;
  };

  // Dados para gráficos
  const getChartData = () => {
    const monthlyData = spawnForms.reduce((acc, form) => {
      const date = form.date instanceof Date ? form.date : new Date(form.date);
      const month = date.toLocaleDateString("pt-BR", { month: "short" });

      if (!acc[month]) {
        acc[month] = {
          month,
          count: 0,
          totalEggWeight: 0,
          avgWeightLoss: 0,
          totalWeightLoss: 0,
        };
      }

      acc[month].count += 1;
      acc[month].totalEggWeight += form.egg_weight;
      acc[month].totalWeightLoss +=
        form.animal_weight.beforeSpawn - form.animal_weight.afterSpawn;
      acc[month].avgWeightLoss = acc[month].totalWeightLoss / acc[month].count;

      return acc;
    }, {} as Record<string, any>);

    return Object.values(monthlyData);
  };

  const getGenderDistribution = () => {
    // Simular distribuição por gênero (já que não temos essa info nos dados atuais)
    return [
      {
        name: "Fêmeas",
        value: Math.floor(totalSpawn * 0.6),
        color: "#ff6b6b",
      },
      {
        name: "Machos",
        value: Math.floor(totalSpawn * 0.4),
        color: "#4ecdc4",
      },
    ];
  };

  return (
    <>
      {(errorMessage || error) && (
        <ErrorBox
          errorMessage={errorMessage || error || ""}
          setErrorMessage={setErrorMessage}
          otherClassName=""
        />
      )}

      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <FaFish className={styles.titleIcon} /> Gestão de Desovas
          </h2>
          <Button
            className={styles.createButton}
            onClick={() => router.push("/dashboard/spawning/register")}
            variant="primary"
          >
            <FaPlus /> Registrar nova desova
          </Button>
        </div>

        {/* Estatísticas */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <BsEgg className={styles.statIcon} />
            <div className={styles.statValue}>
              {dashboardStats ? dashboardStats.totalSpawns : "-"}
            </div>
            <div className={styles.statLabel}>Total de Desovas</div>
          </div>
          <div className={styles.statCard}>
            <BsDroplet className={styles.statIcon} />
            <div className={styles.statValue}>
              {dashboardStats ? dashboardStats.totalEggWeight.toFixed(1) : "-"}
              kg
            </div>
            <div className={styles.statLabel}>Peso Total dos Ovos</div>
          </div>
          <div className={styles.statCard}>
            <BsThermometer className={styles.statIcon} />
            <div className={styles.statValue}>
              {dashboardStats
                ? dashboardStats.averageWeightLoss.toFixed(1)
                : "-"}
              kg
            </div>
            <div className={styles.statLabel}>Perda Média de Peso</div>
          </div>
        </div>

        {/* Dashboard Grid */}

        {/* Filtros */}
        <section className={styles.filterSection}>
          <div className={styles.filterLabel}>
            <BsFilter /> Filtros
          </div>
          <div className={styles.filterContainer}>
            <div className={styles.filterInput}>
              <label>Período:</label>
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateRangeChange}
                isClearable={true}
                dateFormat="dd/MM/yyyy"
                placeholderText="Selecione o período"
                locale="pt-BR"
                className={styles.customInput}
                calendarClassName={styles.reactDatepicker}
              />
            </div>
            <div className={styles.filterInput}>
              <label>Animal:</label>
              <input
                type="text"
                placeholder="ID do Animal"
                value={filters.animalId}
                onChange={(e) => handleFilterChange("animalId", e.target.value)}
              />
            </div>
            <div className={styles.filterInput}>
              <label>Autor:</label>
              <input
                type="text"
                placeholder="Nome do Autor"
                value={filters.userName}
                onChange={(e) => handleFilterChange("userName", e.target.value)}
              />
            </div>
          </div>
        </section>
        {/* Cards de Spawning Forms */}
        {loading ? (
          <div className={styles.loadingContainer}>
            <ClockLoader color="#0a58ca" size={60} />
            <p className={styles.loadingText}>Carregando spawning forms...</p>
          </div>
        ) : (
          <div className={styles.cardsContainer}>
            {spawnForms.map((form) => (
              <div key={form._id} className={styles.spawningCard}>
                <div className={styles.spawningCardHeader}>
                  <h3 className={styles.spawningCardTitle}>
                    <GiFishEggs size={30} color="#0a58ca" /> Desova
                  </h3>
                  <div className={styles.spawningCardActions}>
                    <button
                      className={styles.actionButton}
                      onClick={() => openViewModal(form)}
                      title="Visualizar"
                    >
                      <BsEye />
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() => openUpdateModal(form)}
                      title="Editar"
                    >
                      <BsPencil />
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() => {
                        setCurrentSpawningForm(form);
                        setShowConfirmModal(true);
                      }}
                      title="Excluir"
                    >
                      <BsTrash />
                    </button>
                  </div>
                </div>

                <div className={styles.spawningCardBody}>
                  <div className={styles.spawningCardStat}>
                    <div className={styles.spawningCardStatIcon}>
                      <BsCalendar3 />
                    </div>
                    <div className={styles.spawningCardStatContent}>
                      <div className={styles.spawningCardStatLabel}>Data:</div>
                      <div className={styles.spawningCardStatValue}>
                        {form.date instanceof Date
                          ? form.date.toLocaleDateString("pt-BR")
                          : new Date(form.date).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>

                  <div className={styles.spawningCardStat}>
                    <div className={styles.spawningCardStatIcon}>
                      <FaFish />
                    </div>
                    <div className={styles.spawningCardStatContent}>
                      <div className={styles.spawningCardStatLabel}>
                        Animal ID:
                      </div>
                      <div className={styles.spawningCardStatValue}>
                        {form.animalId}
                      </div>
                    </div>
                  </div>

                  <div className={styles.spawningCardStat}>
                    <div className={styles.spawningCardStatIcon}>
                      <BsEgg />
                    </div>
                    <div className={styles.spawningCardStatContent}>
                      <div className={styles.spawningCardStatLabel}>
                        Peso dos Ovos:
                      </div>
                      <div className={styles.spawningCardStatValue}>
                        {form.egg_weight}kg
                      </div>
                    </div>
                  </div>

                  <div className={styles.spawningCardStat}>
                    <div className={styles.spawningCardStatIcon}>
                      <FaRegUser />
                    </div>
                    <div className={styles.spawningCardStatContent}>
                      <div className={styles.spawningCardStatLabel}>Autor:</div>
                      <div className={styles.spawningCardStatValue}>
                        {form.user?.name || form.userId || "Desconhecido"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.spawningCardFooter}>
                  <div
                    className={styles.viewDetailsButton}
                    onClick={() => navigateToSpawningDetails(form._id!)}
                  >
                    Mais detalhes <FaChartBar />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mensagem quando não há spawning forms */}
        {filteredSpawningForms.length === 0 && loading === false && (
          <div className={styles.noResults}>
            <BsInfoCircle size={32} />
            <p>Nenhum spawning form encontrado com os filtros aplicados.</p>
            <button
              className={styles.clearFilterButton}
              onClick={() => {
                setFilters({
                  animalId: "",
                  startDate: "",
                  userName: "",
                  endDate: "",
                });
                setHookFilters(filters);
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* Paginação */}
        {pagination && (
          <div className={styles.paginationContainer}>
            <button
              className={styles.paginationButton}
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!pagination.hasPreviousPage || currentPage === 1}
            >
              <FaChevronLeft /> Página anterior
            </button>
            <span className={styles.paginationInfo}>
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <button
              className={styles.paginationButton}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={
                !pagination.hasNextPage || currentPage === pagination.totalPages
              }
            >
              Próxima página <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Modal de Formulário */}
      {showModal && (
        <CustomModalForm
          title={
            modalMode === ModalMode.CREATE
              ? "Novo Spawning Form"
              : modalMode === ModalMode.UPDATE
              ? "Editar Spawning Form"
              : "Visualizar Spawning Form"
          }
          onClose={() => setShowModal(false)}
          onSubmit={handleSaveSpawningForm}
          isSubmitting={isSubmitting}
          fields={[
            {
              name: "date",
              label: "Data",
              type: "date",
              value:
                currentSpawningForm.date instanceof Date
                  ? currentSpawningForm.date.toISOString().split("T")[0]
                  : new Date(currentSpawningForm.date)
                      .toISOString()
                      .split("T")[0],
              onChange: (value) =>
                setCurrentSpawningForm({
                  ...currentSpawningForm,
                  date: new Date(value),
                }),
              disabled: modalMode === ModalMode.VIEW,
            },
            {
              name: "animalId",
              label: "ID do Animal",
              type: "text",
              value: currentSpawningForm.animalId,
              onChange: (value) =>
                setCurrentSpawningForm({
                  ...currentSpawningForm,
                  animalId: value,
                }),
              disabled: modalMode === ModalMode.VIEW,
            },
            {
              name: "beforeSpawn",
              label: "Peso Antes (kg)",
              type: "text",
              value: currentSpawningForm.animal_weight.beforeSpawn.toString(),
              onChange: (value) => {
                const formatted = formatNumber(value, 2);
                setCurrentSpawningForm({
                  ...currentSpawningForm,
                  animal_weight: {
                    ...currentSpawningForm.animal_weight,
                    beforeSpawn: parseFloat(formatted.replace(",", ".")) || 0,
                  },
                });
              },
              disabled: modalMode === ModalMode.VIEW,
              placeholder: "0,00",
            },
            {
              name: "afterSpawn",
              label: "Peso Depois (kg)",
              type: "text",
              value: currentSpawningForm.animal_weight.afterSpawn.toString(),
              onChange: (value) => {
                const formatted = formatNumber(value, 2);
                setCurrentSpawningForm({
                  ...currentSpawningForm,
                  animal_weight: {
                    ...currentSpawningForm.animal_weight,
                    afterSpawn: parseFloat(formatted.replace(",", ".")) || 0,
                  },
                });
              },
              disabled: modalMode === ModalMode.VIEW,
              placeholder: "0,00",
            },
            {
              name: "eggWeight",
              label: "Peso dos Ovos (kg)",
              type: "text",
              value: currentSpawningForm.egg_weight.toString(),
              onChange: (value) => {
                const formatted = formatNumber(value, 2);
                setCurrentSpawningForm({
                  ...currentSpawningForm,
                  egg_weight: parseFloat(formatted.replace(",", ".")) || 0,
                });
              },
              disabled: modalMode === ModalMode.VIEW,
              placeholder: "0,00",
            },
            {
              name: "hourDosage",
              label: "Hora da Dosagem",
              type: "text",
              value: currentSpawningForm.hormone.hour_dosage,
              onChange: (value) => {
                const formatted = formatTime(value);
                setCurrentSpawningForm({
                  ...currentSpawningForm,
                  hormone: {
                    ...currentSpawningForm.hormone,
                    hour_dosage: formatted,
                  },
                });
              },
              disabled: modalMode === ModalMode.VIEW,
              placeholder: "HH:MM",
            },
            {
              name: "hormoneQuantity",
              label: "Quantidade Hormônio (ml)",
              type: "text",
              value: currentSpawningForm.hormone.quantity.toString(),
              onChange: (value) => {
                const formatted = formatNumber(value, 1);
                setCurrentSpawningForm({
                  ...currentSpawningForm,
                  hormone: {
                    ...currentSpawningForm.hormone,
                    quantity: parseFloat(formatted.replace(",", ".")) || 0,
                  },
                });
              },
              disabled: modalMode === ModalMode.VIEW,
              placeholder: "0,0",
            },
          ]}
          infoBox={
            modalMode === ModalMode.VIEW &&
            currentSpawningForm.monitoring.length > 0 ? (
              <div>
                <h4>Monitoramentos:</h4>
                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    padding: "1rem",
                    borderRadius: "4px",
                  }}
                >
                  {currentSpawningForm.monitoring.map((monitoring, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "0.5rem",
                        padding: "0.5rem",
                        background: "#f8f9fa",
                        borderRadius: "4px",
                      }}
                    >
                      <strong>Hora:</strong> {monitoring.hour} |
                      <strong> Temperatura:</strong> {monitoring.temperature}°C
                      |<strong> Graus-hora:</strong> {monitoring.hour_degree}
                    </div>
                  ))}
                </div>
              </div>
            ) : undefined
          }
        />
      )}

      {/* Modal de Confirmação */}
      {showConfirmModal && (
        <ConfirmModal
          title="Confirmar Exclusão"
          message="Tem certeza que deseja excluir este spawning form? Esta ação não pode ser desfeita."
          onConfirm={handleDeleteSpawningForm}
          onCancel={() => setShowConfirmModal(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}
