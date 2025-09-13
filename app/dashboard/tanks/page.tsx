"use client";

import { useState, useEffect } from "react";
import styles from "./tanks.module.css";
import {
  BsDropletFill,
  BsPencil,
  BsTrash,
  BsSearch,
  BsInfoCircle,
  BsFilter,
  BsRulers,
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
import { useTanks } from "@/hooks/useTanks";
import { Tank } from "@/types/types";
import { ClockLoader } from "react-spinners";
import { getAllAnimalsFromTank } from "@/actions/animal";
import { Button } from "@/components/ui";
import { CustomModalForm } from "@/components/Forms/CustomModalForm";
import { ConfirmModal } from "@/components/Forms/ConfirmModal/ConfirmModal";
import { useErrorContext } from "@/contexts/errorContext";
import { useNotification } from "@/contexts/notificationContext";
import { ErrorBox } from "@/components/ErrorBox";
import { GiFishBucket } from "react-icons/gi";
import { AdminOnly, ViewerOnly } from "@/components/Authorization";
import { useUser } from "@/hooks/userHook";


enum ModalMode {
  CREATE = "create",
  UPDATE = "update",
}

const defaultTank = {

  capacity: 0,
  size: {
    width: 0,
    height: 0,
  },
};

export default function TanksPage() {
  const router = useRouter();

  const { tanks, loading, createTank, updateTank, deleteTank } = useTanks()
  const { setErrorMessage, errorMessage } = useErrorContext()
  const { successNotification, errorNotification } = useNotification()
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.CREATE);
  const {user} = useUser()
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [nameFilter, setNameFilter] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("");

  const [editingTankId, setEditingTankId] = useState<string | null>(null);

  const [currentTank, setCurrentTank] = useState<
    Omit<Tank, "id" | "animalsCount" >
  >({
    capacity: 0,
    size: {
      width: 0,
      height: 0,
    },
    _id: '',
    name: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Aumentado para exibir mais cards por página

  const [tankAnimals, setTankAnimals] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchTankAnimals = async () => {
      const animalsCount: { [key: string]: number } = {};
      // Executa todas as requisições em paralelo
      const responses = await Promise.all(
        tanks.map((tank) => getAllAnimalsFromTank(tank._id))
      );
      responses.forEach((response, idx) => {
        if (!('error' in response)) {
          const tankId = tanks[idx]._id;
          animalsCount[tankId] = response.length;
        }
      });
      setTankAnimals(animalsCount);
    };

    if (tanks.length > 0) {
      fetchTankAnimals();
    }
  }, [tanks]);

  const filteredTanks = tanks.filter((tank) => {
    return (
      tank.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
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
      _id: '',
      name: ''
    });
    setShowModal(true);
  };

  const openUpdateModal = (tank: Tank, event: React.MouseEvent) => {
    event.stopPropagation();
    setModalMode(ModalMode.UPDATE);
    setCurrentTank({
      capacity: 0,
      size: {
        width: 0,
        height: 0,
      },
      _id: '',
      name: ''
    });
    setEditingTankId(tank._id);
    setShowModal(true);
  };

  const handleSaveTank = async () => {
    if (
      currentTank.capacity > 0 &&
      currentTank.size.width > 0 &&
      currentTank.size.height > 0
    ) {
      try {
        if (modalMode === ModalMode.CREATE) {
          await createTank(currentTank, user?.role);
          successNotification("Sucesso!", "Tanque criado com sucesso");
        } else if (modalMode === ModalMode.UPDATE && editingTankId) {
          await updateTank({ ...currentTank, _id: editingTankId }, user?.role);
          successNotification("Sucesso!", "Tanque atualizado com sucesso");
        }
        setShowModal(false);
        setEditingTankId(null);
      } catch (error: any) {
        const errMsg = error?.message || "Erro desconhecido";
        errorNotification("Erro!", `Erro ao salvar tanque: ${errMsg}`);
        setErrorMessage(errMsg);
      }
    }
  };

  const handleDeleteTank = async () => {
    try {
      setShowConfirmModal(false);
      setCurrentPage(1)
      await deleteTank(currentTank._id, user?.role);
      successNotification("Sucesso!", "Tanque deletado com sucesso");
      setCurrentTank({
        _id: '',
        name: '',
        capacity: 0,
        size: {
          width: 0,
          height: 0,
        }
      });
    } catch (error: any) {
      const errMsg = error?.message || "Erro desconhecido";
      errorNotification("Erro!", `Erro ao deletar tanque: ${errMsg}`);
      setErrorMessage(errMsg);
    }

  };

  const navigateToTankDetails = (tankId: string) => {
    router.push(`/dashboard/tanks/${tankId}`);
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
        <div className={styles.header}>
          <h2 className={styles.title}>
            <FaWater className={styles.titleIcon} /> Gestão de Tanques
          </h2>
          <AdminOnly>
            <Button className={styles.createButton} onClick={openCreateModal} variant="primary">
              <FaPlus /> Criar Novo Tanque
            </Button>
          </AdminOnly>
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
        {loading ? (
          <div className="loading-container">
            <ClockLoader color="#0a58ca" size={60} />
            <p className="loading-text">Carregando todos os tanques...</p>
          </div>
        ) : (
          <div className={styles.cardsContainer}>
            {paginatedTanks.map((tank) => (
              <div
                key={tank._id}
                className={styles.tankCard}
                onClick={() => navigateToTankDetails(tank._id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigateToTankDetails(tank._id);
                  }
                }}
              >
                <div className={styles.tankCardHeader}>
                  <h3 className={styles.tankCardTitle}>
                    <GiFishBucket className={styles.tankCardIcon} /> 
                    <span className={styles.tankCardTitleText}>{tank.name.length > 10 ? tank.name.slice(0, 10) + "..." : tank.name }</span>
                  </h3>
                  <AdminOnly>
                    <div className={styles.tankCardActions}>
                      <button
                        className={styles.updateButton}
                        onClick={(e) => openUpdateModal(tank, e)}
                        aria-label="Editar tanque"
                        title="Editar tanque"
                      >
                        <BsPencil />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setShowConfirmModal(true); 
                          setCurrentTank(tank); 
                        }}
                        aria-label="Excluir tanque"
                        title="Excluir tanque"
                      >
                        <BsTrash />
                      </button>
                    </div>
                  </AdminOnly>
                </div>

                <div className={styles.tankCardBody}>
                  <div className={styles.tankCardStat}>
                    <div className={styles.tankCardStatIcon}>
                      <BsDropletFill />
                    </div>
                    <div className={styles.tankCardStatContent}>
                      <div className={styles.tankCardStatLabel}>
                        Capacidade
                      </div>
                      <div className={styles.tankCardStatValue}>
                        {tank.capacity.toLocaleString('pt-BR')} L
                      </div>
                    </div>
                  </div>

                  <div className={styles.tankCardStat}>
                    <div className={styles.tankCardStatIcon}>
                      <BsRulers />
                    </div>
                    <div className={styles.tankCardStatContent}>
                      <div className={styles.tankCardStatLabel}>
                        Dimensões
                      </div>
                      <div className={styles.tankCardStatValue}>
                        {tank.size.width.toLocaleString('pt-BR')}×{tank.size.height.toLocaleString('pt-BR')} m
                      </div>
                    </div>
                  </div>

                  <div className={styles.tankCardStat}>
                    <div className={styles.tankCardStatIcon}>
                      <FaFish />
                    </div>
                    <div className={styles.tankCardStatContent}>
                      <div className={styles.tankCardStatLabel}>Animais</div>
                      <div className={styles.tankCardStatValue}>
                        {tankAnimals[tank._id] === undefined ? (
                          <ClockLoader color="#0a58ca" size={16} />
                        ) : (
                          tankAnimals[tank._id] || 0
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.tankCardFooter}>
                  <button 
                    className={styles.viewDetailsButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToTankDetails(tank._id);
                    }}
                    aria-label={`Ver detalhes do tanque ${tank.name}`}
                  >
                    <span className={styles.viewDetailsText}>Ver detalhes</span>
                    <FaChartBar className={styles.viewDetailsIcon} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mensagem quando não há tanques */}
        {filteredTanks.length === 0 && loading === false && (
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
      {/* Modal de Criação/Atualização */}
      {showModal && (
        <CustomModalForm
          title={modalMode === ModalMode.CREATE ? "Criar Novo Tanque" : "Atualizar Tanque"}
          fields={[
            {
              name: "name",
              label: "Nome do Tanque",
              type: "text",
              value: currentTank.name,
              placeholder: "Digite o nome do tanque",
              onChange: (value: string) => setCurrentTank({ ...currentTank, name: value }),
            },
            {
              name: "capacity",
              label: "Capacidade (Litros)",
              type: "text",
              value: currentTank.capacity === 0 ? "" : currentTank.capacity.toString().replace(".", ","),
              placeholder: "Digite a capacidade em litros",
              onChange: (value: string) => {
                const formatted = value.replace(/[^\d,\.]/g, "").replace(",", ".");
                setCurrentTank({ ...currentTank, capacity: parseFloat(formatted) || 0 });
              },
            },
            {
              name: "width",
              label: "Largura (metros)",
              type: "text",
              value: currentTank.size.width === 0 ? "" : currentTank.size.width.toString().replace(".", ","),
              placeholder: "Digite a largura em metros",
              onChange: (value: string) => {
                const formatted = value.replace(/[^\d,\.]/g, "").replace(",", ".");
                setCurrentTank({ ...currentTank, size: { ...currentTank.size, width: parseFloat(formatted) || 0 } });
              },
            },
            {
              name: "height",
              label: "Altura (metros)",
              type: "text",
              value: currentTank.size.height === 0 ? "" : currentTank.size.height.toString().replace(".", ","),
              placeholder: "Digite a altura em metros",
              onChange: (value: string) => {
                const formatted = value.replace(/[^\d,\.]/g, "").replace(",", ".");
                setCurrentTank({ ...currentTank, size: { ...currentTank.size, height: parseFloat(formatted) || 0 } });
              },
            },
          ]}
          onSubmit={handleSaveTank}
          onClose={() => setShowModal(false)}
          infoBox={
            <>
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
            </>
          }
        />
      )}
      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <ConfirmModal
          title="Confirmar Exclusão"
          message="Tem certeza de que deseja excluir este animal? Todos os animais dessa espécie serão excluidos."
          onConfirm={handleDeleteTank}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
}
