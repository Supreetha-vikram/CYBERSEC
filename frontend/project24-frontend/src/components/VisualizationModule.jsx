import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function VisualizationModule() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data similar to RuleEffectivenessSummary
    api.get("/results")
      .then((res) => {
        setData(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch results for visualization", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: '#888' }}>Loading Visualizations...</div>;
  if (!data || data.length === 0) return null;

  // --- Process Data ---

  // 1. Success Rate vs Rule Set
  // We'll treat each unique set of enabled rules as a "Rule Set" or break down by individual rule keys if they are mix-and-match.
  // Given the previous component logic, `entry.rules` is { ruleName: boolean }.
  // Let's calculate success rate per individual rule key for clarity.
  const ruleStats = {}; // { ruleName: { success: 0, total: 0 } }

  // 2. Vulnerable Words (Heatmap)
  const passwordCounts = {}; // { password: count }

  data.forEach((entry) => {
    const isSuccess = !!entry.password;
    
    // Process Rules
    if (entry.rules) {
        Object.entries(entry.rules).forEach(([ruleName, enabled]) => {
            if (enabled) {
                if (!ruleStats[ruleName]) ruleStats[ruleName] = { success: 0, total: 0 };
                ruleStats[ruleName].total += 1;
                if (isSuccess) ruleStats[ruleName].success += 1;
            }
        });
    }

    // Process Password
    if (isSuccess && entry.password) {
        const pwd = entry.password;
        passwordCounts[pwd] = (passwordCounts[pwd] || 0) + 1;
    }
  });

  // Prepare Chart Data
  const rules = Object.keys(ruleStats);
  const successRates = rules.map(r => {
      const s = ruleStats[r];
      return s.total > 0 ? ((s.success / s.total) * 100).toFixed(1) : 0;
  });

  const chartData = {
    labels: rules,
    datasets: [
      {
        label: "Success Rate (%)",
        data: successRates,
        backgroundColor: "rgba(255, 0, 85, 0.6)",
        borderColor: "#ff0055",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#ccc" } },
      title: { display: true, text: "Success Rate by Rule Application", color: "#fff" },
    },
    scales: {
        y: { ticks: { color: "#888" }, grid: { color: "rgba(255,255,255,0.1)" } },
        x: { ticks: { color: "#888" }, grid: { display: false } }
    }
  };

  // Prepare Heatmap Data (Top 50 words)
  const sortedPasswords = Object.entries(passwordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);
  
  const maxCount = sortedPasswords.length > 0 ? sortedPasswords[0][1] : 1;

  // Prepare Summary
  // Find rule with max success rate
  let bestRule = null;
  let maxRate = -1;
  rules.forEach((r, i) => {
      const rate = parseFloat(successRates[i]);
      if (rate > maxRate) {
          maxRate = rate;
          bestRule = r;
      }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '40px' }}>
      
      {/* 1. Charts & Summary Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
            <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Text Summary */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', color: '#fff', margin: 0 }}>Effectiveness Insights</h3>
            <div style={{ fontSize: '14px', color: '#aaa', lineHeight: '1.6' }}>
                <p>
                    Comparing the mutation rules applied across {data.length} sessions, 
                    <strong style={{ color: '#ff0055' }}> {bestRule || "N/A"} </strong> 
                    emerges as the most reliable, achieving a success rate of 
                    <strong style={{ color: '#fff' }}> {maxRate}%</strong>.
                </p>
                <p>
                   Rules with higher complexity often yield better results but require significantly more processing time. 
                   Currently, {rules.length} distinct rule configurations have been tested.
                </p>
            </div>
            {bestRule && (
                <div style={{ marginTop: 'auto', padding: '12px', background: 'rgba(255, 0, 85, 0.1)', borderLeft: '3px solid #ff0055', borderRadius: '4px' }}>
                    <span style={{ fontSize: '12px', color: '#ff0055', fontWeight: 'bold' }}>RECOMMENDATION</span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#ddd' }}>
                        Prioritize <strong>{bestRule}</strong> for initial quick-scan attacks.
                    </p>
                </div>
            )}
        </div>
      </div>

      {/* 2. Vulnerable Words Heatmap */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '20px' }}>Vulnerable Password Heatmap</h3>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>
            Frequency analysis of successfully cracked passwords. Higher intensity indicates higher recurrence.
        </p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {sortedPasswords.map(([word, count]) => {
                const intensity = (count / maxCount); 
                // Color from dark red to bright red/pink
                // Low intensity: rgba(255, 0, 85, 0.1)
                // High intensity: rgba(255, 0, 85, 1.0)
                const bg = `rgba(255, 0, 85, ${0.1 + (intensity * 0.9)})`;
                const color = intensity > 0.5 ? '#fff' : '#ffccd5';
                
                return (
                    <div 
                        key={word} 
                        style={{ 
                            background: bg, 
                            color: color,
                            padding: '6px 12px', 
                            borderRadius: '4px', 
                            fontSize: '12px',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                        title={`${count} occurrences`}
                    >
                        {word}
                    </div>
                );
            })}
            {sortedPasswords.length === 0 && <span style={{ color: '#666' }}>No cracked passwords recorded yet.</span>}
        </div>
      </div>

    </div>
  );
}
