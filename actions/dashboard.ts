"use server";
import { cookies } from "next/headers";
import { CustomConsole } from "@/utils/customLogger";
import { CustomError } from "@/utils/customError";
import { Animal, Specie } from "@/types/types";

const consoler = new CustomConsole();
const urlApi = process.env.API_URL || "http://localhost:5000";

export interface DashboardStats {
  totalUsers: number;
  totalTanks: number;
  totalAnimals: number;
  totalSpawns: number;
  tankOccupation: number;
  upcomingSpawns: number;
  totalEggWeight: number;
  averageWeightLoss: number;
}

export interface SpeciesData {
  name: string;
  value: number;
}

export interface SpawnsData {
  month: number;
  spawns: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {

  const token = (await cookies()).get("access_token");
  if (!token) {
    throw new CustomError("Token não recebido", 401);
  }

  try {
    const response = await fetch(`${urlApi}/dashboard/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      consoler.error(
        `Erro ao buscar estatísticas do dashboard, erro: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      throw new CustomError(
        errorMessage?.error || "Erro ao buscar estatísticas do dashboard",
        response.status
      );
    }

    const responseBody: DashboardStats = await response.json();

    return responseBody;
  } catch (error: any) {
    consoler.error(
      `Erro ao buscar estatísticas do dashboard, erro: ${
        error.message
      }, statusCode: ${error.statusCode || 500}`
    );
    throw new CustomError(
      error.message || "Erro ao buscar estatísticas do dashboard",
      error.statusCode || 500
    );
  }
};

export const getSpeciesDistribution = async (): Promise<{
  specieDescription: { specie: Specie; animals: Animal[] }[];
}> => {

  const token = (await cookies()).get("access_token");
  if (!token) {
    throw new CustomError("Token não recebido", 401);
  }

  try {
    const response = await fetch(`${urlApi}/animal/getAllAnimalsAndSpecies`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      consoler.error(
        `Erro ao buscar distribuição de espécies, erro: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      throw new CustomError(
        errorMessage?.error || "Erro ao buscar distribuição de espécies",
        response.status
      );
    }

    const responseBody: {
      specieDescription: { specie: Specie; animals: Animal[] }[];
    } = await response.json();

    return responseBody;
  } catch (error: any) {
    consoler.error(
      `Erro ao buscar distribuição de espécies, erro: ${
        error.message
      }, statusCode: ${error.statusCode || 500}`
    );
    throw new CustomError(
      error.message || "Erro ao buscar distribuição de espécies",
      error.statusCode || 500
    );
  }
};

export const getSpawnsByMonth = async (): Promise<SpawnsData[]> => {

  const token = (await cookies()).get("access_token");
  if (!token) {
    throw new CustomError("Token não recebido", 401);
  }

  try {
    const response = await fetch(`${urlApi}/dashboard/spawns-by-month`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      consoler.error(
        `Erro ao buscar desovas por mês, erro: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      throw new CustomError(
        errorMessage?.error || "Erro ao buscar desovas por mês",
        response.status
      );
    }

    const responseBody: SpawnsData[] = await response.json();

    return responseBody;
  } catch (error: any) {
    consoler.error(
      `Erro ao buscar desovas por mês, erro: ${error.message}, statusCode: ${
        error.statusCode || 500
      }`
    );
    throw new CustomError(
      error.message || "Erro ao buscar desovas por mês",
      error.statusCode || 500
    );
  }
};
