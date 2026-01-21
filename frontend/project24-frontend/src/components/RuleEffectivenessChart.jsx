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

export default function RuleEffectivenessChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/history").then((res) => {
      const buckets = {
        "Few Rules": [],
        "Medium Rules": [],
        "Many Rules": [],
      };

      res.data.forEach((h) => {
        if (h.ruleCount <= 1) buckets["Few Rules"].push(h.time);
        else if (h.ruleCount <= 3) buckets["Medium Rules"].push(h.time);
        else buckets["Many Rules"].push(h.time);
      });

      const chartData = Object.entries(buckets).map(([label, times]) => ({
        ruleLevel: label,
        avgTime: times.length
          ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2)
          : 0,
      }));

      setData(chartData);
    });
  }, []);

  return (
    <div className="glass-panel" style={{ height: "300px", padding: "20px" }}>
      <h3 style={{ marginBottom: "12px" }}>
        🧠 Rule Complexity vs Cracking Time
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="ruleLevel" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Bar dataKey="avgTime" fill="#ff0055" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
