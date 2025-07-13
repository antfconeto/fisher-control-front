import { useState, useEffect } from "react";
import {
  getSpawnFormsWithFilters,
  SpawnFormsPagination,
  SpawnFormFilters,
} from "@/actions/spawnForm";
import { SpawningForm } from "@/types/types";
import { ResponseError } from "@/types/types";

export function useSpawningPagination(
  initialFilters: SpawnFormFilters,
  itemsPerPage: number
) {
  const [filters, setFilters] = useState<SpawnFormFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [spawnForms, setSpawnForms] = useState<SpawningForm[]>([]);
  const [pagination, setPagination] = useState<
    SpawnFormsPagination["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getSpawnFormsWithFilters({
          ...filters,
          page: currentPage,
          pageSize: itemsPerPage,
        });
        if ("error" in response) {
          setError(response.error);
          setSpawnForms([]);
          setPagination(null);
        } else {
          setSpawnForms(response.data);
          setPagination(response.pagination);
        }
      } catch (err: any) {
        setError(err?.message || "Erro ao buscar formulários de desova");
        setSpawnForms([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters, currentPage, itemsPerPage]);

  return {
    spawnForms,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
  };
}
