"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../tanks.module.css";
import { ClockLoader } from "react-spinners";
import {
  BsDropletFill,
  BsRulers,
  BsInfoCircle,
  BsArrowLeft,
  BsSearch,
  BsFilter,
} from "react-icons/bs";
import { FaWater, FaFish, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Animal, Tank } from "@/types/types";
import { getTankById } from "@/actions/tank";
import { useErrorContext } from "@/contexts/errorContext";
import { getAllAnimalsFromTank } from "@/actions/animal";
import { ErrorBox } from "@/components/ErrorBox";
import { useSpecie } from "@/hooks/useSpecies";

export interface TankFullInfo extends Tank {
  animals: Animal[];
}

export default function TankDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tankId = params.id as string;
  const { errorMessage, setErrorMessage } = useErrorContext();
  const [loadingTank, setLoadingTank] = useState(true);
  const [tankFullInfo, setTankFullInfo] = useState<TankFullInfo | null>(null);
  //Default filters
  const defaultFilters = {
    codeAnimal: "",
    specie: "",
    gender: undefined as "M" | "F" | undefined,
    tankId: tankId,
  };
  //States for filter by code
  const [filters, setFilters] = useState(defaultFilters);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const { species } = useSpecie();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedAnimals, setPaginatedAnimals] = useState<Animal[]>([]);
  const itemsPerPage = 5;
  const [speciesData, setSpeciesData] = useState<
    { name: string; value: number }[]
  >([]);

  const fetchTank = useCallback(async () => {
    try {
      const response = (await getTankById(tankId)) as Tank;
      setTankFullInfo({ ...response, animals: animals as any });
      setLoadingTank(false);
    } catch (error: any) {
      const errMsg = error?.message || "Erro desconhecido";
      setErrorMessage(errMsg);
    }
  }, [tankId, animals, setErrorMessage]);

  const fetchAnimals = useCallback(async () => {
    try {
      const response = (await getAllAnimalsFromTank(tankId)) as Animal[];
      setAnimals(response);
      setLoadingAnimals(false);
      const speciesCount: Record<string, number> = {};
      response.forEach((animal) => {
        speciesCount[animal.specie] = (speciesCount[animal.specie] || 0) + 1;
      });
      const data = Object.entries(speciesCount).map(([name, value]) => ({
        name,
        value,
      }));
      setSpeciesData(data);
    } catch (error: any) {
      const errMsg = error?.message || "Erro desconhecido";
      setErrorMessage(errMsg);
    }
  }, [tankId, setErrorMessage]);

  const paginationAnimals = useCallback(() => {
    setPaginatedAnimals(
      animals.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    );
    setTotalPages(Math.min(Math.ceil(animals.length / itemsPerPage)));
  }, [animals, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchTank();
    fetchAnimals();
  }, [fetchTank, fetchAnimals]);

  useEffect(() => {
    paginationAnimals();
  }, [animals, currentPage, paginationAnimals]);

  // Função para gerar cores dinamicamente
  const generateColors = (count: number): string[] => {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 360) / count; // Distribui as cores uniformemente no espectro
      colors.push(`hsl(${hue}, 70%, 50%)`); // Usa o modelo de cor HSL
    }
    return colors;
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
            <div className={styles.errorMessage}>
              <BsInfoCircle size={48} />
              <h3>Tanque não encontrado</h3>
              <p>O tanque solicitado não existe ou foi removido.</p>
              <button
                className={styles.backButton}
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
          {/* Cabeçalho */}
          <div className="content-card mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center flex-wrap gap-3">
                <button
                  className={styles.backButton}
                  onClick={() => {
                    router.push("/dashboard/tanks");
                  }}
                  aria-label="Voltar para a lista de tanques"
                >
                  <BsArrowLeft />
                </button>
                <h2 className={styles.pageTitle}>
                  <FaWater className={styles.pageTitleIcon} />{" "}
                  {tankFullInfo.name || `Tanque ${tankFullInfo.name}`}
                </h2>
              </div>
            </div>

            {/* Informações básicas do tanque */}
            <div className="row g-4">
              <div className="col-md-4 col-sm-6">
                <div className={styles.detailCard}>
                  <div className={styles.detailCardIcon}>
                    <BsDropletFill />
                  </div>
                  <div className={styles.detailCardContent}>
                    <div className={styles.detailCardLabel}>Capacidade</div>
                    <div className={styles.detailCardValue}>
                      {tankFullInfo.capacity} L
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-6">
                <div className={styles.detailCard}>
                  <div className={styles.detailCardIcon}>
                    <BsRulers />
                  </div>
                  <div className={styles.detailCardContent}>
                    <div className={styles.detailCardLabel}>Dimensões</div>
                    <div className={styles.detailCardValue}>
                      {tankFullInfo.size.width}×{tankFullInfo.size.height} m
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-6">
                <div className={styles.detailCard}>
                  <div className={styles.detailCardIcon}>
                    <FaFish />
                  </div>
                  <div className={styles.detailCardContent}>
                    <div className={styles.detailCardLabel}>Animais</div>
                    <div className={styles.detailCardValue}>
                      {animals.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo principal em duas colunas */}
          {loadingAnimals ? (
            <div className="loading-container">
              <ClockLoader color="#0a58ca" size={60} />
              <p className="loading-text">Carregando informações do tank...</p>
            </div>
          ) : (
            <div className="row g-4">
              {/* Gráfico de pizza - espécies */}
              {animals && animals.length > 0 && (
                <div className="col-lg-6">
                  <div className="content-card h-100">
                    <h3 className={styles.sectionTitle}>
                      <FaFish className={styles.sectionTitleIcon} />{" "}
                      Distribuição por Espécie
                    </h3>
                    <div style={{ height: "350px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={speciesData}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            labelLine={true}
                          >
                            {speciesData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  dynamicColors[index % dynamicColors.length]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [
                              `${value} animais`,
                              "Quantidade",
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de animais */}
              {animals && animals.length > 0 && (
                <div className="col-lg-6">
                  <div className="content-card h-100">
                    <h3 className={styles.sectionTitle}>
                      <FaFish className={styles.sectionTitleIcon} /> Animais
                      neste Tanque
                    </h3>

                    {/* Filtros de pesquisa */}
                    <div className={styles.animalFilters}>
                      <div className={styles.searchInput}>
                        <BsSearch className={styles.filterIcon} />
                        <input
                          type="text"
                          placeholder="Buscar por código"
                          value={filters.codeAnimal}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              codeAnimal: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className={styles.filterInput}>
                        <BsFilter className={styles.filterIcon} />
                        <select
                          value={filters.specie}
                          onChange={(e) =>
                            setFilters({ ...filters, specie: e.target.value })
                          }
                          className={styles.selectFilter}
                        >
                          <option value="">Todas as espécies</option>
                          {species.map((specie, index) => (
                            <option key={index} value={specie._id}>
                              {specie.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Status de filtragem */}
                    <div className={styles.filterStatus}>
                      {animals.length === tankFullInfo.animals.length ? (
                        <span>Mostrando todos os animais</span>
                      ) : (
                        <span>
                          Mostrando {paginatedAnimals.length} de{" "}
                          {tankFullInfo.animals.length} animais
                        </span>
                      )}

                      {(filters.codeAnimal || filters.specie) && (
                        <button
                          className={styles.clearFilterButton}
                          onClick={() => {
                            setFilters(defaultFilters);
                          }}
                        >
                          Limpar filtros
                        </button>
                      )}
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead className={styles.tableHeader}>
                          <tr>
                            <th scope="col">Código</th>
                            <th scope="col">Espécie</th>
                            <th scope="col">Gênero</th>
                            <th scope="col">Nascimento</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedAnimals.map((animal) => (
                            <tr
                              key={animal.codeAnimal}
                              className={styles.tableRow}
                            >
                              <td className={styles.tableCell}>
                                {animal.codeAnimal}
                              </td>
                              <td className={styles.tableCell}>
                                {
                                  species.find(
                                    (specie) => specie._id === animal.specie
                                  )?.name
                                }
                              </td>
                              <td className={styles.tableCell}>
                                {animal.gender === "M" ? "Macho" : "Fêmea"}
                              </td>
                              <td className={styles.tableCell}>
                                {new Date(animal.birthDate).toLocaleDateString(
                                  "pt-BR"
                                )}
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
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={currentPage === 1}
                          aria-label="Página anterior"
                        >
                          <FaChevronLeft /> Anterior
                        </button>
                        <div className={styles.paginationInfo}>
                          Página {currentPage} de{" "}
                          {Math.ceil(animals.length / itemsPerPage)}
                        </div>
                        <button
                          className={styles.paginationButton}
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(
                                Math.ceil(animals.length / itemsPerPage),
                                prev + 1
                              )
                            )
                          }
                          disabled={
                            currentPage ===
                            Math.ceil(animals.length / itemsPerPage)
                          }
                          aria-label="Próxima página"
                        >
                          Próxima <FaChevronRight />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mensagem quando não há animais */}
              {(!animals || animals.length === 0) && (
                <div className="col-12">
                  <div className={styles.noResults}>
                    <BsInfoCircle size={32} />
                    <h3>Nenhum animal cadastrado</h3>
                    <p>Este tanque ainda não possui animais registrados.</p>
                  </div>
                </div>
              )}

              {/* Mensagem quando não há resultados na busca */}
              {animals.length === 0 && (
                <div className="col-12">
                  <div className={styles.noResults}>
                    <BsInfoCircle size={32} />
                    <h3>Nenhum animal encontrado</h3>
                    <p>
                      Não foram encontrados animais com os critérios
                      selecionados.
                    </p>
                    <button
                      className={styles.clearFilterButton}
                      onClick={() => {
                        setFilters(defaultFilters);
                      }}
                    >
                      Limpar filtros
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
