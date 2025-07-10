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

export interface TankStatus {
  id: string;
  name: string;
  occupation: number;
  capacity: number;
  temperature: number;
  ph: number;
  oxygen: number;
  status: 'active' | 'maintenance' | 'warning';
}

export interface RecentActivity {
  id: number;
  type: 'spawn' | 'animal' | 'maintenance' | 'water' | 'feeding';
  message: string;
  time: string;
  tankId?: string;
  userId?: string;
}

export interface WaterQualityData {
  tankId: string;
  tankName: string;
  temperature: number;
  ph: number;
  oxygen: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  timestamp: string;
}

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
  const [tankStatus, setTankStatus] = useState<TankStatus[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [waterQualityData, setWaterQualityData] = useState<WaterQualityData[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);
  const { setErrorMessage } = useError();

  // Dados simulados para demonstração
  const generateMockData = () => {
    const mockTankStatus: TankStatus[] = [
      {
        id: '1',
        name: 'Tanque Principal',
        occupation: 85,
        capacity: 1000,
        temperature: 26.5,
        ph: 7.2,
        oxygen: 8.5,
        status: 'active'
      },
      {
        id: '2',
        name: 'Tanque de Reprodução',
        occupation: 60,
        capacity: 500,
        temperature: 25.8,
        ph: 7.0,
        oxygen: 7.8,
        status: 'active'
      },
      {
        id: '3',
        name: 'Tanque de Quarentena',
        occupation: 30,
        capacity: 200,
        temperature: 24.2,
        ph: 6.8,
        oxygen: 8.2,
        status: 'warning'
      },
      {
        id: '4',
        name: 'Tanque de Crescimento',
        occupation: 90,
        capacity: 800,
        temperature: 27.1,
        ph: 7.5,
        oxygen: 7.5,
        status: 'maintenance'
      }
    ];

    const mockRecentActivities: RecentActivity[] = [
      {
        id: 1,
        type: 'spawn',
        message: 'Nova desova registrada no Tanque Principal',
        time: '2 horas atrás',
        tankId: '1'
      },
      {
        id: 2,
        type: 'animal',
        message: '15 novos alevinos adicionados ao Tanque de Crescimento',
        time: '4 horas atrás',
        tankId: '4'
      },
      {
        id: 3,
        type: 'maintenance',
        message: 'Manutenção programada no Tanque de Quarentena',
        time: '6 horas atrás',
        tankId: '3'
      },
      {
        id: 4,
        type: 'water',
        message: 'Troca de água realizada no Tanque de Reprodução',
        time: '1 dia atrás',
        tankId: '2'
      },
      {
        id: 5,
        type: 'feeding',
        message: 'Alimentação automática programada para todos os tanques',
        time: '1 dia atrás'
      }
    ];

    const mockWaterQuality: WaterQualityData[] = [
      {
        tankId: '1',
        tankName: 'Tanque Principal',
        temperature: 26.5,
        ph: 7.2,
        oxygen: 8.5,
        ammonia: 0.02,
        nitrite: 0.01,
        nitrate: 5.0,
        timestamp: new Date().toISOString()
      },
      {
        tankId: '2',
        tankName: 'Tanque de Reprodução',
        temperature: 25.8,
        ph: 7.0,
        oxygen: 7.8,
        ammonia: 0.01,
        nitrite: 0.005,
        nitrate: 3.5,
        timestamp: new Date().toISOString()
      }
    ];

    const mockMonthlyTrends = [
      { month: "Jan", animals: 120, spawns: 15, waterQuality: 95, mortality: 2 },
      { month: "Fev", animals: 135, spawns: 22, waterQuality: 92, mortality: 1 },
      { month: "Mar", animals: 150, spawns: 18, waterQuality: 88, mortality: 3 },
      { month: "Abr", animals: 165, spawns: 25, waterQuality: 90, mortality: 1 },
      { month: "Mai", animals: 180, spawns: 30, waterQuality: 87, mortality: 2 },
      { month: "Jun", animals: 195, spawns: 28, waterQuality: 93, mortality: 1 },
    ];

    return {
      tankStatus: mockTankStatus,
      recentActivities: mockRecentActivities,
      waterQualityData: mockWaterQuality,
      monthlyTrends: mockMonthlyTrends
    };
  };

  const fetchDashboardData = async () => {
    try {
      console.log("🔍 Iniciando busca de dados do dashboard...");
      
      const [statsResponse, speciesDescription] = await Promise.all([
        getDashboardStats(),
        getSpeciesDistribution()
      ]);
      
      setStats(statsResponse);
      setSpecieDescription(speciesDescription.specieDescription);

      // Gerar dados simulados para demonstração
      const mockData = generateMockData();
      setTankStatus(mockData.tankStatus);
      setRecentActivities(mockData.recentActivities);
      setWaterQualityData(mockData.waterQualityData);
      setMonthlyTrends(mockData.monthlyTrends);
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

  // Função para calcular estatísticas adicionais
  const getAdditionalStats = () => {
    const totalCapacity = tankStatus.reduce((sum, tank) => sum + tank.capacity, 0);
    const totalOccupation = tankStatus.reduce((sum, tank) => sum + (tank.capacity * tank.occupation / 100), 0);
    const averageTemperature = tankStatus.reduce((sum, tank) => sum + tank.temperature, 0) / tankStatus.length;
    const averagePh = tankStatus.reduce((sum, tank) => sum + tank.ph, 0) / tankStatus.length;
    
    return {
      totalCapacity,
      totalOccupation,
      averageTemperature: averageTemperature.toFixed(1),
      averagePh: averagePh.toFixed(1),
      activeTanks: tankStatus.filter(tank => tank.status === 'active').length,
      maintenanceTanks: tankStatus.filter(tank => tank.status === 'maintenance').length,
      warningTanks: tankStatus.filter(tank => tank.status === 'warning').length
    };
  };

  return {
    loading,
    stats,
    specieDescription,
    spawnsData,
    tankStatus,
    recentActivities,
    waterQualityData,
    monthlyTrends,
    additionalStats: getAdditionalStats(),
    refreshData: fetchDashboardData
  };
}; 