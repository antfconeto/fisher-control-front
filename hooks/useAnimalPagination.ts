import { useState, useEffect } from "react";
import { Animal, AnimalPagination, ResponseError } from "@/types/types";
import { listAnimals } from "@/actions/animal";

interface UseAnimalsPaginationProps {
  filters: {
    codeAnimal?: string;
    specie?: string;
    gender?: "M" | "F";
    tankId?: string;
  };
  itemsPerPage: number;
}

export function useAnimalsPagination({
  filters,
  itemsPerPage,
}: UseAnimalsPaginationProps) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAnimals, setTotalAnimals] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimals = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = (await listAnimals(
          currentPage,
          itemsPerPage,
          filters
        )) as AnimalPagination;

        setAnimals(response.animals);
        setTotalPages(response.totalPages);
        setTotalAnimals(response.totalAnimals);
      } catch (err: any) {
        setError(err?.message || "Erro ao buscar animais");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, [currentPage, filters, itemsPerPage]);

  return {
    animals,
    totalPages,
    currentPage,
    totalAnimals,
    setAnimals,
    setCurrentPage,
    loading,
    error,
  };
}