"use client";

import { useState } from "react";
import styles from "./animals.module.css";
import {
  BsSearch,
  BsFilter,
  BsInfoCircle,
  BsPencil,
  BsTrash,
} from "react-icons/bs";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaSave,
  FaTimes,
  FaFish,
  FaVenusMars,
  FaCalendarAlt,
  FaBarcode,
  FaWater,
} from "react-icons/fa";

interface Animal {
  code_animal: string;
  specie: string;
  birth_date: Date;
  gender: string;
  matriz_code: string;
  tank_id: string;
}

enum ModalMode {
  CREATE = "create",
  UPDATE = "update",
}

export default function AnimalsPage() {
  // Estado para a lista de animais
  const [animals, setAnimals] = useState<Animal[]>([
    {
      code_animal: "A001",
      specie: "Tilápia",
      birth_date: new Date("2023-01-15"),
      gender: "Macho",
      matriz_code: "M001",
      tank_id: "T001",
    },
    {
      code_animal: "A002",
      specie: "Tambaqui",
      birth_date: new Date("2023-02-20"),
      gender: "Fêmea",
      matriz_code: "M002",
      tank_id: "T002",
    },
    {
      code_animal: "A003",
      specie: "Pacu",
      birth_date: new Date("2023-03-10"),
      gender: "Macho",
      matriz_code: "M003",
      tank_id: "T001",
    },
    {
      code_animal: "A004",
      specie: "Pintado",
      birth_date: new Date("2023-04-05"),
      gender: "Fêmea",
      matriz_code: "M004",
      tank_id: "T003",
    },
    {
      code_animal: "A005",
      specie: "Tilápia",
      birth_date: new Date("2023-05-12"),
      gender: "Macho",
      matriz_code: "M005",
      tank_id: "T002",
    },
    {
      code_animal: "A006",
      specie: "Tambaqui",
      birth_date: new Date("2023-06-18"),
      gender: "Fêmea",
      matriz_code: "M006",
      tank_id: "T001",
    },
    {
      code_animal: "A007",
      specie: "Pacu",
      birth_date: new Date("2023-07-22"),
      gender: "Macho",
      matriz_code: "M007",
      tank_id: "T003",
    },
    {
      code_animal: "A008",
      specie: "Pintado",
      birth_date: new Date("2023-08-30"),
      gender: "Fêmea",
      matriz_code: "M008",
      tank_id: "T002",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.CREATE);

  const [codeFilter, setCodeFilter] = useState("");
  const [specieFilter, setSpecieFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [tankFilter, setTankFilter] = useState("");

  const [editingAnimalCode, setEditingAnimalCode] = useState<string | null>(
    null
  );

  const [currentAnimal, setCurrentAnimal] = useState<Animal>({
    code_animal: "",
    specie: "",
    birth_date: new Date(),
    gender: "",
    matriz_code: "",
    tank_id: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredAnimals = animals.filter((animal) => {
    return (
      animal.code_animal.toLowerCase().includes(codeFilter.toLowerCase()) &&
      animal.specie.toLowerCase().includes(specieFilter.toLowerCase()) &&
      animal.gender.toLowerCase().includes(genderFilter.toLowerCase()) &&
      animal.tank_id.toLowerCase().includes(tankFilter.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);

  const paginatedAnimals = filteredAnimals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openCreateModal = () => {
    setModalMode(ModalMode.CREATE);
    setCurrentAnimal({
      code_animal: "",
      specie: "",
      birth_date: new Date(),
      gender: "",
      matriz_code: "",
      tank_id: "",
    });
    setShowModal(true);
  };

  const openUpdateModal = (animal: Animal) => {
    setModalMode(ModalMode.UPDATE);
    setCurrentAnimal({
      ...animal,
      birth_date: new Date(animal.birth_date),
    });
    setEditingAnimalCode(animal.code_animal);
    setShowModal(true);
  };

  const handleSaveAnimal = () => {
    if (
      currentAnimal.code_animal &&
      currentAnimal.specie &&
      currentAnimal.gender &&
      currentAnimal.birth_date &&
      currentAnimal.tank_id
    ) {
      if (modalMode === ModalMode.CREATE) {
        setAnimals([...animals, currentAnimal]);
      } else {
        if (editingAnimalCode !== null) {
          setAnimals(
            animals.map((animal) =>
              animal.code_animal === editingAnimalCode ? currentAnimal : animal
            )
          );
        }
      }

      setShowModal(false);
      setEditingAnimalCode(null);
    }
  };

  const handleDeleteAnimal = (code: string) => {
    if (confirm("Tem certeza que deseja excluir este animal?")) {
      setAnimals(animals.filter((animal) => animal.code_animal !== code));
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
                <FaFish className="me-2 text-primary" /> Gestão de Animais
              </h2>
              <button className={styles.createButton} onClick={openCreateModal}>
                <FaPlus /> Cadastrar Novo Animal
              </button>
            </div>

            {/* Filtros */}
            <section className={styles.filterSection}>
              <div className={styles.filterLabel}>
                <BsFilter /> Filtro por animais
              </div>
              <div className={styles.filterContainer}>
                <div className={styles.searchInput}>
                  <BsSearch className={styles.filterIcon} />
                  <input
                    type="text"
                    placeholder="Código do animal"
                    value={codeFilter}
                    onChange={(e) => setCodeFilter(e.target.value)}
                  />
                </div>
                <div className={styles.filterInput}>
                  <FaFish className={styles.filterIcon} />
                  <input
                    type="text"
                    placeholder="Espécie"
                    value={specieFilter}
                    onChange={(e) => setSpecieFilter(e.target.value)}
                  />
                </div>
                <div className={styles.filterInput}>
                  <FaVenusMars className={styles.filterIcon} />
                  <input
                    type="text"
                    placeholder="Gênero"
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                  />
                </div>
                <div className={styles.filterInput}>
                  <FaWater className={styles.filterIcon} />
                  <input
                    type="text"
                    placeholder="ID do Tanque"
                    value={tankFilter}
                    onChange={(e) => setTankFilter(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Tabela de animais */}
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.tableHeader}>Código</th>
                    <th className={styles.tableHeader}>Espécie</th>
                    <th className={styles.tableHeader}>Data de Nascimento</th>
                    <th className={styles.tableHeader}>Gênero</th>
                    <th className={styles.tableHeader}>Matriz</th>
                    <th className={styles.tableHeader}>Tanque</th>
                    <th className={styles.tableHeader}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAnimals.map((animal) => (
                    <tr key={animal.code_animal} className={styles.tableRow}>
                      <td className={styles.tableCell}>
                        <div className={styles.cellContent}>
                          <FaBarcode /> {animal.code_animal}
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.cellContent}>
                          <FaFish /> {animal.specie}
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.cellContent}>
                          <FaCalendarAlt /> {formatDate(animal.birth_date)}
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.cellContent}>
                          <FaVenusMars /> {animal.gender}
                        </div>
                      </td>
                      <td className={styles.tableCell}>{animal.matriz_code}</td>
                      <td className={styles.tableCell}>
                        <div className={styles.cellContent}>
                          <FaWater /> {animal.tank_id}
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.actionsCell}>
                          <button
                            className={styles.updateButton}
                            onClick={() => openUpdateModal(animal)}
                          >
                            <BsPencil /> Atualizar
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() =>
                              handleDeleteAnimal(animal.code_animal)
                            }
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
                  ? "Cadastrar Novo Animal"
                  : "Atualizar Animal"}
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
                <label className={styles.formLabel}>
                  <FaBarcode /> Código do Animal
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={currentAnimal.code_animal}
                  onChange={(e) =>
                    setCurrentAnimal({
                      ...currentAnimal,
                      code_animal: e.target.value,
                    })
                  }
                  placeholder="Digite o código do animal"
                  disabled={modalMode === ModalMode.UPDATE}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaFish /> Espécie
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={currentAnimal.specie}
                  onChange={(e) =>
                    setCurrentAnimal({
                      ...currentAnimal,
                      specie: e.target.value,
                    })
                  }
                  placeholder="Digite a espécie do animal"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaCalendarAlt /> Data de Nascimento
                </label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={currentAnimal.birth_date.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setCurrentAnimal({
                      ...currentAnimal,
                      birth_date: new Date(e.target.value),
                    })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaVenusMars /> Gênero
                </label>
                <select
                  className={styles.formInput}
                  value={currentAnimal.gender}
                  onChange={(e) =>
                    setCurrentAnimal({
                      ...currentAnimal,
                      gender: e.target.value,
                    })
                  }
                >
                  <option value="">Selecione um gênero</option>
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Código da Matriz</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={currentAnimal.matriz_code}
                  onChange={(e) =>
                    setCurrentAnimal({
                      ...currentAnimal,
                      matriz_code: e.target.value,
                    })
                  }
                  placeholder="Digite o código da matriz (opcional)"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaWater /> ID do Tanque
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={currentAnimal.tank_id}
                  onChange={(e) =>
                    setCurrentAnimal({
                      ...currentAnimal,
                      tank_id: e.target.value,
                    })
                  }
                  placeholder="Digite o ID do tanque"
                />
              </div>
              <div className={styles.infoBox}>
                <h4 className={styles.infoTitle}>
                  <BsInfoCircle /> Informações
                </h4>
                <ul className={styles.infoList}>
                  <li className={styles.infoListItem}>
                    O código do animal deve ser único no sistema.
                  </li>
                  <li className={styles.infoListItem}>
                    É necessário especificar o tanque onde o animal está
                    alocado.
                  </li>
                  <li className={styles.infoListItem}>
                    O código da matriz é opcional e se refere ao animal
                    progenitor.
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
              <button className={styles.saveButton} onClick={handleSaveAnimal}>
                <FaSave /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
