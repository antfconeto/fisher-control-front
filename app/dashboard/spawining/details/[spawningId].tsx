import React from "react";
import SpawningDetails from "../components/SpawningDetails";
import { useRouter } from "next/navigation";

// Mock de dados de uma desova
const mockSpawn = {
  id: "d1",
  date: "2024-06-10",
  tank: "Tanque 1",
  specie: "Tambaqui",
  status: "Concluída",
  totalEggs: 25000,
  notes: "Procedimento sem intercorrências.",
};

export default function SpawningDetailsPage() {
  const router = useRouter();

  return (
    <div style={{ padding: 32, background: "#f7f7fa", minHeight: "100vh" }}>
      <SpawningDetails spawning={mockSpawn} />
      <button style={{ marginTop: 24 }} onClick={() => router.back()}>
        Voltar
      </button>
    </div>
  );
}
