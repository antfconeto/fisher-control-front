"use server";
import { ResponseError, SpawningForm } from "@/types/types";
import { cookies } from "next/headers";

const urlApi = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

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
  userName?: string;
  animalId?: string;
  page?: number;
  pageSize?: number;
}

export const getSpawnFormsWithFilters = async (
  filters: SpawnFormFilters
): Promise<SpawnFormsPagination | ResponseError> => {
  const token = (await cookies()).get("access_token");
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
        Authorization: `Bearer ${token.value}`,
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

export const createSpawnForm = async (
  spawnForm: SpawningForm
): Promise<SpawningForm | ResponseError> => {
  const token = (await cookies()).get("access_token");
  if (!token) {
    return {
      error: "Token not received",
      statusCode: 401,
    };
  }
  try {
    const response = await fetch(`${urlApi}/spawn/createSpawnForm`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ spawnForm }),
    });
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      return {
        error: errorMessage?.error || "Erro ao criar formulário de desova",
        statusCode: response.status,
      };
    }
    const responseBody: SpawningForm = await response.json();
    return responseBody;
  } catch (error: any) {
    return {
      error: error.message || "Erro desconhecido ao criar formulário de desova",
      statusCode: 500,
    };
  }
};

export const updateSpawnForm = async (
  spawnForm: SpawningForm
): Promise<SpawningForm | ResponseError> => {
  const token = (await cookies()).get("access_token");
  if (!token) {
    return {
      error: "Token not received",
      statusCode: 401,
    };
  }
  try {
    const response = await fetch(`${urlApi}/spawn/updateSpawnForm`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ spawnForm }),
    });
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      return {
        error: errorMessage?.error || "Erro ao atualizar formulário de desova",
        statusCode: response.status,
      };
    }
    const responseBody: SpawningForm = await response.json();
    return responseBody;
  } catch (error: any) {
    return {
      error:
        error.message || "Erro desconhecido ao atualizar formulário de desova",
      statusCode: 500,
    };
  }
};

export const deleteSpawnForm = async (
  spawnFormId: string
): Promise<boolean | ResponseError> => {
  const token = (await cookies()).get("access_token");
  if (!token) {
    return {
      error: "Token not received",
      statusCode: 401,
    };
  }
  try {
    const response = await fetch(
      `${urlApi}/spawn/deleteSpawnForm?spawnFormId=${spawnFormId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      return {
        error: errorMessage?.error || "Erro ao excluir formulário de desova",
        statusCode: response.status,
      };
    }
    const responseBody: { isDeleted: boolean } = await response.json();
    return responseBody.isDeleted;
  } catch (error: any) {
    return {
      error:
        error.message || "Erro desconhecido ao excluir formulário de desova",
      statusCode: 500,
    };
  }
};

export const getSpawnFormById = async (
  spawnFormId: string
): Promise<SpawningForm | ResponseError> => {
  const token = (await cookies()).get("access_token");
  if (!token) {
    return {
      error: "Token not received",
      statusCode: 401,
    };
  }
  try {
    const response = await fetch(
      `${urlApi}/spawn/getSpawnFormById`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spawnFormId }),
      }
    );
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      return {
        error: errorMessage?.error || "Erro ao buscar formulário de desova",
        statusCode: response.status,
      };
    }
    const responseBody: SpawningForm = await response.json();
    return responseBody;
  } catch (error: any) {
    return {
      error:
        error.message || "Erro desconhecido ao buscar formulário de desova",
      statusCode: 500,
    };
  }
};

export const getCountSpawn = async (
): Promise<number |  ResponseError> => {
  const token = (await cookies()).get("access_token");
  if (!token) {
    return {
      error: "Token not received",
      statusCode: 401,
    };
  }
  try {
    const response = await fetch(`${urlApi}/spawn/countSpawnForms`, {
      method: "GET", // Corrigido para POST
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      }
    });
    if (!response.ok) {
      const errorMessage: ResponseError = await response.json();
      return {
        error: errorMessage?.error || "Erro ao buscar o total de desovas",
        statusCode: response.status,
      };
    }
    const responseBody: {count:number} = await response.json();
    return responseBody.count;
  } catch (error: any) {
    return {
      error:
        error.message || "Erro desconhecido ao buscar o total de desovas",
      statusCode: 500,
    };
  }
};
