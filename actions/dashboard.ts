"use server";
import { cookies } from "next/headers";
import { CustomConsole } from "@/utils/customLogger";
import { CustomError } from "@/utils/customError";
import * as errorMessages from "@/utils/errorMessages.json";
import { Animal, Specie } from "@/types/types";

const consoler = new CustomConsole();
const urlApi = process.env.API_URL || "http://localhost:4000";

export interface DashboardStats {
  totalUsers: number;
  totalTanks: number;
  totalAnimals: number;
  totalSpawns: number;
  tankOccupation: number;
  upcomingSpawns: number;
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
  console.log(`🔁 Iniciando processo para buscar estatísticas do dashboard`);
  const token = (await cookies()).get('access_token');
  if (!token) {
    throw new CustomError("Token não recebido", 401);
  }

  try {
    const response = await fetch(`${urlApi}/dashboard/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      consoler.error(
        `Erro ao buscar estatísticas do dashboard, erro: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      throw new CustomError(errorMessage?.error || "Erro ao buscar estatísticas do dashboard", response.status);
    }

    const responseBody: DashboardStats = await response.json();
    console.log(`✅ Estatísticas do dashboard obtidas com sucesso`);
    return responseBody;
  } catch (error: any) {
    consoler.error(
      `Erro ao buscar estatísticas do dashboard, erro: ${error.message}, statusCode: ${error.statusCode || 500}`
    );
    throw new CustomError(error.message || "Erro ao buscar estatísticas do dashboard", error.statusCode || 500);
  }
};

export const getSpeciesDistribution = async (): Promise<{specieDescription:{specie:Specie, animals:Animal[]}[]}> => {
  console.log(`🔁 Iniciando processo para buscar distribuição de espécies`);
  const token = (await cookies()).get('access_token');
  if (!token) {
    throw new CustomError("Token não recebido", 401);
  }

  try {
    const response = await fetch(`${urlApi}/animal/getAllAnimalsAndSpecies`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      consoler.error(
        `Erro ao buscar distribuição de espécies, erro: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      throw new CustomError(errorMessage?.error || "Erro ao buscar distribuição de espécies", response.status);
    }

    const responseBody: {specieDescription:{specie:Specie, animals:Animal[]}[]}= await response.json();
    console.log(`✅ Distribuição de espécies obtida com sucesso`);
    console.log(responseBody)
    return responseBody;
  } catch (error: any) {
    consoler.error(
      `Erro ao buscar distribuição de espécies, erro: ${error.message}, statusCode: ${error.statusCode || 500}`
    );
    throw new CustomError(error.message || "Erro ao buscar distribuição de espécies", error.statusCode || 500);
  }
};

export const getSpawnsByMonth = async (): Promise<SpawnsData[]> => {
  console.log(`🔁 Iniciando processo para buscar desovas por mês`);
  const token = (await cookies()).get('access_token');
  if (!token) {
    throw new CustomError("Token não recebido", 401);
  }

  try {
    const response = await fetch(`${urlApi}/dashboard/spawns-by-month`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      consoler.error(
        `Erro ao buscar desovas por mês, erro: ${errorMessage?.error}, statusCode: ${response.status}`
      );
      throw new CustomError(errorMessage?.error || "Erro ao buscar desovas por mês", response.status);
    }

    const responseBody: SpawnsData[] = await response.json();
    console.log(`✅ Desovas por mês obtidas com sucesso`);
    return responseBody;
  } catch (error: any) {
    consoler.error(
      `Erro ao buscar desovas por mês, erro: ${error.message}, statusCode: ${error.statusCode || 500}`
    );
    throw new CustomError(error.message || "Erro ao buscar desovas por mês", error.statusCode || 500);
  }
}; 