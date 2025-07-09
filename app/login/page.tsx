"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/loginAction";
import { useRequest } from "@/hooks/useRequest";
import { UserLoginResponse } from "@/types/user";
import { useAuth } from "@/contexts/authContext";
import { ResponseError } from "@/types/types";
import { Button } from "@/components/buttons/buttons";
import { DotLoader } from "react-spinners";
import Image from "next/image";
import { useError } from "@/hooks/useError";
import { useUser } from "@/hooks/userHook";
import { ErrorBox } from "@/components/ErrorBox";
import { EyeClosed, Eye, Mail, Lock } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login } = useAuth();
  const { setUser } = useUser();
  const { loading, sendRequest } = useRequest<
    UserLoginResponse | ResponseError
  >();
  const router = useRouter();
  const { errorMessage, setErrorMessage } = useError();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await sendRequest(loginAction, { email, password });
      if (response) {
        const userData = response as UserLoginResponse;
        login(userData.token);
        setUser(userData.user);
        router.push("/dashboard");
      }
    } catch (err: any) {
      const errMsg = err?.error || "Erro desconhecido";
      setErrorMessage(errMsg);
    }
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "#f5f8fc",
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      {errorMessage && (
        <ErrorBox
          errorMessage={errorMessage}
          otherClassName=""
          setErrorMessage={setErrorMessage}
        />
      )}
      
      <div
        className="shadow-lg rounded-4 overflow-hidden d-flex flex-column flex-md-row align-items-stretch"
        style={{
          maxWidth: 900,
          width: "95%",
          background: "#ffffff",
          border: "1px solid #eaedf2",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
          animation: "slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Lado da imagem */}
        <div
          className="d-none d-md-flex align-items-center justify-content-center flex-column p-5"
          style={{ 
            width: 380,
            background: "linear-gradient(145deg, #0a58ca 0%, #084298 100%)",
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative background elements */}
          <div className="position-absolute" style={{
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'float 15s ease-in-out infinite'
          }}></div>
          
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mb-4 position-relative"
            style={{ 
              width: 200, 
              height: 200, 
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255,255,255,0.3)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
            }}
          >
            <Image
              src="/logo.svg"
              priority={true}
              alt="Fisher control"
              width={120}
              height={120}
              style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))" }}
            />
          </div>
          
          <h1 className="text-white fs-2 fw-bold mt-3 text-center position-relative" style={{
            textShadow: "0 2px 8px rgba(0,0,0,0.2)",
            letterSpacing: 1,
            fontWeight: 700
          }}>
            Gerenciador de açudes
          </h1>
          
          <div className="text-white opacity-90 mt-3 text-center position-relative" style={{
            fontSize: 16,
            letterSpacing: 0.5,
            lineHeight: 1.6,
            fontWeight: 300
          }}>
            Controle total do seu sistema de piscicultura<br/>
            com praticidade e segurança.
          </div>
        </div>

        {/* Lado do formulário */}
        <div
          className="p-5 d-flex flex-column justify-content-center"
          style={{ 
            width: 450, 
            minWidth: 280,
            background: "#ffffff",
          }}
        >
          <h3 className="text-primary d-flex align-items-center mb-4 fw-bold fs-2" style={{
            letterSpacing: 1,
            color: "#0a58ca"
          }}>
            <span className="me-3">🐟</span> Fisher Control
          </h3>
          
          <form onSubmit={handleSubmit} autoComplete="on">
            <div className="mb-4">
              <label className="form-label fw-semibold" style={{
                color: "#333",
                letterSpacing: 0.5
              }}>
                Email
              </label>
              <div className="input-group" style={{
                borderRadius: 8,
                border: "1px solid #eaedf2",
                overflow: "hidden",
                transition: "all 0.3s ease"
              }}>
                <span className="input-group-text border-0" style={{
                  background: "#f8f9fa",
                  color: "#6c757d",
                  borderRight: "1px solid #eaedf2"
                }}>
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control border-0 px-3 py-3"
                  placeholder="Digite seu email"
                  autoComplete="email"
                  required
                  style={{ 
                    background: "#ffffff",
                    color: "#333",
                    fontSize: 16,
                    minHeight: 50
                  }}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="form-label fw-semibold" style={{
                color: "#333",
                letterSpacing: 0.5
              }}>
                Senha
              </label>
              <div className="input-group" style={{
                borderRadius: 8,
                border: "1px solid #eaedf2",
                overflow: "hidden",
                transition: "all 0.3s ease"
              }}>
                <span className="input-group-text border-0" style={{
                  background: "#f8f9fa",
                  color: "#6c757d",
                  borderRight: "1px solid #eaedf2"
                }}>
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control border-0 px-3 py-3"
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  required
                  style={{ 
                    background: "#ffffff",
                    color: "#333",
                    fontSize: 16,
                    minHeight: 50
                  }}
                />
                <button
                  type="button"
                  className="btn border-0"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ 
                    background: "#f8f9fa",
                    color: "#6c757d",
                    borderLeft: "1px solid #eaedf2",
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = "#e9ecef";
                    e.currentTarget.style.color = "#495057";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = "#f8f9fa";
                    e.currentTarget.style.color = "#6c757d";
                  }}
                >
                  {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-100 py-3 fw-bold fs-5 mt-3 mb-4 border-0"
              style={{
                borderRadius: 8,
                background: "linear-gradient(145deg, #0a58ca 0%, #084298 100%)",
                color: "white",
                boxShadow: "0 4px 15px rgba(10, 88, 202, 0.3)",
                letterSpacing: 1,
                transition: "all 0.3s ease",
                overflow: "hidden",
                minHeight: 55
              }}
              disabled={loading}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(10, 88, 202, 0.4)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(10, 88, 202, 0.3)';
              }}
            >
              {loading ? <DotLoader color="#fff" size={20} /> : "ENTRAR"}
            </button>
          </form>
          
          <hr className="border border-secondary border-2 opacity-25 rounded-pill my-4" />
          
          <button
            onClick={() => {
              window.location.href = "/signup";
            }}
            className="w-100 py-3 fw-semibold border-0"
            style={{
              borderRadius: 8,
              background: "#ffffff",
              color: "#0a58ca",
              border: "2px solid #0a58ca",
              letterSpacing: 0.5,
              overflow: "hidden",
              transition: "all 0.3s ease",
              minHeight: 55
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = "#0a58ca";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.color = "#0a58ca";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Não possui conta? <span className="fw-bold">Crie uma!</span>
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.98); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        
        input::placeholder {
          color: #6c757d !important;
        }
        
        input:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        
        .input-group:focus-within {
          border-color: #0a58ca !important;
          box-shadow: 0 0 0 3px rgba(10, 88, 202, 0.1) !important;
        }
        
        @media (max-width: 768px) {
          .p-5 { padding: 2rem !important; }
          .rounded-4 { border-radius: 1rem !important; }
        }
        
        @media (max-width: 600px) {
          .p-5 { padding: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}
