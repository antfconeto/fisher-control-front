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
  getSpawnStats,
  SpawningStats,
} from "@/actions/spawnForm";
import { GiFishEggs } from "react-icons/gi";
import { useNotification } from "@/contexts/notificationContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUser } from "@/hooks/userHook";
import { getDashboardStats } from "@/actions/dashboard";
import { AdminOnly } from "@/components/Authorization";

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
  const { successNotification, errorNotification } = useNotification();

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
    getStats();
  }, []);

  async function getStats() {
    let stats = await getSpawnStats();
    if ("error" in stats) {
      setErrorMessage(stats.error);
      return;
    }
    setDashboardStats({
      totalEggWeight: stats.totalEggWeight,
      averageWeightLoss: stats.averageWeightLoss,
      totalSpawns: stats.totalSpawns,
    });
  }

  
  // Funções de filtro
  const filteredSpawningForms = spawnForms.filter((form) => {
    const matchesAnimal =
      !filters.animalId ||
      form.animalId.toLowerCase().includes(filters.animalId.toLowerCase());

    return matchesAnimal;
  });


  const openUpdateModal = (form: SpawningForm) => {
    setModalMode(ModalMode.UPDATE);
    setCurrentSpawningForm(form);
    setShowModal(true);
  };

  const reloadData = () => {
    setCurrentPage(1);
    getStats()
    setHookFilters({ ...hookFilters });
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
      setCurrentPage(1);
      setShowConfirmModal(false);
      reloadData();
    } catch (error: any) {
      const errMsg = error.message || "Erro desconhecido";
      errorNotification("Erro!", `Erro ao deletar spawning form: ${errMsg}`);
      setErrorMessage(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToSpawningDetails = (spawningId: string) => {
    router.push(`/dashboard/spawning/${spawningId}`);
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
          <AdminOnly> 
          <Button
            className={styles.createButton}
            onClick={() => router.push("/dashboard/spawning/register")}
            variant="primary"
          >
            <FaPlus /> Registrar nova desova
          </Button>
          </AdminOnly>
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
                  <AdminOnly>
                  <div className={styles.spawningCardActions}>
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
                  </AdminOnly>
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
                        {form.user?.name || "Desconhecido"}
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
