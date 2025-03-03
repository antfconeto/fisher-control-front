"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/loginAction";
import { useRequest } from "@/hooks/useRequest";
import { UserLoginResponse } from "@/types/user";
import { useAuth } from "@/hooks/useAuth";
import { ResponseError } from "@/types/types";
import styles from "./login.module.css";
import { Button } from "@/components/buttons";
import Image from "next/image";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setToken } = useAuth();
  const { data, error, loading, sendRequest } = useRequest<UserLoginResponse | ResponseError>();
  const router = useRouter();

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await sendRequest(loginAction, { email, password });
      if (response && !error) {
        const userData = response as UserLoginResponse;
        if (userData?.user && userData?.token) {
          setToken(userData.token);
          window.location.href = "/home";
        }
      }
    } catch (err: any) {
      const errMsg = (err?.error || "Erro desconhecido");
      setErrorMessage(errMsg); 
    }
  };

  return (
    <div className="d-flex vh-100 align-items-center justify-content-center bg-light">
      {errorMessage && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-3 zindex-tooltip">
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {errorMessage}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setErrorMessage(null)}
            ></button>
          </div>
        </div>
      )}

      <div className="d-flex shadow-lg rounded-3 overflow-hidden" style={{ maxWidth: '700px' }}>
        {/* Lado da imagem */}
        <div className="bg-primary d-none d-md-flex align-items-center justify-content-around flex-column p-4" style={{ width: '300px' }}>
          <Image src="logo.svg" alt="Fisher control" style={{ color: "#fff" }} width={200} height={200} />
          <h1 className="text text-light fs-4 text-center">Gerenciador de açudes</h1>
        </div>

        {/* Lado do formulário */}
        <div className="p-4 bg-white" style={{ width: '400px' }}>
          <h3 className="text-primary d-flex align-items-center mb-4">
            <span className="me-2">🐟</span> Fisher Control
          </h3>
          <form>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Digite seu email"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Digite sua senha"
              />
            </div>
            <Button type="submit" otherClassName="w-100" onClick={(e) => handleSubmit(e)}>
              Entrar
            </Button>
          </form>
          <hr className="border border-primary border-3 opacity-75 rounded-pill" />
          <Button otherClassName="position-relative top-0 start-50 translate-middle-x">
            Não possui conta? Crie uma!
          </Button>
        </div>
      </div>
    </div>
  );
}
