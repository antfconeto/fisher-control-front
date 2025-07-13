"use client";

import { useState, useEffect } from "react";
import styles from "./spawning.module.css";
import {
  BsSearch,
  BsFilter,
  BsCalendar3,
  BsGraphUp,
  BsTable,
  BsPlus,
  BsPencil,
  BsTrash,
  BsEye,
  BsEgg,
  BsThermometer,
  BsDroplet,
  BsClock,
  BsInfoCircle,
} from "react-icons/bs";
import {
  FaFish,
  FaChartBar,
  FaCalendarAlt,
  FaTable,
  FaPlus,
  FaSave,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { ClockLoader } from "react-spinners";
import { Button } from "@/components/ui";
import { CustomModalForm } from "@/components/Forms/CustomModalForm";
import { ConfirmModal } from "@/components/Forms/ConfirmModal/ConfirmModal";
import { useErrorContext } from "@/contexts/errorContext";
import { ErrorBox } from "@/components/ErrorBox";
import { SpawningForm, Monitoring } from "@/types/types";
import { useSpawning } from "@/hooks/useSpawning";
import { GiFishEggs } from "react-icons/gi";

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
  userId: "",
};

export default function SpawningPage() {
  const router = useRouter();
  const { setErrorMessage, errorMessage } = useErrorContext();
  const { 
    spawningForms, 
    loading, 
    error, 
    createSpawningForm, 
    updateSpawningForm, 
    deleteSpawningForm 
  } = useSpawning();

  // Estados principais
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.CREATE);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentSpawningForm, setCurrentSpawningForm] = useState<SpawningForm>(defaultSpawningForm as SpawningForm);

  // Estados de filtro
  const [animalFilter, setAnimalFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Estados do calendário
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Funções de filtro
  const filteredSpawningForms = spawningForms.filter((form) => {
    const matchesAnimal = !animalFilter || 
      form.animalId.toLowerCase().includes(animalFilter.toLowerCase());

    return matchesAnimal;
  });

  // Paginação
  const totalPages = Math.ceil(filteredSpawningForms.length / itemsPerPage);
  const paginatedSpawningForms = filteredSpawningForms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Funções do calendário
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= lastDay || days.length < 42) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const getSpawningDays = () => {
    return spawningForms.map(form => form.date.toDateString());
  };

  const isSpawningDay = (date: Date) => {
    return getSpawningDays().includes(date.toDateString());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  // Funções de modal
  const openCreateModal = () => {
    setModalMode(ModalMode.CREATE);
    setCurrentSpawningForm(defaultSpawningForm as SpawningForm);
    setShowModal(true);
  };

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

  const handleSaveSpawningForm = async () => {
    try {
      if (modalMode === ModalMode.CREATE) {
        await createSpawningForm(currentSpawningForm);
      } else if (modalMode === ModalMode.UPDATE) {
        await updateSpawningForm(currentSpawningForm);
      }
      setShowModal(false);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const handleDeleteSpawningForm = async () => {
    try {
      await deleteSpawningForm(currentSpawningForm._id!);
      setShowConfirmModal(false);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const navigateToSpawningDetails = (spawningId: string) => {
    router.push(`/dashboard/spawning/${spawningId}`);
  };



  // Estatísticas
  const totalSpawningForms = spawningForms.length;
  const totalEggWeight = spawningForms.reduce((sum, form) => sum + form.egg_weight, 0);
  const averageWeightLoss = spawningForms.reduce((sum, form) => 
    sum + (form.animal_weight.beforeSpawn - form.animal_weight.afterSpawn), 0
  ) / spawningForms.length || 0;

  const daysInMonth = getDaysInMonth(currentMonth);
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

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
            <FaFish className={styles.titleIcon} /> Gestão de Spawning Forms
          </h2>
          <Button className={styles.createButton} onClick={openCreateModal} variant="primary">
            <FaPlus /> Novo Spawning Form
          </Button>
        </div>

        {/* Estatísticas */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <BsEgg className={styles.statIcon} />
            <div className={styles.statValue}>{totalSpawningForms}</div>
            <div className={styles.statLabel}>Total de Spawning</div>
          </div>
          <div className={styles.statCard}>
            <BsDroplet className={styles.statIcon} />
            <div className={styles.statValue}>{totalEggWeight.toFixed(2)}kg</div>
            <div className={styles.statLabel}>Peso Total dos Ovos</div>
          </div>
          <div className={styles.statCard}>
            <BsThermometer className={styles.statIcon} />
            <div className={styles.statValue}>{averageWeightLoss.toFixed(2)}kg</div>
            <div className={styles.statLabel}>Perda Média de Peso</div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className={styles.dashboardGrid}>
          {/* Gráfico */}
          <div className={styles.chartSection}>
            <div className={styles.chartTitle}>
              <BsGraphUp /> Estatísticas de Spawning
            </div>
            <div className={styles.chartContainer}>
              <div className={styles.chartPlaceholder}>
                <FaChartBar style={{ fontSize: '3rem', marginBottom: '1rem' }} />
                <p>Gráfico de estatísticas de spawning</p>
                <p>Implementar com biblioteca de gráficos</p>
              </div>
            </div>
          </div>

          {/* Calendário */}
          <div className={styles.calendarSection}>
            <div className={styles.chartTitle}>
              <BsCalendar3 /> Calendário de Spawning
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ←
              </button>
              <h3 style={{ margin: 0 }}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                →
              </button>
            </div>

            <div className={styles.calendarHeader}>
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className={styles.calendarDayHeader}>{day}</div>
              ))}
            </div>

            <div className={styles.calendarContainer}>
              {daysInMonth.map((day, index) => {
                const dayClasses = [
                  styles.calendarDay,
                  isToday(day) ? styles.today : '',
                  isSpawningDay(day) ? styles.spawning : '',
                  !isCurrentMonth(day) ? styles.otherMonth : '',
                  selectedDate && day.toDateString() === selectedDate.toDateString() ? styles.selected : '',
                ].filter(Boolean).join(' ');

                return (
                  <div
                    key={index}
                    className={dayClasses}
                    onClick={() => setSelectedDate(day)}
                    title={isSpawningDay(day) ? 'Dia com spawning' : ''}
                  >
                    {day.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Filtros */}
        <section className={styles.filterSection}>
          <div className={styles.filterLabel}>
            <BsFilter /> Filtros
          </div>
          <div className={styles.filterContainer}>
            <div className={styles.filterInput}>
              <BsSearch className={styles.filterIcon} />
              <input
                type="text"
                placeholder="ID do Animal"
                value={animalFilter}
                onChange={(e) => setAnimalFilter(e.target.value)}
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
            {paginatedSpawningForms.map((form) => (
              <div
                key={form._id}
                className={styles.spawningCard}
              >
                <div className={styles.spawningCardHeader}>
                  <h3 className={styles.spawningCardTitle}>
                    <GiFishEggs size={30} color="#0a58ca" />  Spawning
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
                      <div className={styles.spawningCardStatLabel}>
                        Data:
                      </div>
                      <div className={styles.spawningCardStatValue}>
                        {form.date.toLocaleDateString("pt-BR")}
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
                </div>

                <div className={styles.spawningCardFooter}>
                  <div className={styles.viewDetailsButton}
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
              onClick={() => setAnimalFilter("")}
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 0 && (
          <div className={styles.pagination}>
            <button
              className={styles.paginationButton}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              aria-label="Página anterior"
            >
              <FaChevronLeft /> Anterior
            </button>
            <div className={styles.paginationInfo}>
              Página {currentPage} de {totalPages}
            </div>
            <button
              className={styles.paginationButton}
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              aria-label="Próxima página"
            >
              Próxima <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Modal de Formulário */}
      {showModal && (
        <CustomModalForm
          title={
            modalMode === ModalMode.CREATE ? "Novo Spawning Form" :
            modalMode === ModalMode.UPDATE ? "Editar Spawning Form" :
            "Visualizar Spawning Form"
          }
          onClose={() => setShowModal(false)}
          onSubmit={handleSaveSpawningForm}
          fields={[
            {
              name: "date",
              label: "Data",
              type: "date",
              value: currentSpawningForm.date.toISOString().split('T')[0],
              onChange: (value) => setCurrentSpawningForm({
                ...currentSpawningForm,
                date: new Date(value)
              }),
              disabled: modalMode === ModalMode.VIEW
            },
            {
              name: "animalId",
              label: "ID do Animal",
              type: "text",
              value: currentSpawningForm.animalId,
              onChange: (value) => setCurrentSpawningForm({
                ...currentSpawningForm,
                animalId: value
              }),
              disabled: modalMode === ModalMode.VIEW
            },
            {
              name: "beforeSpawn",
              label: "Peso Antes (kg)",
              type: "number",
              value: currentSpawningForm.animal_weight.beforeSpawn,
              onChange: (value) => setCurrentSpawningForm({
                ...currentSpawningForm,
                animal_weight: {
                  ...currentSpawningForm.animal_weight,
                  beforeSpawn: parseFloat(value) || 0
                }
              }),
              disabled: modalMode === ModalMode.VIEW
            },
            {
              name: "afterSpawn",
              label: "Peso Depois (kg)",
              type: "number",
              value: currentSpawningForm.animal_weight.afterSpawn,
              onChange: (value) => setCurrentSpawningForm({
                ...currentSpawningForm,
                animal_weight: {
                  ...currentSpawningForm.animal_weight,
                  afterSpawn: parseFloat(value) || 0
                }
              }),
              disabled: modalMode === ModalMode.VIEW
            },
            {
              name: "eggWeight",
              label: "Peso dos Ovos (kg)",
              type: "number",
              value: currentSpawningForm.egg_weight,
              onChange: (value) => setCurrentSpawningForm({
                ...currentSpawningForm,
                egg_weight: parseFloat(value) || 0
              }),
              disabled: modalMode === ModalMode.VIEW
            },
            {
              name: "hourDosage",
              label: "Hora da Dosagem",
              type: "text",
              value: currentSpawningForm.hormone.hour_dosage,
              onChange: (value) => setCurrentSpawningForm({
                ...currentSpawningForm,
                hormone: {
                  ...currentSpawningForm.hormone,
                  hour_dosage: value
                }
              }),
              disabled: modalMode === ModalMode.VIEW
            },
            {
              name: "hormoneQuantity",
              label: "Quantidade Hormônio (ml)",
              type: "number",
              value: currentSpawningForm.hormone.quantity,
              onChange: (value) => setCurrentSpawningForm({
                ...currentSpawningForm,
                hormone: {
                  ...currentSpawningForm.hormone,
                  quantity: parseFloat(value) || 0
                }
              }),
              disabled: modalMode === ModalMode.VIEW
            }
          ]}
          infoBox={
            modalMode === ModalMode.VIEW && currentSpawningForm.monitoring.length > 0 ? (
              <div>
                <h4>Monitoramentos:</h4>
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
                  {currentSpawningForm.monitoring.map((monitoring, index) => (
                    <div key={index} style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#f8f9fa', borderRadius: '4px' }}>
                      <strong>Hora:</strong> {monitoring.hour} | 
                      <strong> Temperatura:</strong> {monitoring.temperature}°C | 
                      <strong> Graus-hora:</strong> {monitoring.hour_degree}
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
        />
      )}
    </>
  );
}
