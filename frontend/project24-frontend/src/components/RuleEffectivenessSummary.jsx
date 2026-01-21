import { useEffect, useState } from "react";
import api from "../services/api";
import { Scale, AlertTriangle, CheckCircle } from "lucide-react";

export default function RuleEffectivenessSummary() {
  const [stats, setStats] = useState({ top: [], bottom: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/results")
      .then((res) => {
        // Aggregate rule stats
        const ruleCounts = {};
        
        // Mocking some data if empty for visualization or processing real data
        const data = res.data || [];
        
        data.forEach(entry => {
          // Assuming entry.rules is an object like { ruleName: true/false } or list of strings
          // Based on ResultsViewer: const rules = Object.entries(r.rules || {}).filter(([_, v]) => v).map(([k]) => k)
          if (entry.rules) {
            Object.entries(entry.rules).forEach(([rule, used]) => {
              if (used) {
                // If the password was found (outcome success), we count it as effective
                // Assuming entry.password exists means success
                const isSuccess = !!entry.password;
                 if (!ruleCounts[rule]) ruleCounts[rule] = { success: 0, total: 0 };
                 ruleCounts[rule].total += 1;
                 if (isSuccess) ruleCounts[rule].success += 1;
              }
            });
          }
        });

        // Convert to array
        const sortedRules = Object.entries(ruleCounts).map(([name, stat]) => ({
          name,
          ...stat,
          rate: stat.total > 0 ? (stat.success / stat.total) : 0
        })).sort((a, b) => b.success - a.success); // Sort by raw success count for "Effectiveness"

        setStats({
          top: sortedRules.slice(0, 5),
          bottom: sortedRules.slice(-5).reverse() // Least effective
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (stats.top.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: '24px', marginTop: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Scale size={20} color="#ff0055" />
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', margin: 0 }}>Rule Effectiveness Summary</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* Most Effective */}
        <div>
          <h4 style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={12} color="#4caf50" /> Most Effective Mutations
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stats.top.map((rule, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                 <span style={{ color: '#ccc', fontSize: '13px', fontFamily: 'monospace' }}>{rule.name}</span>
                 <span style={{ color: '#4caf50', fontSize: '13px', fontWeight: '600' }}>{rule.success} cracks</span>
              </div>
            ))}
          </div>
        </div>

        {/* Least Effective */}
        <div>
          <h4 style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={12} color="#ff9800" /> Least Effective
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
             {stats.bottom.map((rule, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                 <span style={{ color: '#ccc', fontSize: '13px', fontFamily: 'monospace' }}>{rule.name}</span>
                 <span style={{ color: '#888', fontSize: '13px' }}>{rule.success} cracks</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
