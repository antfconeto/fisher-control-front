
import Link from "next/link";

export default function ApiError() {
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
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#084298", marginBottom: 16 }}>
          Não foi possível se comunicar com o servidor.
        </h2>
        <p style={{ color: "#333", marginBottom: 24 }}>
          Verifique sua conexão com a internet ou tente novamente mais tarde.
        </p>
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
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  );
}
