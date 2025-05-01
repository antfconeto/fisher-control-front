"use client";

import { useState } from "react";
import styles from "./spawn.module.css";
import {
  BsSearch,
  BsFilter,
  BsInfoCircle,
  BsPencil,
  BsTrash,
  BsThermometer,
} from "react-icons/bs";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaSave,
  FaTimes,
  FaEgg,
  FaWeight,
  FaCalendarAlt,
  FaUser,
  FaSyringe,
  FaClock,
  FaFish,
} from "react-icons/fa";

interface Monitoring {
  hour: string;
  temperature: number;
  hour_degree: number;
}

interface SpawnForm {
  id: string;
  date: Date;
  animal_weight: {
    beforeSpawn: number;
    afterSpawn: number;
  };
  egg_weight: number;
  hormone: {
    hour_dosage: string;
    quantity: number;
  };
  monitoring: Monitoring[];
  animal_Id: string;
  user_Id: string;
}

enum ModalMode {
  CREATE = "create",
  UPDATE = "update",
}

export default function SpawnPage() {
  const [spawnForms, setSpawnForms] = useState<SpawnForm[]>([
    {
      id: "SF001",
      date: new Date("2023-01-20"),
      animal_weight: {
        beforeSpawn: 2.5,
        afterSpawn: 2.1,
      },
      egg_weight: 0.3,
      hormone: {
        hour_dosage: "08:00",
        quantity: 0.5,
      },
      monitoring: [
        {
          hour: "09:00",
          temperature: 25.5,
          hour_degree: 25.5,
        },
        {
          hour: "12:00",
          temperature: 26.2,
          hour_degree: 78.6,
        },
        {
          hour: "15:00",
          temperature: 26.8,
          hour_degree: 159.0,
        },
      ],
      animal_Id: "A001",
      user_Id: "U001",
    },
    {
      id: "SF002",
      date: new Date("2023-02-15"),
      animal_weight: {
        beforeSpawn: 3.2,
        afterSpawn: 2.7,
      },
      egg_weight: 0.4,
      hormone: {
        hour_dosage: "09:30",
        quantity: 0.6,
      },
      monitoring: [
        {
          hour: "10:30",
          temperature: 25.8,
          hour_degree: 25.8,
        },
        {
          hour: "13:30",
          temperature: 26.5,
          hour_degree: 79.5,
        },
        {
          hour: "16:30",
          temperature: 27.0,
          hour_degree: 161.0,
        },
      ],
      animal_Id: "A002",
      user_Id: "U002",
    },
    {
      id: "SF003",
      date: new Date("2023-03-10"),
      animal_weight: {
        beforeSpawn: 2.8,
        afterSpawn: 2.3,
      },
      egg_weight: 0.35,
      hormone: {
        hour_dosage: "08:15",
        quantity: 0.55,
      },
      monitoring: [
        {
          hour: "09:15",
          temperature: 25.2,
          hour_degree: 25.2,
        },
        {
          hour: "12:15",
          temperature: 26.0,
          hour_degree: 78.0,
        },
        {
          hour: "15:15",
          temperature: 26.5,
          hour_degree: 158.5,
        },
      ],
      animal_Id: "A003",
      user_Id: "U001",
    },
    {
      id: "SF004",
      date: new Date("2023-04-05"),
      animal_weight: {
        beforeSpawn: 3.5,
        afterSpawn: 3.0,
      },
      egg_weight: 0.45,
      hormone: {
        hour_dosage: "07:45",
        quantity: 0.65,
      },
      monitoring: [
        {
          hour: "08:45",
          temperature: 25.6,
          hour_degree: 25.6,
        },
        {
          hour: "11:45",
          temperature: 26.3,
          hour_degree: 78.9,
        },
        {
          hour: "14:45",
          temperature: 26.9,
          hour_degree: 160.5,
        },
      ],
      animal_Id: "A004",
      user_Id: "U002",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.CREATE);

  const [idFilter, setIdFilter] = useState("");
  const [animalFilter, setAnimalFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [editingSpawnId, setEditingSpawnId] = useState<string | null>(null);

  const [currentSpawnForm, setCurrentSpawnForm] = useState<SpawnForm>({
    id: "",
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
    monitoring: [
      {
        hour: "",
        temperature: 0,
        hour_degree: 0,
      },
    ],
    animal_Id: "",
    user_Id: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredSpawnForms = spawnForms.filter((spawn) => {
    const dateString = spawn.date.toLocaleDateString("pt-BR");
    return (
      spawn.id.toLowerCase().includes(idFilter.toLowerCase()) &&
      spawn.animal_Id.toLowerCase().includes(animalFilter.toLowerCase()) &&
      dateString.includes(dateFilter)
    );
  });

  const totalPages = Math.ceil(filteredSpawnForms.length / itemsPerPage);

  const paginatedSpawnForms = filteredSpawnForms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openCreateModal = () => {
    setModalMode(ModalMode.CREATE);
    setCurrentSpawnForm({
      id: "",
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
      monitoring: [
        {
          hour: "",
          temperature: 0,
          hour_degree: 0,
        },
      ],
      animal_Id: "",
      user_Id: "",
    });
    setShowModal(true);
  };

  const openUpdateModal = (spawnForm: SpawnForm) => {
    setModalMode(ModalMode.UPDATE);
    setCurrentSpawnForm({
      ...spawnForm,
      date: new Date(spawnForm.date),
    });
    setEditingSpawnId(spawnForm.id);
    setShowModal(true);
  };

  const addMonitoring = () => {
    setCurrentSpawnForm({
      ...currentSpawnForm,
      monitoring: [
        ...currentSpawnForm.monitoring,
        {
          hour: "",
          temperature: 0,
          hour_degree: 0,
        },
      ],
    });
  };

  const removeMonitoring = (index: number) => {
    if (currentSpawnForm.monitoring.length > 1) {
      const updatedMonitoring = [...currentSpawnForm.monitoring];
      updatedMonitoring.splice(index, 1);
      setCurrentSpawnForm({
        ...currentSpawnForm,
        monitoring: updatedMonitoring,
      });
    }
  };

  const updateMonitoring = (
    index: number,
    field: keyof Monitoring,
    value: string | number
  ) => {
    const updatedMonitoring = [...currentSpawnForm.monitoring];
    if (field === "hour") {
      updatedMonitoring[index].hour = value as string;
    } else if (field === "temperature") {
      updatedMonitoring[index].temperature = Number(value);
      if (index > 0) {
        const firstHour = new Date(`2000-01-01T${updatedMonitoring[0].hour}`);
        const currentHour = new Date(
          `2000-01-01T${updatedMonitoring[index].hour}`
        );
        const hoursDiff =
          (currentHour.getTime() - firstHour.getTime()) / (1000 * 60 * 60);
        updatedMonitoring[index].hour_degree = Number(value) * hoursDiff;
      } else {
        updatedMonitoring[index].hour_degree = Number(value);
      }
    }
    setCurrentSpawnForm({
      ...currentSpawnForm,
      monitoring: updatedMonitoring,
    });
  };

  const handleSaveSpawnForm = () => {
    if (
      currentSpawnForm.id &&
      currentSpawnForm.date &&
      currentSpawnForm.animal_Id &&
      currentSpawnForm.user_Id
    ) {
      if (modalMode === ModalMode.CREATE) {
        setSpawnForms([...spawnForms, currentSpawnForm]);
      } else {
        if (editingSpawnId !== null) {
          setSpawnForms(
            spawnForms.map((spawn) =>
              spawn.id === editingSpawnId ? currentSpawnForm : spawn
            )
          );
        }
      }

      setShowModal(false);
      setEditingSpawnId(null);
    }
  };

  const handleDeleteSpawnForm = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este formulário de desova?")) {
      setSpawnForms(spawnForms.filter((spawn) => spawn.id !== id));
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <>
      <div className="page-container">
        <div className="content-container">
          <div className="content-card">
            {/* Cabeçalho com título e botão de criar */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="card-title mb-0">
                <FaEgg className="me-2 text-primary" /> Formulários de Desova
              </h2>
              <button className={styles.createButton} onClick={openCreateModal}>
                <FaPlus /> Cadastrar Nova Desova
              </button>
            </div>

            {/* Filtros */}
            <section className={styles.filterSection}>
              <div className={styles.filterLabel}>
                <BsFilter /> Filtro por desovas
              </div>
              <div className={styles.filterContainer}>
                <div className={styles.searchInput}>
                  <BsSearch className={styles.filterIcon} />
                  <input
                    type="text"
                    placeholder="ID do formulário"
                    value={idFilter}
                    onChange={(e) => setIdFilter(e.target.value)}
                  />
                </div>
                <div className={styles.filterInput}>
                  <FaFish className={styles.filterIcon} />
                  <input
                    type="text"
                    placeholder="ID do animal"
                    value={animalFilter}
                    onChange={(e) => setAnimalFilter(e.target.value)}
                  />
                </div>
                <div className={styles.filterInput}>
                  <FaCalendarAlt className={styles.filterIcon} />
                  <input
                    type="text"
                    placeholder="Data (dd/mm/aaaa)"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Tabela de desovas */}
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.tableHeader}>ID</th>
                    <th className={styles.tableHeader}>Data</th>
                    <th className={styles.tableHeader}>Animal</th>
                    <th className={styles.tableHeader}>Peso do Ovo</th>
                    <th className={styles.tableHeader}>Hormonas</th>
                    <th className={styles.tableHeader}>Monitoramentos</th>
                    <th className={styles.tableHeader}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSpawnForms.map((spawn) => (
                    <tr key={spawn.id} className={styles.tableRow}>
                      <td className={styles.tableCell}>{spawn.id}</td>
                      <td className={styles.tableCell}>
                        <div className={styles.cellContent}>
                          <FaCalendarAlt /> {formatDate(spawn.date)}
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.cellContent}>
                          <FaFish /> {spawn.animal_Id}
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.cellContent}>
                          <FaEgg /> {spawn.egg_weight} kg
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.cellContent}>
                          <FaSyringe /> {spawn.hormone.quantity} ml às{" "}
                          {spawn.hormone.hour_dosage}
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.cellContent}>
                          <BsThermometer /> {spawn.monitoring.length} registros
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.actionsCell}>
                          <button
                            className={styles.updateButton}
                            onClick={() => openUpdateModal(spawn)}
                          >
                            <BsPencil /> Atualizar
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteSpawnForm(spawn.id)}
                          >
                            <BsTrash /> Deletar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {totalPages > 0 && (
              <div className={styles.pagination}>
                <button
                  className={styles.paginationButton}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
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
                >
                  Próxima <FaChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Criação/Atualização */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {modalMode === ModalMode.CREATE
                  ? "Cadastrar Novo Formulário de Desova"
                  : "Atualizar Formulário de Desova"}
              </h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>ID do Formulário</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={currentSpawnForm.id}
                  onChange={(e) =>
                    setCurrentSpawnForm({
                      ...currentSpawnForm,
                      id: e.target.value,
                    })
                  }
                  placeholder="Digite o ID do formulário"
                  disabled={modalMode === ModalMode.UPDATE}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaCalendarAlt /> Data da Desova
                </label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={currentSpawnForm.date.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setCurrentSpawnForm({
                      ...currentSpawnForm,
                      date: new Date(e.target.value),
                    })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaFish /> ID do Animal
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={currentSpawnForm.animal_Id}
                  onChange={(e) =>
                    setCurrentSpawnForm({
                      ...currentSpawnForm,
                      animal_Id: e.target.value,
                    })
                  }
                  placeholder="Digite o ID do animal"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaUser /> ID do Usuário
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={currentSpawnForm.user_Id}
                  onChange={(e) =>
                    setCurrentSpawnForm({
                      ...currentSpawnForm,
                      user_Id: e.target.value,
                    })
                  }
                  placeholder="Digite o ID do usuário"
                />
              </div>

              <h4 className={styles.sectionTitle}>
                <FaWeight /> Peso do Animal
              </h4>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Antes da Desova (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.formInput}
                    value={currentSpawnForm.animal_weight.beforeSpawn}
                    onChange={(e) =>
                      setCurrentSpawnForm({
                        ...currentSpawnForm,
                        animal_weight: {
                          ...currentSpawnForm.animal_weight,
                          beforeSpawn: Number(e.target.value),
                        },
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Depois da Desova (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.formInput}
                    value={currentSpawnForm.animal_weight.afterSpawn}
                    onChange={(e) =>
                      setCurrentSpawnForm({
                        ...currentSpawnForm,
                        animal_weight: {
                          ...currentSpawnForm.animal_weight,
                          afterSpawn: Number(e.target.value),
                        },
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaEgg /> Peso dos Ovos (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className={styles.formInput}
                  value={currentSpawnForm.egg_weight}
                  onChange={(e) =>
                    setCurrentSpawnForm({
                      ...currentSpawnForm,
                      egg_weight: Number(e.target.value),
                    })
                  }
                  placeholder="0.00"
                />
              </div>

              <h4 className={styles.sectionTitle}>
                <FaSyringe /> Hormônio
              </h4>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <FaClock /> Hora da Dosagem
                  </label>
                  <input
                    type="time"
                    className={styles.formInput}
                    value={currentSpawnForm.hormone.hour_dosage}
                    onChange={(e) =>
                      setCurrentSpawnForm({
                        ...currentSpawnForm,
                        hormone: {
                          ...currentSpawnForm.hormone,
                          hour_dosage: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Quantidade (ml)</label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.formInput}
                    value={currentSpawnForm.hormone.quantity}
                    onChange={(e) =>
                      setCurrentSpawnForm({
                        ...currentSpawnForm,
                        hormone: {
                          ...currentSpawnForm.hormone,
                          quantity: Number(e.target.value),
                        },
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>

              <h4 className={styles.sectionTitle}>
                <BsThermometer /> Monitoramento
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={addMonitoring}
                >
                  <FaPlus /> Adicionar Monitoramento
                </button>
              </h4>

              {currentSpawnForm.monitoring.map((monitor, index) => (
                <div key={index} className={styles.monitoringItem}>
                  <div className={styles.monitoringHeader}>
                    <h5 className={styles.monitoringTitle}>
                      Monitoramento {index + 1}
                    </h5>
                    {currentSpawnForm.monitoring.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => removeMonitoring(index)}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <FaClock /> Hora
                      </label>
                      <input
                        type="time"
                        className={styles.formInput}
                        value={monitor.hour}
                        onChange={(e) =>
                          updateMonitoring(index, "hour", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <BsThermometer /> Temperatura (°C)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className={styles.formInput}
                        value={monitor.temperature}
                        onChange={(e) =>
                          updateMonitoring(index, "temperature", e.target.value)
                        }
                        placeholder="0.0"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Hora-Grau</label>
                      <input
                        type="number"
                        step="0.1"
                        className={styles.formInput}
                        value={monitor.hour_degree.toFixed(1)}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className={styles.infoBox}>
                <h4 className={styles.infoTitle}>
                  <BsInfoCircle /> Informações
                </h4>
                <ul className={styles.infoList}>
                  <li className={styles.infoListItem}>
                    O ID do formulário deve ser único no sistema.
                  </li>
                  <li className={styles.infoListItem}>
                    Certifique-se de inserir um ID de animal válido existente no
                    sistema.
                  </li>
                  <li className={styles.infoListItem}>
                    A Hora-Grau é calculada automaticamente (temperatura × horas
                    desde a primeira medição).
                  </li>
                  <li className={styles.infoListItem}>
                    Adicione múltiplos monitoramentos para acompanhar o
                    progresso da desova.
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowModal(false)}
              >
                <FaTimes /> Cancelar
              </button>
              <button
                className={styles.saveButton}
                onClick={handleSaveSpawnForm}
              >
                <FaSave /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
