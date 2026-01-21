import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function AttackCharts({ attackCounter }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/history").then((res) => {
      setData(
        res.data.map((h, i) => ({
          name: `${h.attackType} #${i + 1}`,
          time: h.time,
        }))
      );
    });
  }, [attackCounter]);

  if (!data.length) {
    return <p style={{ color: "#666" }}>No attack data yet.</p>;
  }

  return (
    <div className="card">
      <h2>📊 Attack Execution Time</h2>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Bar dataKey="time" fill="#ff0055" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
