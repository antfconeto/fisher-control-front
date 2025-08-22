"use client";
import { ResponseError } from "@/types/types";
import { useState } from "react";

interface RequestState<T> {
  data: T | null;
  error: ResponseError | null;
  loading: boolean;
}

type RequestFunction<T> = (...args: any[]) => Promise<T>;

export function useRequest<T>() {
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const sendRequest = async (requestFn: RequestFunction<T>, ...args: any[]): Promise<T | void> => {
    setState({ data: null, error: null, loading: true });
    try {
      const params = args || [];
      const data = await requestFn(...params);

      if ((data as any)?.error) {
        throw {
          error: (data as any).error,
          statusCode: (data as any).error.statusCode || 500,
        };
      }
      
      setState({ data, error: null, loading: false });
      return data;

    } catch (error: any) {

      setState({
        data: null,
        error: { error: error.error || "Erro desconhecido", statusCode: error.statusCode || 500 },
        loading: false,
      });
      throw error;
    }
  };

  return { ...state, sendRequest };
}

