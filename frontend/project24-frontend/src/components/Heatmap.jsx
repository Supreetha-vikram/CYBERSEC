import HeatMap from "react-heatmap-grid";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function AttackHeatmap({ attackCounter }) {
  const attackTypes = ["MD5", "SHA-1", "SHA-256", "NTLM"];
  const ruleLevels = ["Few Rules", "Medium Rules", "Many Rules"];
  const [data, setData] = useState([]);

  const ruleBucket = (count) => {
    if (count <= 1) return 0;
    if (count <= 3) return 1;
    return 2;
  };

  useEffect(() => {
    api.get("/history").then((res) => {
      const matrix = attackTypes.map((atk) =>
        ruleLevels.map((_, idx) => {
          const rows = res.data.filter(
            (r) => r.attackType === atk && ruleBucket(r.ruleCount ?? 0) === idx
          );

          if (!rows.length) return 0;

          const avg =
            rows.reduce((s, r) => s + Number(r.time), 0) / rows.length;

          return Number(avg.toFixed(2));
        })
      );

      setData(matrix);
    });
  }, [attackCounter]);

  const maxValue = Math.max(...data.flat(), 1);

  return (
    <div className="glass-panel" style={{ padding: "24px" }}>
      <h3 style={{ marginBottom: "12px" }}>🔥 Rule Effectiveness Heatmap</h3>

      <HeatMap
        data={data}
        xLabels={ruleLevels}
        yLabels={attackTypes}
        cellRender={(v) => (v ? `${v}s` : "")}
        cellStyle={(_, v) => ({
          background: `rgba(255,0,85,${v / maxValue})`,
          color: "#fff",
          fontSize: "13px",
          borderRadius: "4px",
        })}
      />
    </div>
  );
}
