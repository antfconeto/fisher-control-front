"use client"
import { useState, useEffect } from "react";
import { Tank } from "@/types/types";
import { getTanks, createTank, updateTank, deleteTank } from "@/actions/tank";
import { useErrorContext } from "@/contexts/errorContext";
import { useNotification } from "@/contexts/notificationContext";

export const useTanks = () => {
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { errorMessage, setErrorMessage } = useErrorContext();
  const {successNotification,errorNotification} = useNotification()
  const fetchTanks = async () => {
    try {
      setLoading(true);
      const response = await getTanks();
      setTanks(response as Tank[]);
      successNotification("Tanques Carregados", "Tanques carregados com sucesso", {
        duration: 10000,
      });
    } catch (error: any) {
      const errMsg = error?.message || "Erro Desconhecido";
      setErrorMessage(errMsg);
      errorNotification("Erro ao Carregar Tanques", "Erro ao carregar tanques", {
        duration: 10000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTank = async (tank: Tank) => {
    try {
      setLoading(true);
      const response = await createTank(tank);
      if ('error' in response) {
        setErrorMessage(response.error);
        errorNotification("Erro ao Criar Tanque", "Erro ao criar tanque", {
          duration: 10000,
        });
        return null;
      }
      await fetchTanks();
      successNotification("Tanque Criado", "Tanque criado com sucesso", {
        duration: 10000,
      });
      return response;
    } catch (error: any) {
      const errMsg = error?.message || "Erro Desconhecido";
      setErrorMessage(errMsg);
      errorNotification("Erro ao Criar Tanque", "Erro ao criar tanque", {
        duration: 10000,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTank = async (tank: Tank) => {
    try {
      setLoading(true);
      const response = await updateTank(tank);
      if ('error' in response) {
        setErrorMessage(response.error);
        errorNotification("Erro ao Atualizar Tanque", "Erro ao atualizar tanque", {
          duration: 10000,
        });
        return null;
      }
      await fetchTanks();
      successNotification("Tanque Atualizado", "Tanque atualizado com sucesso", {
        duration: 10000,
      });
      return response;
    } catch (error: any) {
      const errMsg = error?.message || "Erro Desconhecido";
      setErrorMessage(errMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTank = async (tankId: string) => {
    try {
      setLoading(true);
      const response = await deleteTank(tankId);
      if (response && 'error' in response) {
        setErrorMessage(response.error);
        errorNotification("Erro ao Deletar Tanque", "Erro ao deletar tanque", {
          duration: 10000,
        });
        return false;
      }
      await fetchTanks();
      successNotification("Tanque Deletado", "Tanque deletado com sucesso", {
        duration: 10000,
      });
      return true;
    } catch (error: any) {
      const errMsg = error?.message || "Erro Desconhecido";
      setErrorMessage(errMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTanks();
  }, []);

  return { 
    tanks, 
    loading, 
    errorMessage, 
    fetchTanks,
    createTank: handleCreateTank,
    updateTank: handleUpdateTank,
    deleteTank: handleDeleteTank
  };
};