import { useState, useEffect } from "react";
import { Tank } from "@/types/types";
import { getTanks, createTank, updateTank, deleteTank } from "@/actions/tank";
import { useErrorContext } from "@/contexts/errorContext";

export const useTanks = () => {
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { errorMessage, setErrorMessage } = useErrorContext();
  const fetchTanks = async () => {
    try {
      setLoading(true);
      const response = await getTanks();
      setTanks(response as Tank[]);
    } catch (error: any) {
      const errMsg = error?.message || "Erro Desconhecido";
      setErrorMessage(errMsg);
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
        return null;
      }
      await fetchTanks();
      return response;
    } catch (error: any) {
      const errMsg = error?.message || "Erro Desconhecido";
      setErrorMessage(errMsg);
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
        return null;
      }
      await fetchTanks();
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
        return false;
      }
      await fetchTanks();
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