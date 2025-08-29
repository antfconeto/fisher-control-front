"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import detailsStyles from "../tanksDetails.module.css";
import { ClockLoader } from "react-spinners";
import {
  BsDropletFill,
  BsRulers,
  BsInfoCircle,
  BsArrowLeft,
  BsSearch,
  BsFilter,
} from "react-icons/bs";
import { FaWater, FaFish, FaChevronLeft, FaChevronRight, FaInfoCircle } from "react-icons/fa";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { Animal, Specie, Tank } from "@/types/types";
import { getTankById } from "@/actions/tank";
import { useErrorContext } from "@/contexts/errorContext";
import { deleteAnimal, getAllAnimalsFromTank, updateAnimal } from "@/actions/animal";
import { ErrorBox } from "@/components/ErrorBox";
import { useSpecie } from "@/hooks/useSpecies";
import { motion, AnimatePresence } from "framer-motion";
import { getSpeciesDistribution } from "@/actions/dashboard";
import { CustomTable, TableColumn } from '@/components/tables/customTable';
import { GiFishBucket } from "react-icons/gi";
import { DynamicFilters } from '@/components/dynamicFilter/dynamicFilters';
import { CustomModalForm } from '@/components/Forms/CustomModalForm';
import { useRequest } from "@/hooks/useRequest";
import { AnimalTable } from "@/components/tables";
import { ConfirmModal } from "@/components/Forms/ConfirmModal/ConfirmModal";
import { useNotification } from "@/contexts/notificationContext";

export interface TankFullInfo extends Tank {
  animals: Animal[];
}

enum ModalMode {
  CREATE = "create",
  UPDATE = "update",
}

