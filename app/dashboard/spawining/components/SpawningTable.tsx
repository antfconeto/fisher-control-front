import React from "react";

interface SpawningData {
  id: string;
  specie: string;
  date: string;
  tank: string;
  status: string;
  totalEggs: number;
  notes?: string;
}

interface SpawningTableProps {
  spawns: SpawningData[];
  onDetails: (id: string) => void;
}

export default function SpawningTable({
  spawns,
  onDetails,
}: SpawningTableProps) {
  return (
    <table
      style={{
        width: "100%",
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #0001",
        marginTop: 0,
        borderCollapse: "separate",
        borderSpacing: 0,
        fontSize: 15,
      }}
    >
      <thead>
        <tr style={{ background: "#e3f2fd" }}>
          <th style={{ padding: 12 }}>ID</th>
          <th style={{ padding: 12 }}>Espécie</th>
          <th style={{ padding: 12 }}>Data</th>
          <th style={{ padding: 12 }}>Tanque</th>
          <th style={{ padding: 12 }}>Total Ovos</th>
          <th style={{ padding: 12 }}>Status</th>
          <th style={{ padding: 12 }}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {spawns.map((spawn, idx) => (
          <tr
            key={spawn.id}
            style={{
              background: idx % 2 === 0 ? "#f7fafc" : "#fff",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#e3f2fd")}
            onMouseOut={(e) =>
              (e.currentTarget.style.background =
                idx % 2 === 0 ? "#f7fafc" : "#fff")
            }
          >
            <td style={{ padding: 12 }}>{spawn.id}</td>
            <td style={{ padding: 12 }}>{spawn.specie}</td>
            <td style={{ padding: 12 }}>{spawn.date}</td>
            <td style={{ padding: 12 }}>{spawn.tank}</td>
            <td style={{ padding: 12 }}>
              {(spawn.totalEggs / 1000).toFixed(0)}k
            </td>
            <td style={{ padding: 12 }}>
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "500",
                  backgroundColor:
                    spawn.status === "Concluída"
                      ? "#d4edda"
                      : spawn.status === "Em Andamento"
                      ? "#fff3cd"
                      : "#f8d7da",
                  color:
                    spawn.status === "Concluída"
                      ? "#155724"
                      : spawn.status === "Em Andamento"
                      ? "#856404"
                      : "#721c24",
                }}
              >
                {spawn.status}
              </span>
            </td>
            <td style={{ padding: 12 }}>
              <button
                style={{
                  background: "#1976d2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 18px",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onClick={() => onDetails(spawn.id)}
              >
                Ver Detalhes
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
