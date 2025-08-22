"use client"
import { useEffect, useState } from "react";

export interface ErrorHook {
    errorMessage: string | null;
    setErrorMessage: (message: string | null) => void;
    handleError: (error: any) => void;
}

export function useError(): ErrorHook {
    const [errorMessage, setErrorMessage] = useState<string | null>("");

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(null), 10000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const handleError = (error: any) => {
        const message = error.response?.data?.message || error.message || 'Ocorreu um erro inesperado';
        setErrorMessage(message);

    };

    return { errorMessage, setErrorMessage, handleError };
}