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

export default function LiveAttackChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/history");
      setData(
        res.data.map((h, i) => ({
          attack: `${h.attackType} #${i + 1}`,
          time: Number(h.time),
        }))
      );
    };

    fetchData(); // initial load

    const interval = setInterval(fetchData, 2000); // 🔁 every 2s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel" style={{ height: "320px", padding: "20px" }}>
      <h3 style={{ marginBottom: "10px" }}>📊 Live Attack Execution Time</h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="attack" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Bar dataKey="time" fill="#ff0055" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