export default function TankDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tankId = params.id as string;
  const { errorMessage, setErrorMessage } = useErrorContext();
  const { successNotification, errorNotification } = useNotification();
  const [loadingTank, setLoadingTank] = useState(true);
  const [tankFullInfo, setTankFullInfo] = useState<TankFullInfo | null>(null);
  const [currentAnimal, setCurrentAnimal] = useState<Animal>({
    codeAnimal: "",
    _id: "",
    specie: "",
    birthDate: new Date(),
    gender: "M" as "M" | "F",
    matriz_code: "",
    tankId: "",
  });

  //States for  change visibility modal
  const [showModal, setShowModal] = useState(false);
  const { sendRequest } = useRequest();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  //States for define status of modal
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.UPDATE);
  //Default filters
  const defaultFilters = {
    codeAnimal: "",
    specie: "",
    gender: undefined as "M" | "F" | undefined,
    tankId: tankId,
  };
  //States for filter by code
  const [filters, setFilters] = useState(defaultFilters);
  const [animalsFiltered, setAnimalsFiltered] = useState<Animal[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const { species } = useSpecie();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedAnimals, setPaginatedAnimals] = useState<Animal[]>([]);
  const [specieDescription, setSpecieDescription] = useState<Specie[]>([]);
  const itemsPerPage = 5;
  const [speciesData, setSpeciesData] = useState<
    { name: string; value: number }[]
  >([]);
  // Adicionar um estado de loading para specieDescription
  const [loadingSpeciesDesc, setLoadingSpeciesDesc] = useState(true);

  useEffect(() => {
    const fetchSpeciesDesc = async () => {
      setLoadingSpeciesDesc(true);
      try {
        const desc = (await getSpeciesDistribution()).specieDescription.map((item) => item.specie);
        setSpecieDescription(desc);
      } finally {
        setLoadingSpeciesDesc(false);
      }
    };
    fetchSpeciesDesc();
  }, []);

  // fetchAnimals precisa ser declarado antes do useEffect que o utiliza
  const fetchAnimals = useCallback(async () => {
    try {
      const response = (await getAllAnimalsFromTank(tankId)) as Animal[];
      setAnimals(response);
      setAnimalsFiltered(response);
      setLoadingAnimals(false);
      const speciesCount: Record<string, number> = {};

      response.forEach((animal) => {
        speciesCount[animal.specie] = (speciesCount[animal.specie] || 0) + 1;
      });
      // Só monta speciesData se specieDescription estiver carregado
      if (specieDescription.length > 0) {
        const data = Object.entries(speciesCount).map(([id, value]) => ({
          name: specieDescription.find((specie) => specie._id === id)?.name || id,
          value: value,
        }));
        setSpeciesData(data);
      }
    } catch (error: any) {
      const errMsg = error?.message || "Erro desconhecido";
      errorNotification("Erro!", `Erro ao processar dados de espécies: ${errMsg}`);
      setErrorMessage(errMsg);
    }
  }, [tankId, setErrorMessage, specieDescription]);

  useEffect(() => {
    fetchTank();

  }, [tankId]);

  useEffect(() => {
    if (!loadingSpeciesDesc) {
      fetchAnimals();
    }
  }, [tankId, loadingSpeciesDesc, fetchAnimals]);

  const fetchTank = async () => {
    try {
      let response = (await getTankById(tankId)) as Tank;
      setTankFullInfo({ ...response, animals: [] });
      setLoadingTank(false);
    } catch (error: any) {
      const errMsg = error?.message || "Erro desconhecido";
      errorNotification("Erro!", `Erro ao buscar dados do tanque: ${errMsg}`);
      setErrorMessage(errMsg);
    }
  };

  useEffect(() => {
    let animalsFiltered = animals.filter((animal) => {
      if (filters.codeAnimal) {
        return animal.codeAnimal.includes(filters.codeAnimal);
      }
      if (filters.specie) {
        return animal.specie === filters.specie;
      };
      return animals;
    });
    setAnimalsFiltered(animalsFiltered);
  }, [filters]);

  // Paginação dos animais
  const paginationAnimals = useCallback(() => {
    setPaginatedAnimals(
      animalsFiltered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    );
    setTotalPages(Math.max(1, Math.ceil(animalsFiltered.length / itemsPerPage)));
  }, [animalsFiltered, currentPage, itemsPerPage]);

  useEffect(() => {
    paginationAnimals();
  }, [currentPage, animalsFiltered]);

  // Função para gerar cores dinamicamente
  const generateColors = (count: number): string[] => {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 360) / count; // Distribui as cores uniformemente no espectro
      colors.push(`hsl(${hue}, 70%, 50%)`); // Usa o modelo de cor HSL
    }
    return colors;
  };



  const handleSaveAnimal = async () => {
    if (
      !currentAnimal.codeAnimal ||
      !currentAnimal.specie ||
      !currentAnimal.gender ||
      !currentAnimal.birthDate ||
      !currentAnimal.tankId
    ) {
      setErrorMessage(`Dados Necessário estão faltando!`);
      return;
    }
    const response = await handleUpdateAnimal(currentAnimal);
    if (response) {
      successNotification("Sucesso!", "Animal atualizado com sucesso");
      setShowModal(false);
      setCurrentAnimal({
        codeAnimal: "",
        _id: "",
        specie: "",
        birthDate: new Date(),
        gender: "M" as "M" | "F",
        matriz_code: "",
        tankId: "",
      });
      //Reset filters
      setFilters(defaultFilters);
    }
  };


  const handleUpdateAnimal = async (animal: Animal): Promise<boolean> => {
    try {
      await sendRequest(updateAnimal, animal);
      await fetchAnimals();
      setFilters(defaultFilters);
      return true;
    } catch (err: any) {
      const errMsg = err?.message || "Erro desconhecido";
      errorNotification("Erro!", `Erro ao atualizar animal: ${errMsg}`);
      setErrorMessage(errMsg);
      return false;
    }
  };

  const handleDeleteAnimal = async (): Promise<boolean> => {
    try {
      const response = await deleteAnimal(currentAnimal.codeAnimal);
      successNotification("Sucesso!", "Animal deletado com sucesso");
      await fetchAnimals();
      setFilters(defaultFilters);
      setShowConfirmModal(false);
      return response as boolean;
    } catch (err: any) {
      const errMsg = err?.message || "Erro desconhecido";
      errorNotification("Erro!", `Erro ao deletar animal: ${errMsg}`);
      setErrorMessage(errMsg);
      return false;
    }
  };
  // Dados para gráfico de pizza - espécies de animais
  const dynamicColors = generateColors(speciesData.length);

  if (loadingTank) {
    return (
      <div className="page-container">
        <div className="content-container">
          <div className="content-card">
            <div className="loading-container">
              <ClockLoader color="#0a58ca" size={60} />
              <p className="loading-text">Carregando informações do tank...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tankFullInfo) {
    return (
      <div className="page-container">
        <div className="content-container">
          <div className="content-card">
            <div className={detailsStyles.errorMessage}>
              <BsInfoCircle size={48} />
              <h3>Tanque não encontrado</h3>
              <p>O tanque solicitado não existe ou foi removido.</p>
              <button
                className={detailsStyles.backButton}
                onClick={() => router.push("/dashboard/tanks")}
                aria-label="Voltar para a lista de tanques"
              >
                <BsArrowLeft /> Voltar para a lista de tanques
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (<>


    {errorMessage && (
      <ErrorBox
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        otherClassName=""
      />
    )}
    <div className={detailsStyles.contentContainer}>
      {/* Cabeçalho */}
      <motion.div
        className="content-card mb-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={detailsStyles.header}>
          <div className={detailsStyles.header}>
            <button
              className={detailsStyles.backButton}
              onClick={() => {
                router.push("/dashboard/tanks")
              }}
              aria-label="Voltar para a lista de tanques"
            >
              <BsArrowLeft />
            </button>
            <h2 className={detailsStyles.pageTitle}>
              <GiFishBucket />{" Tanque: "}
              {tankFullInfo.name || `Tanque ${tankFullInfo.name}`}
            </h2>

          </div>
        </div>

        {/* Informações básicas do tanque */}
        <div className={detailsStyles.detailCardsRow}>
          <AnimatePresence>
            <div className={detailsStyles.detailCard}>
              <div className={detailsStyles.detailCardIcon}>
                <BsDropletFill />
              </div>
              <div className={detailsStyles.detailCardContent}>
                <div className={detailsStyles.detailCardLabel}>Capacidade</div>
                <div className={detailsStyles.detailCardValue}>
                  {tankFullInfo.capacity} L
                </div>
              </div>
            </div>
            <div className={detailsStyles.detailCard}>
              <div className={detailsStyles.detailCardIcon}>
                <BsRulers />
              </div>
              <div className={detailsStyles.detailCardContent}>
                <div className={detailsStyles.detailCardLabel}>Dimensões</div>
                <div className={detailsStyles.detailCardValue}>
                  {tankFullInfo.size.width}×{tankFullInfo.size.height} m
                </div>
              </div>
            </div>

            <div className={detailsStyles.detailCard}>
              <div className={detailsStyles.detailCardIcon}>
                <FaFish />
              </div>
              <div className={detailsStyles.detailCardContent}>
                <div className={detailsStyles.detailCardLabel}>Animais</div>
                <div className={detailsStyles.detailCardValue}>
                  {loadingAnimals ? (
                    <ClockLoader color="#0a58ca" size={20} />
                  ) : (
                    animals.length
                  )}
                </div>
              </div>
            </div>
          </AnimatePresence>
        </div>

      </motion.div>

      {/* Conteúdo principal em duas colunas */}
      {loadingAnimals ?
        <div className="loading-container">
          <ClockLoader color="#0a58ca" size={60} />
          <p className="loading-text">Carregando informações do tank...</p>
        </div>
        :
        <div className={detailsStyles.animalsInfo}>
          {/* Gráfico de pizza - espécies */}
          {animals && animals.length > 0 && (
            <motion.div
              className={detailsStyles.animalsGraph}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={detailsStyles.contentCard + " h-100"}>
                <h3 className={detailsStyles.sectionTitle}>
                  <FaFish /> Distribuição por Espécie
                </h3>
                <motion.div
                  style={{ height: "350px" }}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={speciesData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={60} />
                      <YAxis allowDecimals={false} label={{ value: 'Quantidade', angle: -90, position: 'insideLeft', offset: 10 }} />
                      <Tooltip formatter={(value) => [`${value} animais`, 'Quantidade']} />
                      <Bar dataKey="value" fill="#2563eb">
                        {speciesData.map((entry, index) => (
                          <Cell key={`cell-bar-${index}`} fill={dynamicColors[index % dynamicColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
                <div className={detailsStyles.infoBox} style={{ marginTop: '-1rem', marginBottom: '1.2rem' }}>
                  <h4 className={detailsStyles.infoTitle} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FaInfoCircle style={{ color: '#2563eb' }} /> Sobre o gráfico
                  </h4>
                  <ul className={detailsStyles.infoList}>
                    <li className={detailsStyles.infoListItem}>
                      Este gráfico mostra a quantidade de animais de cada espécie presentes neste tanque.
                    </li>
                    <li className={detailsStyles.infoListItem}>
                      Use os filtros acima para refinar a visualização por espécie ou código.
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Lista de animais */}
          {animals && animals.length > 0 && (
            <motion.div
              className={detailsStyles.animalTable}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={detailsStyles.contentCard + " h-100"}>
                <h3 className={detailsStyles.sectionTitle}>
                  <FaFish /> Animais neste Tanque
                </h3>
                {/* Filtros de pesquisa */}
                <DynamicFilters
                  name="Filtros de animais"
                  filters={[
                    {
                      key: 'codeAnimal',
                      label: 'Código',
                      icon: BsSearch,
                      type: 'text',
                      placeholder: 'Buscar por código',
                      value: filters.codeAnimal,
                      onChange: (value: string | number) => {
                        setCurrentPage(1);
                        setFilters((prev) => ({
                          ...prev,
                          codeAnimal: value as string,
                        }));
                      },
                      size: 'medium',
                    },
                    {
                      key: 'specie',
                      label: 'Espécie',
                      icon: BsFilter,
                      type: 'select',
                      value: filters.specie,
                      onChange: (value: string | number) => {
                        setCurrentPage(1);
                        setFilters((prev) => ({
                          ...prev,
                          specie: value as string,
                        }));
                      },
                      selectOptions: [
                        { label: 'Todas as espécies', value: '' },
                        ...species.map((specie) => ({ label: specie.name, value: specie._id }))
                      ],
                      size: 'medium',
                    },
                  ]}
                />
                {/* Status de filtragem */}
                <div className={detailsStyles.filterStatus}>
                  {animals.length === tankFullInfo.animals.length ? (
                    <span>Mostrando todos os animais</span>
                  ) : (
                    <span>
                      Mostrando {paginatedAnimals.length} de {animals.length} animais
                    </span>
                  )}
                  {(filters.codeAnimal || filters.specie) && (
                    <button
                      className={detailsStyles.clearFilterButton}
                      onClick={() => {
                        setFilters(defaultFilters);
                      }}
                    >
                      Limpar filtros
                    </button>
                  )}
                </div>
                <motion.div
                  className="table-responsive"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <AnimalTable
                    animals={paginatedAnimals}
                    tanks={[tankFullInfo]}
                    species={species}
                    onDelete={(codeAnimal: string) => {
                      setCurrentAnimal({
                        ...currentAnimal,
                        codeAnimal: codeAnimal,
                      });
                      setShowConfirmModal(true);
                    }}
                    onEdit={(animal: Animal) => {
                      setCurrentAnimal(animal);
                      setShowModal(true);
                      setModalMode(ModalMode.UPDATE);
                    }}
                  />
                </motion.div>
                {/* Paginação */}
                {totalPages > 0 && (
                  <div className={detailsStyles.pagination}>
                    <button
                      className={detailsStyles.paginationButton}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      aria-label="Página anterior"
                    >
                      <FaChevronLeft /> Anterior
                    </button>
                    <div className={detailsStyles.paginationInfo}>
                      Página {currentPage} de {totalPages}
                    </div>
                    <button
                      className={detailsStyles.paginationButton}
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(totalPages, prev + 1)
                        )
                      }
                      disabled={currentPage === totalPages}
                      aria-label="Próxima página"
                    >
                      Próxima <FaChevronRight />
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          )}
          {/* Mensagem quando não há animais */}
          <AnimatePresence>
            {(!animals || animals.length === 0) && (
              <motion.div
                className="col-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className={detailsStyles.noResults}>
                  <BsInfoCircle size={32} />
                  <h3>Nenhum animal cadastrado</h3>
                  <p>Este tanque ainda não possui animais registrados.</p>
                </div>
              </motion.div>
            )}

            {/* Mensagem quando não há resultados na busca */}
            {animals.length === 0 && (
              <motion.div
                className="col-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >

                <div className={detailsStyles.noResults}>
                  <BsInfoCircle size={32} />
                  <h3>Nenhum animal encontrado</h3>
                  <p>

                    Não foram encontrados animais com os critérios selecionados.

                  </p>
                  <button
                    className={detailsStyles.clearFilterButton}
                    onClick={() => {
                      setFilters(defaultFilters);
                    }}
                  >
                    Limpar filtros
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
      {/* Modal de Atualização */}
      {showModal && (
        <CustomModalForm
          title={"Atualizar Animal"}
          onClose={() => setShowModal(false)}
          onSubmit={handleSaveAnimal}
          fields={[
            {
              name: "codeAnimal",
              label: "Código do Animal",
              type: "text",
              value: currentAnimal.codeAnimal,
              placeholder: "Digite o código do animal",
              onChange: () => { },
              disabled: true,
            },
            {
              name: "specie",
              label: "Espécie",
              type: "select",
              options: [
                ...species.map((specie) => ({
                  label: specie.name,
                  value: specie._id,
                })),
                {
                  label: "Selecione a Espécie",
                  value: "",
                },
              ],
              value: currentAnimal.specie,
              placeholder: "Digite a espécie do animal",
              onChange: (val: string) => setCurrentAnimal({ ...currentAnimal, specie: val }),
            },
            {
              name: "birthDate",
              label: "Data de Nascimento",
              type: "date",
              value: new Date(currentAnimal.birthDate).toISOString().split("T")[0],
              onChange: (val: string) => setCurrentAnimal({ ...currentAnimal, birthDate: new Date(val) }),
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
              onChange: (val: string) => setCurrentAnimal({ ...currentAnimal, gender: val === "Macho" ? "M" : "F" }),
            },
            {
              name: "matriz_code",
              label: "Código da Matriz",
              type: "text",
              value: currentAnimal.matriz_code,
              placeholder: "Digite o código da matriz (opcional)",
              onChange: (val: string) => setCurrentAnimal({ ...currentAnimal, matriz_code: val }),
            },
          ]}
        />
      )}
      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <ConfirmModal
          title="Confirmar Exclusão"
          message="Tem certeza de que deseja excluir este animal?"
          onConfirm={handleDeleteAnimal}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  </>);

}
