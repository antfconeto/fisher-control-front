import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        backgroundColor: "#f5f8fc",
        overflow: "hidden",
      }}
    >
      {/* Imagem ocupando 100% da tela */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Image
          src="/404.svg"
          alt="Página não encontrada"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      {/* Botão posicionado a 70% do topo */}
      <div
        style={{
          position: "absolute",
          top: "70%", // Posiciona 70% a partir do topo
          left: "50%", // Centraliza horizontalmente
          transform: "translateX(-50%)", // Ajusta o centro exato
          zIndex: 10,
        }}
      >
        <Link
          href="/dashboard"
          className="btn btn-primary btn-lg shadow"
          style={{
            background: "linear-gradient(145deg, #0a58ca, #084298)",
            border: "none",
            padding: "12px 30px",
            borderRadius: "8px",
            fontWeight: "600",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(10, 88, 202, 0.3)",
          }}
        >
          Voltar
        </Link>
      </div>
    </div>
  );
}
