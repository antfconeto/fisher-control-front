"use client";

import { useState } from "react";
import styles from "./tanks.module.css";
import {
  BsDropletFill,
  BsPencil,
  BsTrash,
  BsSearch,
  BsInfoCircle,
  BsFilter,
} from "react-icons/bs";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaSave,
  FaTimes,
  FaWater,
  FaFish,
  FaChartBar,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Tank {
  id: string;
  capacity: number;
  size: {
    width: number;
    height: number;
  };
  // Propriedades calculadas a partir de dados de outros endpoints
  animalsCount?: number;
}

enum ModalMode {
  CREATE = "create",
  UPDATE = "update",
}

export default function TanksPage() {
  const router = useRouter();

  const [tanks, setTanks] = useState<Tank[]>([
    {
      id: "1",
      capacity: 1000,
      size: { width: 20, height: 2 },
      animalsCount: 24,
    },
    {
      id: "2",
      capacity: 2000,
      size: { width: 25, height: 2.5 },
      animalsCount: 42,
    },
    {
      id: "3",
      capacity: 1500,
      size: { width: 18, height: 1.8 },
      animalsCount: 30,
    },
    {
      id: "4",
      capacity: 3000,
      size: { width: 30, height: 3 },
      animalsCount: 58,
    },
    {
      id: "5",
      capacity: 2500,
      size: { width: 28, height: 2.8 },
      animalsCount: 48,
    },
    {
      id: "6",
      capacity: 1000,
      size: { width: 20, height: 2 },
      animalsCount: 18,
    },
    {
      id: "7",
      capacity: 2000,
      size: { width: 25, height: 2.5 },
      animalsCount: 35,
    },
    {
      id: "8",
      capacity: 1500,
      size: { width: 18, height: 1.8 },
      animalsCount: 28,
    },
    {
      id: "9",
      capacity: 3000,
      size: { width: 30, height: 3 },
      animalsCount: 60,
    },
    {
      id: "10",
      capacity: 2500,
      size: { width: 28, height: 2.8 },
      animalsCount: 45,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.CREATE);

  const [nameFilter, setNameFilter] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("");

  const [editingTankId, setEditingTankId] = useState<string | null>(null);

  const [currentTank, setCurrentTank] = useState<
    Omit<Tank, "id" | "animalsCount">
  >({
    capacity: 0,
    size: {
      width: 0,
      height: 0,
    },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Aumentado para exibir mais cards por página

  const filteredTanks = tanks.filter((tank) => {
    const tankName = `Tanque ${tank.id}`;
    return (
      tankName.toLowerCase().includes(nameFilter.toLowerCase()) &&
      (capacityFilter === "" ||
        tank.capacity.toString().includes(capacityFilter))
    );
  });

  const totalPages = Math.ceil(filteredTanks.length / itemsPerPage);

  const paginatedTanks = filteredTanks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openCreateModal = () => {
    setModalMode(ModalMode.CREATE);
    setCurrentTank({
      capacity: 0,
      size: {
        width: 0,
        height: 0,
      },
    });
    setShowModal(true);
  };

  const openUpdateModal = (tank: Tank, event: React.MouseEvent) => {
    event.stopPropagation(); // Previne navegação ao clicar no botão de editar
    setModalMode(ModalMode.UPDATE);
    setCurrentTank({
      capacity: tank.capacity,
      size: {
        width: tank.size.width,
        height: tank.size.height,
      },
    });
    setEditingTankId(tank.id);
    setShowModal(true);
  };

  const handleSaveTank = () => {
    if (
      currentTank.capacity > 0 &&
      currentTank.size.width > 0 &&
      currentTank.size.height > 0
    ) {
      if (modalMode === ModalMode.CREATE) {
        // Em uma implementação real, este ID seria gerado pelo backend
        const newId = String(
          Math.max(...tanks.map((t) => Number(t.id)), 0) + 1
        );
        setTanks([
          ...tanks,
          {
            ...currentTank,
            id: newId,
            animalsCount: 0,
          },
        ]);
      } else {
        if (editingTankId !== null) {
          setTanks(
            tanks.map((tank) =>
              tank.id === editingTankId
                ? {
                    ...tank,
                    capacity: currentTank.capacity,
                    size: currentTank.size,
                  }
                : tank
            )
          );
        }
      }

      setShowModal(false);
      setEditingTankId(null);
    }
  };

  const handleDeleteTank = (id: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Previne navegação ao clicar no botão de deletar
    if (confirm("Tem certeza que deseja excluir este tanque?")) {
      setTanks(tanks.filter((tank) => tank.id !== id));
    }
  };

  const navigateToTankDetails = (tankId: string) => {
    // Navega para a página de detalhes do tanque
    router.push(`/dashboard/tanks/${tankId}`);
  };

  return (
    <>
      <div className="page-container">
        <div className="content-container">
          <div className="content-card">
            {/* Cabeçalho com título e botão de criar */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <h2 className={styles.pageTitle}>
                <FaWater className={styles.pageTitleIcon} /> Gestão de Tanques
              </h2>
              <button className={styles.createButton} onClick={openCreateModal}>
                <FaPlus /> Criar Novo Tanque
              </button>
            </div>

            {/* Filtros */}
            <section className={styles.filterSection}>
              <div className={styles.filterLabel}>
                <BsFilter /> Filtro por tanques
              </div>
              <div className={styles.filterContainer}>
                <div className={styles.searchInput}>
                  <BsSearch className={styles.filterIcon} />
                  <input
                    type="text"
                    placeholder="Nome do tanque"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                  />
                </div>
                <div className={styles.filterInput}>
                  <BsDropletFill className={styles.filterIcon} />
                  <input
                    type="text"
                    placeholder="Capacidade"
                    value={capacityFilter}
                    onChange={(e) => setCapacityFilter(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Cards de tanques */}
            <div className={styles.cardsContainer}>
              {paginatedTanks.map((tank) => (
                <div
                  key={tank.id}
                  className={styles.tankCard}
                  onClick={() => navigateToTankDetails(tank.id)}
                >
                  <div className={styles.tankCardHeader}>
                    <h3 className={styles.tankCardTitle}>
                      <BsDropletFill className={styles.tankCardIcon} /> Tanque{" "}
                      {tank.id}
                    </h3>
                    <div className={styles.tankCardActions}>
                      <button
                        className={styles.updateButton}
                        onClick={(e) => openUpdateModal(tank, e)}
                        aria-label="Editar tanque"
                      >
                        <BsPencil />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={(e) => handleDeleteTank(tank.id, e)}
                        aria-label="Excluir tanque"
                      >
                        <BsTrash />
                      </button>
                    </div>
                  </div>

                  <div className={styles.tankCardBody}>
                    <div className={styles.tankCardStat}>
                      <div className={styles.tankCardStatIcon}>
                        <BsDropletFill />
                      </div>
                      <div className={styles.tankCardStatContent}>
                        <div className={styles.tankCardStatLabel}>
                          Capacidade:
                        </div>
                        <div className={styles.tankCardStatValue}>
                          {tank.capacity} L
                        </div>
                      </div>
                    </div>

                    <div className={styles.tankCardStat}>
                      <div className={styles.tankCardStatIcon}>
                        <BsDropletFill />
                      </div>
                      <div className={styles.tankCardStatContent}>
                        <div className={styles.tankCardStatLabel}>
                          Dimensões:
                        </div>
                        <div className={styles.tankCardStatValue}>
                          {tank.size.width}×{tank.size.height} m
                        </div>
                      </div>
                    </div>

                    <div className={styles.tankCardStat}>
                      <div className={styles.tankCardStatIcon}>
                        <FaFish />
                      </div>
                      <div className={styles.tankCardStatContent}>
                        <div className={styles.tankCardStatLabel}>Animais:</div>
                        <div className={styles.tankCardStatValue}>
                          {tank.animalsCount || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.tankCardFooter}>
                    <div className={styles.viewDetailsButton}>
                      Ver detalhes <FaChartBar />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mensagem quando não há tanques */}
            {filteredTanks.length === 0 && (
              <div className={styles.noResults}>
                <BsInfoCircle size={32} />
                <p>Nenhum tanque encontrado com os filtros aplicados.</p>
                <button
                  className={styles.clearFilterButton}
                  onClick={() => {
                    setNameFilter("");
                    setCapacityFilter("");
                  }}
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
        </div>
      </div>

      {/* Modal de Criação/Atualização */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {modalMode === ModalMode.CREATE
                  ? "Criar Novo Tanque"
                  : "Atualizar Tanque"}
              </h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowModal(false)}
                aria-label="Fechar modal"
              >
                <FaTimes />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="tankName">
                  Nome do Tanque
                </label>
                <input
                  id="tankName"
                  type="text"
                  className={styles.formInput}
                  value={
                    editingTankId ? `Tanque ${editingTankId}` : "Novo Tanque"
                  }
                  disabled
                  placeholder="Nome gerado automaticamente"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="capacity">
                  Capacidade (Litros)
                </label>
                <input
                  id="capacity"
                  type="number"
                  className={styles.formInput}
                  value={currentTank.capacity}
                  onChange={(e) =>
                    setCurrentTank({
                      ...currentTank,
                      capacity: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="Digite a capacidade em litros"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="width">
                  Largura (Metros)
                </label>
                <input
                  id="width"
                  type="number"
                  className={styles.formInput}
                  value={currentTank.size.width}
                  onChange={(e) =>
                    setCurrentTank({
                      ...currentTank,
                      size: {
                        ...currentTank.size,
                        width: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="Digite a largura em metros"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="height">
                  Altura (Metros)
                </label>
                <input
                  id="height"
                  type="number"
                  className={styles.formInput}
                  value={currentTank.size.height}
                  onChange={(e) =>
                    setCurrentTank({
                      ...currentTank,
                      size: {
                        ...currentTank.size,
                        height: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="Digite a altura em metros"
                />
              </div>
              <div className={styles.infoBox}>
                <h4 className={styles.infoTitle}>
                  <BsInfoCircle /> Informações
                </h4>
                <ul className={styles.infoList}>
                  <li className={styles.infoListItem}>
                    Insira todas as informações obrigatórias para o tanque.
                  </li>
                  <li className={styles.infoListItem}>
                    A capacidade deve ser informada em litros.
                  </li>
                  <li className={styles.infoListItem}>
                    As dimensões devem ser informadas em metros.
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
              <button className={styles.saveButton} onClick={handleSaveTank}>
                <FaSave /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
