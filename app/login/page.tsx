"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/loginAction";
import { useRequest } from "@/hooks/useRequest";
import { UserLoginResponse } from "@/types/user";
import { useAuth } from "@/hooks/useAuth";
import { ResponseError } from "@/types/types";
import { Button } from "@/components/buttons";
import { DotLoader } from "react-spinners";
import Image from "next/image";
import { useError } from "@/hooks/useError";
import { useUser } from "@/hooks/userHook";
import { ErrorBox } from "@/components/ErrorBox";
import { EyeClosed, Eye } from "lucide-react";
export default function LoginForm() {
  //states of input
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  //global states of token
  const { setToken } = useAuth();
  const { setUser } = useUser();
  const { loading, sendRequest } = useRequest<
    UserLoginResponse | ResponseError
  >();
  //get router
  const router = useRouter();
  //get global state of errors
  const { errorMessage, setErrorMessage } = useError();

  const handleSubmit = async (e: React.FormEvent) => {
    //Stay in page
    e.preventDefault();
    try {
      //send requesto for login action with the params
      const response = await sendRequest(loginAction, { email, password });
      //verify if not have any error, and if response exist
      if (response) {
        const userData = response as UserLoginResponse;
        //set token and user
        setToken(userData.token);
        setUser(userData.user);
        //redirect for home
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Erro desconhecido";
      setErrorMessage(errMsg);
    }
  };

  return (
    <div className="d-flex vh-100 align-items-center justify-content-center bg-light">
      {errorMessage ? (
        <ErrorBox
          errorMessage={errorMessage}
          otherClassName=""
          setErrorMessage={setErrorMessage}
        ></ErrorBox>
      ) : (
        <></>
      )}
      <div
        className="d-flex flex-column shadow-lg rounded-3 overflow-hidden"
        style={{ maxWidth: "700px" }}
      >
        {/* Logo para Mobile (visível apenas em dispositivos móveis) */}
        <div className="d-md-none bg-primary p-4 d-flex flex-column align-items-center">
          <Image
            src="logo.svg"
            priority={true}
            alt="Fisher control"
            style={{ color: "#fff" }}
            width={150}
            height={150}
          />
          <h1 className="text text-light fs-4 text-center mt-2">
            Gerenciador de açudes
          </h1>
        </div>

        <div className="d-flex">
          {/* Lado da imagem (visível apenas em desktop) */}
          <div
            className="bg-primary d-none d-md-flex align-items-center justify-content-around flex-column p-4"
            style={{ width: "300px" }}
          >
            <Image
              src="logo.svg"
              priority={true}
              alt="Fisher control"
              style={{ color: "#fff" }}
              width={200}
              height={200}
            />
            <h1 className="text text-light fs-4 text-center">
              Gerenciador de açudes
            </h1>
          </div>

          {/* Lado do formulário */}
          <div className="p-4 bg-white" style={{ width: "400px" }}>
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
                    {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                otherClassName="w-100"
                onClick={(e) => handleSubmit(e)}
              >
                {loading ? <DotLoader color="#fff" size={20} /> : "Entrar"}
              </Button>
            </form>
            <hr className="border border-primary border-3 opacity-75 rounded-pill" />
            <Button
              onClick={() => {
                window.location.href = "/signup";
              }}
              otherClassName="position-relative top-0 start-50 translate-middle-x"
            >
              Não possui conta? Crie uma!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
