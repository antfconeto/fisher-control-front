"use client";
import { useCallback, useEffect, useState, useMemo } from "react";
import styles from "./specie.module.css";
import { FaChevronLeft, FaChevronRight, FaPlus, FaFish } from "react-icons/fa";
import { Specie, ResponseError } from "@/types/types";
import {
  createSpecie,
  deleteSpecie,
  getAllQuantityAnimalsFromSpecie,
  getAllSpecies,
  updateSpecie,
} from "@/actions/specie";
import { useRequest } from "@/hooks/useRequest";
import { ErrorBox } from "@/components/ErrorBox";
import { ClockLoader } from "react-spinners";
import { SpecieTable } from "@/components/tables";
import { CustomModalForm } from "@/components/Forms/CustomModalForm";
import { useErrorContext } from "@/contexts/errorContext";
import { ConfirmModal } from "@/components/Forms/ConfirmModal/ConfirmModal";
import { AdminOnly } from "@/components/Authorization";
import { useNotification } from "@/contexts/notificationContext";
import { useUser } from "@/hooks/userHook";

enum ModalMode {
  CREATE = "create",
  UPDATE = "update",
}

export default function SpeciesPage() {
  // States for modal visibility
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // States for modal mode
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.CREATE);
  // States for filters
  const defaultSpecies = useMemo(
    () => ({
      _id: "",
      name: "",
      description: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      color: "",
      quantity: 0,
    }),
    []
  );
  const { sendRequest } = useRequest<Specie | ResponseError>();
  const { errorMessage, setErrorMessage } = useErrorContext();
  const { successNotification, errorNotification } = useNotification();

  // States for the current species
  const [currentSpecies, setCurrentSpecies] = useState<Specie>(defaultSpecies);
  const [species, setSpecies] = useState<Specie[]>([]);
  const [speciesFullInfo, setSpeciesFullInfo] = useState<Specie[]>([]);
  // Species filtered
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [paginatedSpecies, setPaginatedSpecies] = useState<Specie[]>([]);
  const {user} = useUser()

  const fetchSpecies = useCallback(async () => {
    try {
      const response = (await getAllSpecies()) as Specie[];
      if (response) {
        setSpecies(response as Specie[]);
        setTotalPages(Math.ceil(response.length / itemsPerPage));
      }
    } catch (err: any) {
      const errMsg = err?.message || "Erro desconhecido";
      errorNotification("Erro!", `Erro ao buscar espécies: ${errMsg}`);
      setErrorMessage(errMsg);
    }
  }, [setErrorMessage, itemsPerPage]);

  const fetchQuantityAnimalsInSpecies = useCallback(async () => {
    try {
      const speciesWithQuantities = await Promise.all(
        species.map(async (specie) => {
          const response = (await getAllQuantityAnimalsFromSpecie(
            specie._id
          )) as number;
          return {
            ...specie,
            quantity: response,
          };
        })
      );
      setSpeciesFullInfo(speciesWithQuantities);
    } catch (error) {
      errorNotification("Erro!", "Erro ao carregar as quantidades de animais.");
      setErrorMessage("Erro ao carregar as quantidades de animais.");
    } finally {
        setLoading(false);

    }
  }, [species, setErrorMessage]);

  const paginationSpecies = useCallback(() => {
    setPaginatedSpecies(
      speciesFullInfo.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    );
    setTotalPages(Math.min(Math.ceil(speciesFullInfo.length / itemsPerPage)));
  }, [speciesFullInfo, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchSpecies();
  }, [fetchSpecies]);

  useEffect(() => {
    paginationSpecies();
  }, [speciesFullInfo, currentPage, paginationSpecies]);

  useEffect(() => {
    fetchQuantityAnimalsInSpecies();
  }, [species, fetchQuantityAnimalsInSpecies]);

  // Function to open the create modal
  const openCreateModal = useCallback(() => {
    setModalMode(ModalMode.CREATE);
    setCurrentSpecies(defaultSpecies);
    setShowModal(true);
  }, [defaultSpecies]);

  // Function to open the update modal
  const openUpdateModal = (species: Specie) => {
    setModalMode(ModalMode.UPDATE);
    setCurrentSpecies({
      ...species,
    });
    setShowModal(true);
  };

  const handleSaveSpecies = async () => {
    if (!currentSpecies.name) {
      setErrorMessage(`O nome da espécie é obrigatório!`);
      return;
    }
    const response =
      modalMode == ModalMode.CREATE
        ? await handleCreateSpecies(currentSpecies)
        : await handleUpdateSpecies(currentSpecies);
    if (response) {
      successNotification(
        "Sucesso!",
        `Espécie ${modalMode === ModalMode.CREATE ? "criada" : "atualizada"} com sucesso`
      );
      setShowModal(false);
      setCurrentSpecies(defaultSpecies);
    }
  };

  const handleCreateSpecies = async (species: Specie): Promise<boolean> => {
    try {
      let response = await createSpecie(species, user?.role);
      if (!(response as ResponseError).error) {
        const errMsg = (response as ResponseError)?.error || "Erro desconhecido";
        setErrorMessage(errMsg);
        return false
      }
      setLoading(true);
      await fetchSpecies();
      return true;
    } catch (err: any) {
      const errMsg = err?.error || "Erro desconhecido";
      errorNotification("Erro!", `Erro ao criar espécie: ${errMsg}`);
      setErrorMessage(errMsg);
      return false;
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleUpdateSpecies = async (specie: Specie): Promise<boolean> => {
    try {
      let response = await updateSpecie(specie, user?.role);
      if (!(response as ResponseError).error) {
        const errMsg = (response as ResponseError)?.error || "Erro desconhecido";
        setErrorMessage(errMsg);
        return false
      }
      setLoading(true);
      await fetchSpecies();
      return true;
    } catch (err: any) {
      const errMsg = err?.error || "Erro desconhecido";
      errorNotification("Erro!", `Erro ao atualizar espécie: ${errMsg}`);
      setErrorMessage(errMsg);
      return false;
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleDeleteSpecies = async (): Promise<boolean> => {
    try {
      const response = await deleteSpecie(currentSpecies._id, user?.role);
      if (!(response as ResponseError).error) {
        const errMsg = (response as ResponseError)?.error || "Erro desconhecido";
        setErrorMessage(errMsg);
        return false;
      }
      successNotification("Sucesso!", "Espécie deletada com sucesso");
      setShowConfirmModal(false);
      setCurrentPage(1);
      setLoading(true);
      await fetchSpecies();
      return response as boolean;
    } catch (err: any) {
      const errMsg = err?.error || "Erro desconhecido";
      errorNotification("Erro!", `Erro ao deletar espécie: ${errMsg}`);
      setErrorMessage(errMsg);
      return false;
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
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

      <div className={styles.container}>
        <div className="content-container">
          <div className="content-card">
            {/* Header with title and create button */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="card-title mb-0">
                <FaFish className="me-2 text-primary" /> Gestão de Espécies
              </h2>
              <AdminOnly>
                <button className={styles.createButton} onClick={openCreateModal}>
                  <FaPlus /> Cadastrar Nova Espécie
                </button>
              </AdminOnly>
            </div>
            {loading || speciesFullInfo.length === 0 ? (
              <div className="loading-container">
                <ClockLoader color="#0a58ca" size={60} />
                <p className="loading-text">Carregando espécies...</p>
              </div>
            ) : (
              <>
                <div className={styles.tableContainer}>
                  <SpecieTable
                    species={paginatedSpecies}
                    onDelete={(id: string) => {
                      setCurrentSpecies({ ...currentSpecies, _id: id });
                      setShowConfirmModal(true);
                    }}
                    onEdit={openUpdateModal}
                  />
                </div>
                {totalPages > 0 && (
                  <div className={styles.pagination}>
                    <button
                      className={styles.paginationButton}
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
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
            )}
          </div>
        </div>
      </div>
      {/* Create/Update Modal */}
      {showModal ? (
        <CustomModalForm
          title={
            modalMode == ModalMode.CREATE
              ? "Cadastrar Nova Espécie"
              : "Atualizar Espécie"
          }
          onClose={() => setShowModal(false)}
          onSubmit={handleSaveSpecies}
          fields={[
            {
              name: "name",
              label: "Nome da Espécie",
              type: "text",
              value: currentSpecies.name,
              placeholder: "Digite o nome da espécie",
              onChange: (val) =>
                setCurrentSpecies({ ...currentSpecies, name: val }),
            },
            {
              name: "description",
              label: "Descrição",
              type: "text",
              value: currentSpecies.description,
              placeholder: "Digite uma descrição para a espécie",
              onChange: (val) =>
                setCurrentSpecies({ ...currentSpecies, description: val }),
            },
          ]}
        />
      ) : (
        <></>
      )}
      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <ConfirmModal
          title="Confirmar Exclusão"
          message="Tem certeza de que deseja excluir esta espécie? Esta ação não pode ser desfeita."
          onConfirm={handleDeleteSpecies}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
}
