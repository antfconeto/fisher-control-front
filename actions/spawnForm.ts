import { ResponseError, SpawningForm } from "@/types/types";

const urlApi = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface SpawnFormsPagination {
  data: SpawningForm[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface SpawnFormFilters {
  startDate?: string;
  endDate?: string;
  userId?: string;
  animalId?: string;
  page?: number;
  pageSize?: number;
}

export const getSpawnFormsWithFilters = async (
  filters: SpawnFormFilters
): Promise<SpawnFormsPagination | ResponseError> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  if (!token) {
    return {
      error: "Token not received",
      statusCode: 401,
    };
  }
  try {
    const response = await fetch(`${urlApi}/spawn/getSpawnFormsWithFilters`, {
      method: "POST", // Corrigido para POST
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters),
    });
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      return {
        error: errorMessage?.error || "Erro ao buscar formulários de desova",
        statusCode: response.status,
      };
    }
    const responseBody: SpawnFormsPagination = await response.json();
    return responseBody;
  } catch (error: any) {
    return {
      error:
        error.message || "Erro desconhecido ao buscar formulários de desova",
      statusCode: 500,
    };
  }
};
