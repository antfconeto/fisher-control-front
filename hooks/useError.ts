"use client"
import { useEffect, useState } from "react";

export interface ErrorHook{
    errorMessage:string | null;
    setErrorMessage:(message:string | null) => void;
}
export function useError():ErrorHook{
    const [errorMessage, setErrorMessage] = useState<string | null>("");
      useEffect(() => {
        if (errorMessage) {
          const timer = setTimeout(() => setErrorMessage(null), 10000);
          return () => clearTimeout(timer);
        }
      }, [errorMessage]);

    return { errorMessage, setErrorMessage };
}