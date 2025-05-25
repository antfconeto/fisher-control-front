"use client";
import { useState, useEffect } from 'react';
import { useError } from './useError';
import { 
  getDashboardStats, 
  getSpeciesDistribution, 
  getSpawnsByMonth,
  DashboardStats,
  SpeciesData,
  SpawnsData
} from '@/actions/dashboard';
import { Animal, Specie } from '@/types/types';

export const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTanks: 0,
    totalAnimals: 0,
    totalSpawns: 0,
    tankOccupation: 0,
    upcomingSpawns: 0,
  });
  const [specieDescription, setSpecieDescription] = useState<{specie:Specie, animals:Animal[]}[]>([]);
  const [spawnsData, setSpawnsData] = useState<SpawnsData[]>([]);
  const { setErrorMessage } = useError();

  const fetchDashboardData = async () => {
    try {
      console.log("🔍 Iniciando busca de dados do dashboard...");
      
      const [statsResponse, speciesDescription] = await Promise.all([
        getDashboardStats(),
        getSpeciesDistribution()
      ]);
      
      setStats(statsResponse);
      setSpecieDescription(speciesDescription.specieDescription);
      
      console.log("✅ Dados do dashboard atualizados com sucesso");
    } catch (error: any) {
      console.error("❌ Erro ao buscar dados do dashboard:", error);
      setErrorMessage(error.message || 'Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    loading,
    stats,
    specieDescription,
    spawnsData,
    refreshData: fetchDashboardData
  };
}; 