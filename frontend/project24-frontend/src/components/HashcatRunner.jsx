import { useState } from "react";
import { Terminal } from "lucide-react";
import api from "../services/api";

export default function HashcatRunner({ attackType, customDict, onAttackComplete }) {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([]);

  const startAttack = async () => {
    if (!attackType) {
      setLogs(["ERROR: No attack type selected"]);
      return;
    }

    setRunning(true);
    setProgress(5);
      setLogs([
        "[+] Initializing Hashcat engine",
        `[*] Attack Algorithm: ${attackType}`,
        customDict ? `[*] Dictionary: ${customDict}` : "[*] Dictionary: Default (rockyou.txt)",
        "[*] Allocating resources",
        "[*] Connecting to Kali backend",
      ]);

    try {
      setProgress(30);

      const res = await api.post("/run-hashcat", {
        attackType,
        dictionary: customDict || null
      });

      setProgress(70);
      setLogs((l) => [
        ...l,
        "[*] Executing dictionary + rule attack",
        `[+] Backend Response: ${res.data.message}`,
      ]);

      setProgress(100);
      setLogs((l) => [
        ...l,
        `[✓] SESSION COMPLETE`,
        `Time Taken: ${res.data.time}s`,
      ]);

      setRunning(false);
      onAttackComplete?.();
    } catch (err) {
      console.error(err);
      setLogs((l) => [...l, "[!] ERROR: Hashcat execution failed"]);
      setRunning(false);
      setProgress(0);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Terminal size={18} color="#888" /> Execution Console
        </h3>

        <button
          onClick={startAttack}
          disabled={running}
          className="btn-primary"
          style={{
            opacity: running ? 0.6 : 1,
            cursor: running ? "not-allowed" : "pointer",
          }}
        >
          {running ? "Running..." : "Execute Attack"}
        </button>
      </div>

      {/* Progress */}
      <div
        style={{
          height: "8px",
          background: "#222",
          borderRadius: "4px",
          overflow: "hidden",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "#ff0055",
            width: `${progress}%`,
            boxShadow: "0 0 10px #ff0055",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Logs */}
      <div
        style={{
          background: "rgba(0,0,0,0.85)",
          borderRadius: "8px",
          padding: "16px",
          fontFamily: "monospace",
          fontSize: "12px",
          height: "220px",
          overflowY: "auto",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#ccc",
        }}
      >
        {logs.length === 0 ? (
          <span style={{ color: "#666" }}>Ready to start...</span>
        ) : (
          logs.map((log, i) => (
            <div key={i} style={{ marginBottom: "4px" }}>
              <span style={{ color: "#ff0055", marginRight: "8px" }}>➜</span>
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
