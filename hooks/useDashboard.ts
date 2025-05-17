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
  const [speciesData, setSpeciesData] = useState<SpeciesData[]>([]);
  const [spawnsData, setSpawnsData] = useState<SpawnsData[]>([]);
  const { setErrorMessage } = useError();

  const fetchDashboardData = async () => {
    try {
      console.log("🔍 Iniciando busca de dados do dashboard...");
      
      const [statsResponse, speciesResponse, spawnsResponse] = await Promise.all([
        getDashboardStats(),
        getSpeciesDistribution(),
        getSpawnsByMonth()
      ]);

      console.log("📊 Dados de desovas recebidos:", spawnsResponse);
      
      setStats(statsResponse);
      setSpeciesData(speciesResponse);
      setSpawnsData(spawnsResponse);
      
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
    speciesData,
    spawnsData,
    refreshData: fetchDashboardData
  };
}; 