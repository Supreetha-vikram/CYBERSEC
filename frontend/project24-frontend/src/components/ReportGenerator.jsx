import { FileText, Download } from "lucide-react";
import api from "../services/api";

export default function ReportGenerator() {

  const downloadReport = async () => {
    try {
      const res = await api.get("/results");
      const data = res.data || [];
      
      let content = "PROJECT 24 - ATTACK REPORT\n";
      content += "================================\n";
      content += `Generated: ${new Date().toLocaleString()}\n\n`;
      
      if (data.length === 0) {
        content += "No attack history found.\n";
      } else {
        data.forEach((entry, i) => {
            const rules = entry.rules ? Object.keys(entry.rules).filter(k => entry.rules[k]).join(", ") : "None";
            const outcome = entry.password ? `SUCCESS (Password: ${entry.password})` : "FAILED";
            
            content += `[ATTACK #${i+1}]\n`;
            content += `Type: ${entry.attackType || "Unknown"}\n`;
            content += `Rules Used: ${rules}\n`;
            content += `Time Taken: ${entry.time}s\n`;
            content += `Result: ${outcome}\n`;
            content += "--------------------------------\n";
        });
      }

      // Create blob and download
      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attack_report_${Date.now()}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error("Failed to generate report", err);
      alert("Failed to generate report. Backend might be unreachable.");
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <FileText size={24} color="#ccc" />
        <div>
           <h3 style={{ fontSize: '15px', color: '#fff', margin: '0 0 4px 0' }}>Guided Report Generator</h3>
           <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Detailed client-side breakdown of all attack sessions.</p>
        </div>
      </div>

      <button onClick={downloadReport} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
        <Download size={16} /> Download Report
      </button>
    </div>
  );
}
