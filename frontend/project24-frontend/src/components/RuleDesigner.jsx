import { useState } from "react";
import { Settings, Save, Zap } from "lucide-react";
import api from "../services/api";

const RULES = [
  {
    label: "Capitalize First Letter",
    rule: "c",
    desc: "Adds uppercase to first character",
  },
  { label: "Lowercase All", rule: "l", desc: "Normalizes all characters" },
  { label: "Append Digits (123)", rule: "$1$2$3", desc: "Adds numeric suffix" },
  {
    label: "Append Year (2025)",
    rule: "$2$0$2$4",
    desc: "Common real-world pattern",
  },
  { label: "Prepend Digit (1)", rule: "^1", desc: "Adds numeric prefix" },
  { label: "Reverse Word", rule: "r", desc: "Reverses password structure" },
  { label: "Leetspeak", rule: "sa@ se3 so0", desc: "a→@ e→3 o→0" },
  { label: "Duplicate Word", rule: "d", desc: "Repeats password twice" },
  { label: "Toggle Case", rule: "t", desc: "Flips character casing" },
];

export default function RuleDesigner() {
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState("");

  const toggle = (rule) => {
    setSelected((prev) =>
      prev.includes(rule) ? prev.filter((r) => r !== rule) : [...prev, rule]
    );
  };

  const saveRules = async () => {
    if (!selected.length) {
      setStatus("⚠ Select at least one rule");
      return;
    }
    await api.post("/api/save-rules", { rules: selected });
    setStatus("✅ Rules saved in Kali Linux");
  };

  return (
    <div className="glass-panel rule-engine">
      {/* Header */}
      <div className="panel-header">
        <div className="feature-icon">
          <Settings size={20} />
        </div>
        <div>
          <h2 className="panel-title">Rule Engine</h2>
          <p className="panel-desc">Mutation strategies for attack expansion</p>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="rule-grid">
        {RULES.map((r, i) => (
          <div
            key={i}
            className={`rule-card ${selected.includes(r.rule) ? "active" : ""}`}
            onClick={() => toggle(r.rule)}
          >
            <div className="rule-left">
              <Zap size={16} />
              <div>
                <div className="rule-title">{r.label}</div>
                <div className="rule-desc">{r.desc}</div>
              </div>
            </div>
            <div className="rule-check">
              <div className="check-dot" />
            </div>
          </div>
        ))}
      </div>

      {/* Save */}
      <button className="btn-primary save-btn" onClick={saveRules}>
        <Save size={16} /> Save Rules to Kali
      </button>

      {status && <div className="rule-status">{status}</div>}
    </div>
  );
}
