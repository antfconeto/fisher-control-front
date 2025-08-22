import { useState, useEffect } from "react";
import { SpawningForm } from "@/types/types";

export const useSpawning = () => {
  const [spawningForms, setSpawningForms] = useState<SpawningForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dados mockados para demonstração
  const mockSpawningForms: SpawningForm[] = [
    {
      _id: "1",
      date: new Date("2024-01-15"),
      animal_weight: {
        beforeSpawn: 2.5,
        afterSpawn: 2.1,
      },
      egg_weight: 0.3,
      hormone: {
        hour_dosage: "08:00",
        quantity: 0.5,
      },
      monitoring: [
        { hour: "08:00", temperature: 28, hour_degree: 224 },
        { hour: "12:00", temperature: 29, hour_degree: 348 },
        { hour: "16:00", temperature: 28.5, hour_degree: 456 },
      ],
      animalId: "ANM001",
      user: {
        id: "USER001",
        name: "Usuário 1",
      },
    },
    {
      _id: "2",
      date: new Date("2024-01-20"),
      animal_weight: {
        beforeSpawn: 3.2,
        afterSpawn: 2.8,
      },
      egg_weight: 0.4,
      hormone: {
        hour_dosage: "09:00",
        quantity: 0.6,
      },
      monitoring: [
        { hour: "09:00", temperature: 27.5, hour_degree: 247 },
        { hour: "13:00", temperature: 28, hour_degree: 364 },
        { hour: "17:00", temperature: 28.5, hour_degree: 484 },
      ],
      animalId: "ANM002",
      user: {
        id: "USER001",
        name: "Usuário 1",
      },
    },
    {
      _id: "3",
      date: new Date("2024-01-25"),
      animal_weight: {
        beforeSpawn: 2.8,
        afterSpawn: 2.4,
      },
      egg_weight: 0.35,
      hormone: {
        hour_dosage: "07:30",
        quantity: 0.4,
      },
      monitoring: [
        { hour: "07:30", temperature: 28.5, hour_degree: 199 },
        { hour: "11:30", temperature: 29, hour_degree: 319 },
        { hour: "15:30", temperature: 28.5, hour_degree: 427 },
      ],
      animalId: "ANM003",
      user: {
        id: "USER001",
        name: "Usuário 1",
      },
    },
  ];

  useEffect(() => {
    // Simular carregamento de dados
    const loadSpawningForms = async () => {
      try {
        setLoading(true);
        // Simular delay de API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSpawningForms(mockSpawningForms);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar spawning forms");

      } finally {
        setLoading(false);
      }
    };

    loadSpawningForms();
  }, []);

  const createSpawningForm = async (
    spawningForm: Omit<SpawningForm, "_id">
  ) => {
    try {
      const newForm: SpawningForm = {
        ...spawningForm,
        _id: Date.now().toString(),
      };
      setSpawningForms((prev) => [...prev, newForm]);
      return newForm;
    } catch (err) {
      setError("Erro ao criar spawning form");
      throw err;
    }
  };

  const updateSpawningForm = async (spawningForm: SpawningForm) => {
    try {
      setSpawningForms((prev) =>
        prev.map((form) =>
          form._id === spawningForm._id ? spawningForm : form
        )
      );
      return spawningForm;
    } catch (err) {
      setError("Erro ao atualizar spawning form");
      throw err;
    }
  };

  const deleteSpawningForm = async (id: string) => {
    try {
      setSpawningForms((prev) => prev.filter((form) => form._id !== id));
    } catch (err) {
      setError("Erro ao excluir spawning form");
      throw err;
    }
  };

  const getSpawningFormById = (id: string) => {
    return spawningForms.find((form) => form._id === id);
  };

  const getSpawningFormsByDateRange = (startDate: Date, endDate: Date) => {
    return spawningForms.filter(
      (form) => form.date >= startDate && form.date <= endDate
    );
  };

  const getSpawningFormsByAnimal = (animalId: string) => {
    return spawningForms.filter((form) => form.animalId === animalId);
  };

  return {
    spawningForms,
    loading,
    error,
    createSpawningForm,
    updateSpawningForm,
    deleteSpawningForm,
    getSpawningFormById,
    getSpawningFormsByDateRange,
    getSpawningFormsByAnimal,
  };
};
