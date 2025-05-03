"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../tanks.module.css";
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

interface Animal {
  code_animal: string;
  specie: string;
  gender: "M" | "F";
  birth_date: string;
  matriz_code: string;
  tank_id: string;
  // Propriedades adicionais para exibição
  weight?: number;
}

interface TankDetail {
  id: string;
  capacity: number;
  size: {
    width: number;
    height: number;
  };
  // Propriedades calculadas/extras para a UI
  name?: string;
  animals?: Animal[];
}

// Cores para gráficos
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function TankDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tankId = params.id as string;

  const [tank, setTank] = useState<TankDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados para paginação e filtro
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [specieFilter, setSpecieFilter] = useState<string>("");
  const animalsPerPage = 10;

  useEffect(() => {
    // Simula a obtenção de dados do servidor
    // Em produção, substitua isso por uma chamada API real para /getTankById
    // E chamadas adicionais para obter animais relacionados a este tanque
    setTimeout(() => {
      // Gerar uma lista maior de animais para demonstrar a paginação
      const animalSpecies = [
        "Tilápia",
        "Tambaqui",
        "Pacu",
        "Pintado",
        "Pirarucu",
      ];
      const mockAnimals: Animal[] = [];

      // Gerar 50 animais de exemplo
      for (let i = 1; i <= 50; i++) {
        const specieIndex = Math.floor(Math.random() * animalSpecies.length);
        mockAnimals.push({
          code_animal: `${animalSpecies[specieIndex]
            .substring(0, 3)
            .toUpperCase()}${i.toString().padStart(3, "0")}`,
          specie: animalSpecies[specieIndex],
          gender: Math.random() > 0.5 ? "M" : "F",
          birth_date: new Date(
            2022 + Math.floor(Math.random() * 2),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          )
            .toISOString()
            .split("T")[0],
          matriz_code: `MTX${Math.floor(Math.random() * 10) + 1}`.padStart(
            5,
            "0"
          ),
          tank_id: tankId,
          weight: Number((Math.random() * 5 + 1).toFixed(1)),
        });
      }

      const mockTank: TankDetail = {
        id: tankId,
        capacity: 2000,
        size: {
          width: 25,
          height: 2.5,
        },
        name: `Tanque ${tankId}`,
        animals: mockAnimals,
      };

      setTank(mockTank);
      setFilteredAnimals(mockAnimals);
      setLoading(false);
    }, 1000);
  }, [tankId]);

  // Filtrar animais com base nos termos de pesquisa
  useEffect(() => {
    if (tank?.animals) {
      const filtered = tank.animals.filter((animal) => {
        const matchesSearch =
          searchFilter === "" ||
          animal.code_animal
            .toLowerCase()
            .includes(searchFilter.toLowerCase()) ||
          animal.matriz_code.toLowerCase().includes(searchFilter.toLowerCase());

        const matchesSpecie =
          specieFilter === "" ||
          animal.specie.toLowerCase() === specieFilter.toLowerCase();

        return matchesSearch && matchesSpecie;
      });

      setFilteredAnimals(filtered);
      setCurrentPage(1);
    }
  }, [searchFilter, specieFilter, tank]);

  // Obter lista única de espécies para o filtro
  const speciesList = tank?.animals
    ? Array.from(new Set(tank.animals.map((animal) => animal.specie)))
    : [];

  // Calcular páginas para a paginação
  const totalPages = Math.ceil(filteredAnimals.length / animalsPerPage);
  const paginatedAnimals = filteredAnimals.slice(
    (currentPage - 1) * animalsPerPage,
    currentPage * animalsPerPage
  );

  // Dados para gráfico de pizza - espécies de animais
  const speciesData =
    tank?.animals?.reduce((acc: { name: string; value: number }[], animal) => {
      const existingSpecie = acc.find((a) => a.name === animal.specie);
      if (existingSpecie) {
        existingSpecie.value += 1;
      } else {
        acc.push({ name: animal.specie, value: 1 });
      }
      return acc;
    }, []) || [];

  if (loading) {
    return (
      <div className="page-container">
        <div className="content-container">
          <div
            className="content-card d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tank) {
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
    <div className="page-container">
      <div className="content-container">
        {/* Cabeçalho */}
        <div className="content-card mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center flex-wrap gap-3">
              <button
                className={styles.backButton}
                onClick={() => router.push("/dashboard/tanks")}
                aria-label="Voltar para a lista de tanques"
              >
                <BsArrowLeft />
              </button>
              <h2 className={styles.pageTitle}>
                <FaWater className={styles.pageTitleIcon} />{" "}
                {tank.name || `Tanque ${tank.id}`}
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
                    {tank.capacity} L
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
                    {tank.size.width}×{tank.size.height} m
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
                    {tank.animals?.length || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo principal em duas colunas */}
        <div className="row g-4">
          {/* Gráfico de pizza - espécies */}
          {tank.animals && tank.animals.length > 0 && (
            <div className="col-lg-6">
              <div className="content-card h-100">
                <h3 className={styles.sectionTitle}>
                  <FaFish className={styles.sectionTitleIcon} /> Distribuição
                  por Espécie
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
                            fill={COLORS[index % COLORS.length]}
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
          {tank.animals && tank.animals.length > 0 && (
            <div className="col-lg-6">
              <div className="content-card h-100">
                <h3 className={styles.sectionTitle}>
                  <FaFish className={styles.sectionTitleIcon} /> Animais neste
                  Tanque
                </h3>

                {/* Filtros de pesquisa */}
                <div className={styles.animalFilters}>
                  <div className={styles.searchInput}>
                    <BsSearch className={styles.filterIcon} />
                    <input
                      type="text"
                      placeholder="Buscar por código"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                    />
                  </div>

                  <div className={styles.filterInput}>
                    <BsFilter className={styles.filterIcon} />
                    <select
                      value={specieFilter}
                      onChange={(e) => setSpecieFilter(e.target.value)}
                      className={styles.selectFilter}
                    >
                      <option value="">Todas as espécies</option>
                      {speciesList.map((specie, index) => (
                        <option key={index} value={specie}>
                          {specie}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status de filtragem */}
                <div className={styles.filterStatus}>
                  {filteredAnimals.length === tank.animals.length ? (
                    <span>Mostrando todos os animais</span>
                  ) : (
                    <span>
                      Mostrando {filteredAnimals.length} de{" "}
                      {tank.animals.length} animais
                    </span>
                  )}

                  {(searchFilter || specieFilter) && (
                    <button
                      className={styles.clearFilterButton}
                      onClick={() => {
                        setSearchFilter("");
                        setSpecieFilter("");
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
                        <th scope="col">Peso (kg)</th>
                        <th scope="col">Nascimento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAnimals.map((animal) => (
                        <tr
                          key={animal.code_animal}
                          className={styles.tableRow}
                        >
                          <td className={styles.tableCell}>
                            {animal.code_animal}
                          </td>
                          <td className={styles.tableCell}>{animal.specie}</td>
                          <td className={styles.tableCell}>
                            {animal.gender === "M" ? "Macho" : "Fêmea"}
                          </td>
                          <td className={styles.tableCell}>
                            {animal.weight || "N/A"}
                          </td>
                          <td className={styles.tableCell}>
                            {new Date(animal.birth_date).toLocaleDateString(
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
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
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
          )}

          {/* Mensagem quando não há animais */}
          {(!tank.animals || tank.animals.length === 0) && (
            <div className="col-12">
              <div className={styles.noResults}>
                <BsInfoCircle size={32} />
                <h3>Nenhum animal cadastrado</h3>
                <p>Este tanque ainda não possui animais registrados.</p>
              </div>
            </div>
          )}

          {/* Mensagem quando não há resultados na busca */}
          {tank.animals &&
            tank.animals.length > 0 &&
            filteredAnimals.length === 0 && (
              <div className="col-12">
                <div className={styles.noResults}>
                  <BsInfoCircle size={32} />
                  <h3>Nenhum animal encontrado</h3>
                  <p>
                    Não foram encontrados animais com os critérios selecionados.
                  </p>
                  <button
                    className={styles.clearFilterButton}
                    onClick={() => {
                      setSearchFilter("");
                      setSpecieFilter("");
                    }}
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
