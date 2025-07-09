"use client";
import { useState, useCallback } from 'react';
import { apiService } from '@/utils/api';
import { CustomError } from '@/utils/customError';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: CustomError | null;
}

interface UseApiReturn<T> extends ApiState<T> {
  execute: (...args: any[]) => Promise<T | void>;
  reset: () => void;
}

export function useApi<T = any>(): UseApiReturn<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (method: keyof typeof apiService, url: string, data?: any, config?: any): Promise<T | void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiService[method]<T>(url, data, config);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const customError = error instanceof CustomError ? error : new CustomError('An unexpected error occurred', 500);
      setState({ data: null, loading: false, error: customError });
      throw customError;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specific hooks for common operations
export function useGet<T = any>() {
  const api = useApi<T>();
  
  const get = useCallback((url: string, config?: any) => {
    return api.execute('get', url, undefined, config);
  }, [api]);

  return { ...api, get };
}

export function usePost<T = any>() {
  const api = useApi<T>();
  
  const post = useCallback((url: string, data?: any, config?: any) => {
    return api.execute('post', url, data, config);
  }, [api]);

  return { ...api, post };
}

export function usePut<T = any>() {
  const api = useApi<T>();
  
  const put = useCallback((url: string, data?: any, config?: any) => {
    return api.execute('put', url, data, config);
  }, [api]);

  return { ...api, put };
}

export function useDelete<T = any>() {
  const api = useApi<T>();
  
  const del = useCallback((url: string, config?: any) => {
    return api.execute('delete', url, undefined, config);
  }, [api]);

  return { ...api, delete: del };
} 