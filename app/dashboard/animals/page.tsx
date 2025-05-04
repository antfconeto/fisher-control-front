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
import { createAnimal, deleteAnimal, listAnimals, updateAnimal } from "@/actions/animal";
import { useRequest } from "@/hooks/useRequest";
import { useError } from "@/hooks/useError";
import { ErrorBox } from "@/components/ErrorBox";
import { ClockLoader } from "react-spinners";
import { getTanks } from "@/actions/tank";
import { AnimalTable } from "@/components/Tables";
import { DynamicFilters } from "@/components/DynamicFilter";
import { FilterFieldConfig } from "@/types/components";
import { useAnimalsPagination } from "@/hooks/useAnimalPagination";
import { useTanks } from "@/hooks/useTanks";
import { CustomModalForm } from "@/components/Forms/CustomModalForm";
import { useErrorContext } from "@/contexts/errorContext";
import { ConfirmModal } from "@/components/Forms/ConfirmModal/ConfirmModal";
enum ModalMode {
  CREATE = "create",
  UPDATE = "update",
}

export default function AnimalsPage() {
  //States for  change visibility modal
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  //States for define status of modal
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.CREATE);

  const defaultFilters = {
    codeAnimal: '',
    specie: '',
    gender: undefined as "M" | "F" | undefined,
    tankId: '',
  }
  //States for filter by code
  const [filters, setFilters] = useState(defaultFilters);
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
  const { sendRequest } = useRequest<Animal | ResponseError>();
  const {errorMessage, setErrorMessage} = useErrorContext()

  //States for current animal selected
  const [currentAnimal, setCurrentAnimal] = useState<Animal>(defaultAnimal);

  //Total items per page
  const itemsPerPage = 5;
  //Animals filtered 
  const { animals, setCurrentPage, currentPage, error, loading, totalPages } = useAnimalsPagination({ filters, itemsPerPage })
  //Tanks feched
  const { tanks, loading: tanksLoading } = useTanks();
  //Filter info for animasl
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
      !currentAnimal.codeAnimal ||
      !currentAnimal.specie ||
      !currentAnimal.gender ||
      !currentAnimal.birthDate ||
      !currentAnimal.tankId
    ) {
      setErrorMessage(`Dados Necessário estão faltando!`)
      return;
    }
      let response = modalMode == ModalMode.CREATE ? await handleCreateAnimal(currentAnimal) : await handleUpdateAnimal(currentAnimal)
      if(response) {
        console.log(`✅ Animal ${modalMode == ModalMode.CREATE ? 'created' : 'updated'} with success`, currentAnimal)
        setShowModal(false)
        setCurrentAnimal(defaultAnimal)
        //Reset filters
        setFilters(defaultFilters)

    }
  };

  const handleCreateAnimal = async (animal: Animal): Promise<boolean> => {
    try {
      await sendRequest(createAnimal, animal);
      return true
    } catch (err: any) {
      const errMsg = err?.message || "Erro desconhecido";
      setErrorMessage(errMsg);
      return false
    }
  };

  const handleUpdateAnimal = async (animal: Animal): Promise<boolean> => {
    try {
      await sendRequest(updateAnimal, animal);
      return true
    } catch (err: any) {
      const errMsg = err?.message || "Erro desconhecido";
      setErrorMessage(errMsg);
      return false
    }
  };

  const handleDeleteAnimal = async (codeAnimal: string): Promise<boolean> => {
    try {
      let response = await deleteAnimal(codeAnimal);
      setFilters(defaultFilters)
      return response as boolean
    } catch (err: any) {
      const errMsg = err?.message || "Erro desconhecido";
      setErrorMessage(errMsg);
      return false
    }
  };


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
                    <AnimalTable animals={animals} tanks={tanks} onDelete={()=>setShowConfirmModal(true)} onEdit={openUpdateModal} />
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
      {showModal ?
        <CustomModalForm
          title={modalMode == ModalMode.CREATE ? "Cadastrar Novo Animal" : "Atualizar Animal"}
          onClose={() => setShowModal(false)}
          onSubmit={handleSaveAnimal}
          fields={[
            {
              name: "codeAnimal",
              label: "Código do Animal",
              type: "text",
              value: currentAnimal.codeAnimal,
              placeholder: "Digite o código do animal",
              onChange: (val) => setCurrentAnimal({ ...currentAnimal, codeAnimal: val }),
              disabled: modalMode == ModalMode.UPDATE,
            },
            {
              name: "specie",
              label: "Espécie",
              type: "text",
              value: currentAnimal.specie,
              placeholder: "Digite a espécie do animal",
              onChange: (val) => setCurrentAnimal({ ...currentAnimal, specie: val }),
            },
            {
              name: "birthDate",
              label: "Data de Nascimento",
              type: "date",
              value: new Date(currentAnimal.birthDate).toISOString().split("T")[0],
              onChange: (val) =>
                setCurrentAnimal({ ...currentAnimal, birthDate: new Date(val) }),
            },
            {
              name: "gender",
              label: "Gênero",
              type: "select",
              value: currentAnimal.gender === "M" ? "Macho" : "Fêmea",
              options: [
                { label: "Macho", value: "Macho" },
                { label: "Fêmea", value: "Fêmea" },
              ],
              onChange: (val) =>
                setCurrentAnimal({ ...currentAnimal, gender: val === "Macho" ? "M" : "F" }),
            },
            {
              name: "matriz_code",
              label: "Código da Matriz",
              type: "text",
              value: currentAnimal.matriz_code,
              placeholder: "Digite o código da matriz (opcional)",
              onChange: (val) => setCurrentAnimal({ ...currentAnimal, matriz_code: val }),
            },
            {
              name: "tankId",
              label: "Selecione o Tanque",
              type: "select",
              value: currentAnimal.tankId,
              options: tanks.map((tank) => ({
                label: tank.name,
                value: tank._id,
              })),
              onChange: (val) => setCurrentAnimal({ ...currentAnimal, tankId: val }),
            },
          ]}
          infoBox={
            <>
              <h4 className={styles.infoTitle}>ℹ️ Informações</h4>
              <ul className={styles.infoList}>
                <li>O código do animal deve ser único no sistema.</li>
                <li>É necessário especificar o tanque onde o animal está alocado.</li>
                <li>
                  O código da matriz é opcional e se refere ao animal progenitor.
                </li>
              </ul>
            </>
        }/>
        :
        <></>
      }
      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <ConfirmModal
          title="Confirmar Exclusão"
          message="Tem certeza de que deseja excluir este animal? Esta ação não pode ser desfeita."
          onConfirm={()=>handleDeleteAnimal}
          onCancel={()=>setShowConfirmModal(false)}
        />
      )}
    </>
  );
}
