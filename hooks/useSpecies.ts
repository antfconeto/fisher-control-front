"use client"
import { useState, useEffect } from "react";
import { Specie } from "@/types/types";
import { useErrorContext } from "@/contexts/errorContext";
import { getAllSpecies } from "@/actions/specie";
export const useSpecie = () => {
  const [species, setSpecies] = useState<Specie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { errorMessage, setErrorMessage } = useErrorContext();

  const fetchSpecies = async () => {
    try {
      setLoading(true);
      const response = await getAllSpecies();
      setSpecies(response as Specie[]);
    } catch (error: any) {
      const errMsg = error?.message || "Erro Desconhecido";
      setErrorMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecies();
  }, []);

  return { species, loading, errorMessage, fetchSpecies };
};