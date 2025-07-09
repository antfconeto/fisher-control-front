import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface SpawningSuccessChartProps {
  totalEggs: number;
  fry: number;
  mortality: number;
}

export default function SpawningSuccessChart({
  totalEggs,
  fry,
  mortality,
}: SpawningSuccessChartProps) {
  const data = [
    {
      name: "Ovos",
      value: totalEggs,
      fill: "#8884d8",
    },
    {
      name: "Larvas",
      value: fry,
      fill: "#82ca9d",
    },
    {
      name: "Mortalidade",
      value: mortality,
      fill: "#ff8042",
    },
  ];

  return (
    <div style={{ margin: "20px 0" }}>
      <h4>Análise de Sucesso</h4>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
