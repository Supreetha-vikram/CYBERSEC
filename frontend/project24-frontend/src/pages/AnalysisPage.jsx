import { useState, useEffect } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import RuleEffectivenessSummary from "../components/RuleEffectivenessSummary";
import VisualizationModule from "../components/VisualizationModule";
import ReportGenerator from "../components/ReportGenerator";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { motion } from "framer-motion";
import { Activity, Clock, ShieldCheck, Server } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

function StatCard({ icon, label, value, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay }}
      className="glass-panel"
      style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '140px', justifyContent: 'space-between' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ color: '#888', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <div style={{ color: '#ff0055', opacity: 0.8 }}>{icon}</div>
      </div>
      <div>
        <div style={{ fontSize: '32px', fontWeight: '700', color: '#fff', letterSpacing: '-0.02em' }}>{value}</div>
      </div>
    </motion.div>
  );
}

export default function AnalysisPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch Data
    api.get("/results")
      .then((res) => {
        setData(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch analytics data", err);
        setLoading(false);
      });
  }, []);

  // 2. Compute Metrics
  // Default values
  let hashesCracked = 0;
  let totalTime = 0;
  let successCount = 0;
  const algoCounts = { "SHA-256": 0, "MD5": 0, "Hybrid": 0, "Other": 0 };
  const timeSeries = []; // [time1, time2, ...]

  if (!loading && data.length > 0) {
      data.forEach(entry => {
          // Hashes Cracked (using success as proxy if specific count unavailable)
          if (entry.password) {
              hashesCracked++;
              successCount++;
          }
           
          // Time
          const t = parseFloat(entry.time) || 0;
          totalTime += t;
          timeSeries.push(t);

          // Algo
          const type = entry.attackType || "Other";
          if (algoCounts[type] !== undefined) algoCounts[type]++;
          else algoCounts["Other"]++;
      });
  }

  const avgTime = data.length > 0 ? (totalTime / data.length).toFixed(2) : "0";
  const successRate = data.length > 0 ? ((successCount / data.length) * 100).toFixed(1) : "0";

  // 3. Update Chart Data
  const lineData = {
    labels: data.map((_, i) => `#${i + 1}`),
    datasets: [{
        label: "Time (s)",
        data: timeSeries,
        borderColor: "#ff0055",
        backgroundColor: "rgba(255, 0, 85, 0.1)",
        tension: 0.4,
        fill: true,
    }],
  };

  const doughnutData = {
    labels: ["SHA-256", "MD5", "Hybrid", "Other"],
    datasets: [{
        data: [algoCounts["SHA-256"], algoCounts["MD5"], algoCounts["Hybrid"], algoCounts["Other"]],
        backgroundColor: ["#ff0055", "#b3003b", "#ff80ab", "#1a1a1a"],
        borderColor: "#000",
        borderWidth: 0,
    }],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: 'bottom', labels: { color: '#888' } } },
    scales: { x: { display: false }, y: { display: false } }
  };

  const lineOptions = {
    responsive: true,
    plugins: { 
        legend: { position: 'top', labels: { color: '#ccc' } },
        title: { display: true, text: 'Attack Duration History', color: '#fff' }
    },
    scales: { 
        x: { 
            display: true, 
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#888' }
        }, 
        y: { 
            display: true, 
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#888' },
            beginAtZero: true
        } 
    }
  };

  return (
    <Layout>
      <div className="page-container">
        
        <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0' }}>Analytics Overview</h1>
            <p style={{ color: '#888', margin: 0 }}>Real-time metrics and vulnerability assessments.</p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <StatCard icon={<Activity size={20} />} label="Hashes Cracked" value={hashesCracked} delay={0} />
          <StatCard icon={<Clock size={20} />} label="Avg Time/Hash" value={`${avgTime}s`} delay={0.1} />
          <StatCard icon={<ShieldCheck size={20} />} label="Success Rate" value={`${successRate}%`} delay={0.2} />
        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            className="glass-panel" 
            style={{ padding: '24px' }}
          >
            <h3 style={{ fontSize: '14px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px' }}>Complexity / Time Analysis</h3>
            {data.length > 0 ? (
                <Line data={lineData} options={lineOptions} />
            ) : (
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '13px' }}>
                    No attack history available. Run an attack to see data.
                </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            className="glass-panel" 
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <h3 style={{ fontSize: '14px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px' }}>Algo Distribution</h3>
            <div style={{ width: '200px', height: '200px' }}>
                <Doughnut data={doughnutData} options={{...options, scales:{}}} />
            </div>
          </motion.div>
        </div>

        <RuleEffectivenessSummary />
        <VisualizationModule />
        <ReportGenerator />
      </div>
    </Layout>
  );
}
