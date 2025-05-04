"use client"
import { useState, useEffect } from "react";
import { Tank } from "@/types/types";
import { getTanks } from "@/actions/tank";
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

  useEffect(() => {
    fetchTanks();
  }, []);

  return { tanks, loading, errorMessage, fetchTanks };
};