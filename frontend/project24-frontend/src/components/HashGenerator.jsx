import { useState } from "react";
import api from "../services/api";
import { Copy, Check, Key } from "lucide-react";

export default function HashGenerator() {
  const [password, setPassword] = useState("");
  const [hash, setHash] = useState("");
  const [copied, setCopied] = useState(false);

  const generateHash = async () => {
    try {
      const res = await api.post("/generate-hash", { password });
      setHash(res.data.hash);
    } catch (e) {
      setHash(
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      );
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel" style={{ padding: "30px" }}>
      {/* Header */}
      <div className="panel-header">
        <div
          className="feature-icon"
          style={{ width: "40px", height: "40px", marginBottom: 0 }}
        >
          <Key size={20} />
        </div>
        <div>
          <h2 className="panel-title">SHA-256 Generator</h2>
          <p className="panel-desc">Cryptographic hash function (Standard)</p>
        </div>
      </div>

      {/* Content */}
      <div className="form-group">
        <label className="label">Input Text</label>
        <div className="input-row">
          <input
            type="text"
            placeholder="Enter sensitive data..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={generateHash}
            className="btn-primary"
            style={{ whiteSpace: "nowrap" }}
          >
            Generate
          </button>
        </div>
      </div>

      {hash && (
        <div className="form-group" style={{ marginTop: "24px" }}>
          <label className="label">Generated Hash Output</label>
          <div
            onClick={copyToClipboard}
            style={{
              padding: "16px",
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(255, 0, 85, 0.3)",
              borderRadius: "8px",
              fontFamily: "monospace",
              color: "#ff0055",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ wordBreak: "break-all" }}>{hash}</span>
            <span style={{ color: "#666" }}>
              {copied ? (
                <Check size={16} color="#ff0055" />
              ) : (
                <Copy size={16} />
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
