"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRequest } from "@/hooks/useRequest";
import { Role, UserLoginResponse } from "@/types/user";
import { useAuth } from "@/hooks/useAuth";
import { ResponseError } from "@/types/types";
import { Button } from "@/components/buttons/Buttons";
import { DotLoader } from "react-spinners";
import Image from "next/image";
import { useError } from "@/hooks/useError";
import { useUser } from "@/hooks/userHook";
import { ErrorBox } from "@/components/ErrorBox";
import { signUpAction } from "@/actions/signUpAction";
import { Eye, EyeClosed } from "lucide-react";

export default function SignUpForm() {
  // Input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Global states
  const { setToken } = useAuth();
  const { setUser } = useUser();
  const {loading, sendRequest } = useRequest<
    UserLoginResponse | ResponseError
  >();
  const { errorMessage, setErrorMessage } = useError();

  // Router
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("❌ As senhas não coincidem");
      return;
    }
    try {
      const response = await sendRequest(signUpAction, {
        email,
        password,
        username,
        role: Role.ADMIN,
      });
      if (response) {
        const userData = response as UserLoginResponse;
        setToken(userData.token);
        setUser(userData.user);
        router.push("/dashboard");
      }
    } catch (err: any) {
      const errMsg = err?.error || "Erro desconhecido";
      setErrorMessage(errMsg);
    }
  };

  return (
    <div className="d-flex vh-100 align-items-center justify-content-center bg-light">
      {errorMessage && (
        <ErrorBox
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          otherClassName=""
        />
      )}
      <div
        className="d-flex shadow-lg rounded-3 overflow-hidden"
        style={{ maxWidth: "700px" }}
      >
        <div className="p-4 bg-white" style={{ width: "400px" }}>
          <h3 className="text-primary d-flex align-items-center mb-4">
            <span className="me-2">🐟</span> Fisher Control
          </h3>
          <form>
            <div className="mb-3">
              <label className="form-label">Nome de Usuário</label>
              <input
                type="text"
                onChange={(e) => setUserName(e.target.value)}
                className="form-control"
                placeholder="Digite seu nome"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Digite seu email"
              />
            </div>
            <div className="mb-3 position-relative">
              <label className="form-label">Senha</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ?   <Eye size={18} /> : <EyeClosed size={18} />}
                </button>
              </div>
            </div>
            <div className="mb-3 position-relative">
              <label className="form-label">Confirmar senha</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-control"
                  placeholder="Confirme sua senha"
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ?  <Eye size={18} /> : <EyeClosed size={18} />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              otherClassName="w-100"
              onClick={(e) => handleSubmit(e)}
            >
              {loading ? (
                <DotLoader color="#fff" size={20} />
              ) : (
                "Crie sua conta"
              )}
            </Button>
          </form>
          <hr className="border border-primary border-3 opacity-75 rounded-pill" />
          <Button onClick={()=>{
            window.location.href = "/login";
          }} otherClassName="position-relative top-0 start-50 translate-middle-x">
            Já possui conta? Então entre!
          </Button>
        </div>
        <div
          className="bg-primary d-none d-md-flex align-items-center justify-content-around flex-column p-4"
          style={{ width: "300px" }}
        >
          <div className="d-md-flex align-items-center flex-column">
            <Image
              src="logo.svg"
              priority
              className="align-self-center"
              alt="Fisher control"
              width={200}
              height={200}
            />
            <h1 className="text text-light fs-4 text-center">
              Gerenciador de açudes
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
