"use client";

import { useState } from "react";
import styles from "./tanks.module.css";
import {
  BsDropletFill,
  BsPencil,
  BsTrash,
  BsRulers,
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
} from "react-icons/fa";

interface Tank {
  id: number;
  name: string;
  capacity: number;
  width: number;
  height: number;
}

enum ModalMode {
  CREATE = "create",
  UPDATE = "update",
}

export default function TanksPage() {
  const [tanks, setTanks] = useState<Tank[]>([
    { id: 1, name: "Tanck1", capacity: 1000, width: 20, height: 2 },
    { id: 2, name: "Tanck2", capacity: 2000, width: 25, height: 2.5 },
    { id: 3, name: "Tanck3", capacity: 1500, width: 18, height: 1.8 },
    { id: 4, name: "Tanck4", capacity: 3000, width: 30, height: 3 },
    { id: 5, name: "Tanck5", capacity: 2500, width: 28, height: 2.8 },
    { id: 6, name: "Tanck1", capacity: 1000, width: 20, height: 2 },
    { id: 7, name: "Tanck2", capacity: 2000, width: 25, height: 2.5 },
    { id: 8, name: "Tanck3", capacity: 1500, width: 18, height: 1.8 },
    { id: 9, name: "Tanck4", capacity: 3000, width: 30, height: 3 },
    { id: 10, name: "Tanck5", capacity: 2500, width: 28, height: 2.8 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.CREATE);

  const [nameFilter, setNameFilter] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("");
  const [widthFilter, setWidthFilter] = useState("");
  const [heightFilter, setHeightFilter] = useState("");

  const [editingTankId, setEditingTankId] = useState<number | null>(null);

  const [currentTank, setCurrentTank] = useState<Omit<Tank, "id">>({
    name: "",
    capacity: 0,
    width: 0,
    height: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredTanks = tanks.filter((tank) => {
    return (
      tank.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      (capacityFilter === "" ||
        tank.capacity.toString().includes(capacityFilter)) &&
      (widthFilter === "" || tank.width.toString().includes(widthFilter)) &&
      (heightFilter === "" || tank.height.toString().includes(heightFilter))
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
      name: "",
      capacity: 0,
      width: 0,
      height: 0,
    });
    setShowModal(true);
  };

  const openUpdateModal = (tank: Tank) => {
    setModalMode(ModalMode.UPDATE);
    setCurrentTank({
      name: tank.name,
      capacity: tank.capacity,
      width: tank.width,
      height: tank.height,
    });
    setEditingTankId(tank.id);
    setShowModal(true);
  };

  const handleSaveTank = () => {
    if (
      currentTank.name &&
      currentTank.capacity > 0 &&
      currentTank.width > 0 &&
      currentTank.height > 0
    ) {
      if (modalMode === ModalMode.CREATE) {
        const newId = Math.max(...tanks.map((t) => t.id), 0) + 1;
        setTanks([...tanks, { ...currentTank, id: newId }]);
      } else {
        if (editingTankId !== null) {
          setTanks(
            tanks.map((tank) =>
              tank.id === editingTankId ? { ...tank, ...currentTank } : tank
            )
          );
        }
      }

      setShowModal(false);
      setEditingTankId(null);
    }
  };

  const handleDeleteTank = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este tanque?")) {
      setTanks(tanks.filter((tank) => tank.id !== id));
    }
  };

  return (
    <>
      <div className="page-container">
        <div className="content-container">
          <div className="content-card">
            {/* Cabeçalho com título e botão de criar */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="card-title mb-0">
                <FaWater className="me-2 text-primary" /> Gestão de Tanques
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
                <div className={styles.filterInput}>
                  <BsRulers className={styles.filterIcon} />
                  <input
                    type="text"
                    placeholder="Largura"
                    value={widthFilter}
                    onChange={(e) => setWidthFilter(e.target.value)}
                  />
                </div>
                <div className={styles.filterInput}>
                  <BsRulers className={styles.filterIcon} />
                  <input
                    type="text"
                    placeholder="Altura"
                    value={heightFilter}
                    onChange={(e) => setHeightFilter(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Tabela de tanques */}
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.tableHeader}>Nome</th>
                    <th className={styles.tableHeader}>Capacidade (L)</th>
                    <th className={styles.tableHeader}>Largura (m)</th>
                    <th className={styles.tableHeader}>Altura (m)</th>
                    <th className={styles.tableHeader}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTanks.map((tank) => (
                    <tr key={tank.id} className={styles.tableRow}>
                      <td className={styles.tableCell}>
                        <div className={styles.cellContent}>
                          <BsDropletFill /> {tank.name}
                        </div>
                      </td>
                      <td className={styles.tableCell}>{tank.capacity} L</td>
                      <td className={styles.tableCell}>{tank.width}</td>
                      <td className={styles.tableCell}>{tank.height}</td>
                      <td className={styles.tableCell}>
                        <div className={styles.actionsCell}>
                          <button
                            className={styles.updateButton}
                            onClick={() => openUpdateModal(tank)}
                          >
                            <BsPencil /> Atualizar
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteTank(tank.id)}
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
                  ? "Criar Novo Tanque"
                  : "Atualizar Tanque"}
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
                <label className={styles.formLabel}>Nome do Tanque</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={currentTank.name}
                  onChange={(e) =>
                    setCurrentTank({ ...currentTank, name: e.target.value })
                  }
                  placeholder="Digite o nome do tanque"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Capacidade (Litros)</label>
                <input
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
                <label className={styles.formLabel}>Largura (Metros)</label>
                <input
                  type="number"
                  className={styles.formInput}
                  value={currentTank.width}
                  onChange={(e) =>
                    setCurrentTank({
                      ...currentTank,
                      width: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="Digite a largura em metros"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Altura (Metros)</label>
                <input
                  type="number"
                  className={styles.formInput}
                  value={currentTank.height}
                  onChange={(e) =>
                    setCurrentTank({
                      ...currentTank,
                      height: parseFloat(e.target.value) || 0,
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
