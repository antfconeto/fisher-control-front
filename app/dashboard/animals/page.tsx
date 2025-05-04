"use client";

import { useCallback, useEffect, useState } from "react";
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
import { Animal, AnimalPagination, ResponseError, Tank } from "@/types/types";
import { createAnimal, listAnimals } from "@/actions/animal";
import { useRequest } from "@/hooks/useRequest";
import { useError } from "@/hooks/useError";
import { ErrorBox } from "@/components/ErrorBox";
import { ClockLoader } from "react-spinners";
import { getTanks } from "@/actions/tank";
import { AnimalTable } from "@/components/tables";
import DynamicFilters from "@/components/dynamicFilter/dynamicFilters";
import { FilterFieldConfig } from "@/types/components";
import { useAnimalsPagination } from "@/hooks/useAnimalPagination";

enum ModalMode {
  CREATE = "create",
  UPDATE = "update",
}



export default function AnimalsPage() {
  //Animals
  //States for  change visibility modal
  const [showModal, setShowModal] = useState(false);
  //States for define status of modal
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.CREATE);
  //States for filter by code
  const [filters, setFilters] = useState({
    codeAnimal: '',
    specie: '',
    gender: undefined as "M" | "F" | undefined,
    tankId: '',
  });
  //default values for animal
  const defaultAnimal: Animal = {
    codeAnimal: "",
    _id: "",
    specie: "",
    birthDate: new Date(),
    gender: "M",
    matriz_code: "",
    tankId: "",
  };

  //Tanks
  const [tanks, setTanks] = useState<Tank[]>([])

  const { sendRequest } = useRequest<Animal | ResponseError>();
  const { errorMessage, setErrorMessage } = useError();

  //States for current animal selected
  const [currentAnimal, setCurrentAnimal] = useState<Animal>(defaultAnimal);

  //Total items per page
  const itemsPerPage = 5;
  const { animals, setCurrentPage, currentPage, error, loading, totalPages } = useAnimalsPagination({ filters, itemsPerPage })

  const filterFields: FilterFieldConfig[] = [
    {
      key: "code",
      label: "Código do animal",
      icon: BsSearch,
      type: "text",
      size: "medium",
      placeholder: "Código do animal",
      value: filters.codeAnimal,
      onChange: (val) => {
        setCurrentPage(1);
        setFilters((prev) => ({ ...prev, codeAnimal: val as string }));
      },
    },
    {
      key: "species",
      label: "Espécie",
      icon: FaFish,
      type: "text",
      size: "medium",
      placeholder: "Espécie",
      value: filters.specie,
      onChange: (val) => {
        setCurrentPage(1);
        setFilters((prev) => ({ ...prev, specie: val as string }));
      },
    },
    {
      key: "gender",
      label: "Sexo",
      icon: FaVenusMars,
      type: "select",
      size: "small",
      placeholder: "Sexo",
      selectOptions: [
        { label: "Todos", value: "" },
        { label: "Macho", value: "M" },
        { label: "Fêmea", value: "F" },
      ],
      value: filters.gender,
      onChange: (val) => {
        setCurrentPage(1);
        setFilters((prev) => ({ ...prev, gender: val as "M" | "F" | undefined }));
      },
    },
    {
      key: "tank",
      label: "Tanque",
      icon: FaWater,
      type: "select",
      size: "medium",
      placeholder: "Tanque",
      selectOptions: [
        ...tanks.map((tank) => ({
          label: tank.name,
          value: tank._id,
        })),
        {
          label: "Tanque",
          value: ""
        }],
      value: filters.tankId,
      onChange: (val) => {
        setCurrentPage(1);
        setFilters((prev) => ({ ...prev, tankId: val as string }));
      },
    },
  ];

  useEffect(() => {
    (async () => await fetchTanks())();
  }, []);



  //Function who open a creating modal
  const openCreateModal = useCallback(() => {
    setModalMode(ModalMode.CREATE);
    setCurrentAnimal(defaultAnimal);
    setShowModal(true);
  }, []);
  //Function who open a updating modal
  const openUpdateModal = (animal: Animal) => {
    setModalMode(ModalMode.UPDATE);
    setCurrentAnimal({
      ...animal,
    });
    setShowModal(true);
  };

  const handleSaveAnimal = async () => {
    if (
      currentAnimal.codeAnimal &&
      currentAnimal.specie &&
      currentAnimal.gender &&
      currentAnimal.birthDate &&
      currentAnimal.tankId
    ) {
      if (modalMode == ModalMode.CREATE) {
        const response = await handleCreateAnimal(currentAnimal)
        if (response) {
          setShowModal(false);
        }
      }

    }
  };

  const handleCreateAnimal = async (animal: Animal): Promise<boolean> => {
    try {
      await sendRequest(createAnimal, animal);
      return true
    } catch (err: any) {
      const errMsg = err?.error || "Erro desconhecido";
      setErrorMessage(errMsg);
      return false
    }
  };
  const handleDeleteAnimal = (codeAnimal: string): void => {
    if (confirm("Tem certeza que deseja excluir este animal?")) {
      //setAnimals(animals.filter((animal) => animal.codeAnimal !== codeAnimal));
    }
  };

  const fetchTanks = async () => {
    try {
      const response = await getTanks();
      setTanks(response as Tank[])
    } catch (error: any) {
      const errMsg = error?.message || "Erro Desconhecido";
      setErrorMessage(errMsg);
      return false
    }
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
            <section className={styles.filterSection}>
              <DynamicFilters filters={filterFields} name="Filtro de Animais" />
            </section>
            {loading ?
              <div className="loading-container">
                <ClockLoader color="#0a58ca" size={60} />
                <p className="loading-text">Carregando animais...</p>
              </div>
              :
              (
                <>
                  <div className={styles.tableContainer}>
                    <AnimalTable animals={animals} tanks={tanks} onDelete={handleDeleteAnimal} onEdit={openUpdateModal} />
                  </div>
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
                </>
              )
            }
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
                  value={currentAnimal.codeAnimal}
                  onChange={(e) =>
                    setCurrentAnimal({
                      ...currentAnimal,
                      codeAnimal: e.target.value,
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
                  value={currentAnimal.birthDate.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setCurrentAnimal({
                      ...currentAnimal,
                      birthDate: new Date(e.target.value),
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
                  value={currentAnimal.gender == "M" ? "Macho" : "Fêmea"}
                  onChange={(e) =>
                    setCurrentAnimal({
                      ...currentAnimal,
                      gender: e.target.value == "Macho" ? "M" : "F" as any,
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
                  <FaWater /> Selecione o Tanque
                </label>
                <div className={styles.filterInput}>
                  <select
                    value={(tanks.find((tank) => tank._id == currentAnimal._id)?.name)}
                    onChange={(e) => {
                      setCurrentAnimal({
                        ...currentAnimal,
                        tankId: e.target.value,
                      })
                    }}
                    className={styles.filterSelect}
                  >
                    <option value="">Todos os Tanques</option>
                    {tanks.map((tank) => (
                      <option key={tank._id} value={tank._id}>
                        {tank.name}
                      </option>
                    ))}
                  </select>
                </div>
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
