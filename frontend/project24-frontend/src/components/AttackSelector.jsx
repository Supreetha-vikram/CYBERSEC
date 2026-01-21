import { useState } from "react";
import { ShieldAlert, Zap, ChevronDown, Check } from "lucide-react";

function CustomDropdown({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === (value || ""))?.label || "Select Dictionary";

  return (
    <div style={{ position: "relative" }}>
      {/* Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          background: "rgba(255, 0, 85, 0.05)",
          border: `1px solid ${isOpen ? '#ff0055' : 'rgba(255, 0, 85, 0.3)'}`,
          color: "#ff0055",
          padding: "12px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.2s"
        }}
      >
        <span>{selectedLabel}</span>
        <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </div>

      {/* Options List */}
      {isOpen && (
        <div 
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            width: "100%",
            background: "rgba(26, 26, 26, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 0, 85, 0.2)",
            borderRadius: "8px",
            overflow: "hidden",
            zIndex: 100,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
          }}
        >
          {options.map((opt) => {
            const isSelected = (value || "") === opt.value;
            return (
              <div 
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "rgba(255, 0, 85, 0.1)";
                }}
                onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "transparent";
                }}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  color: isSelected ? "#fff" : "#ccc",
                  fontSize: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: isSelected ? "#ff0055" : "transparent",
                  transition: "all 0.2s"
                }}
              >
                {opt.label}
                {isSelected && <Check size={14} color="#fff" />}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Click outside closer could be added here, but simple toggle is fine for this task context */}
      {isOpen && (
        <div 
            onClick={() => setIsOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 40 }} 
        />
      )}
    </div>
  );
}

export default function AttackSelector({ attackType, setAttackType, customDict, setCustomDict }) {
  const attacks = [
    {
      id: "SHA-256",
      name: "Brute Force (SHA-256)",
      desc: "Exhaustive key search.",
    },
    {
      id: "MD5",
      name: "Rainbow Table (MD5)",
      desc: "Pre-computed hash chain lookup.",
    },
    {
      id: "Hybrid",
      name: "Hybrid Attack",
      desc: "Dictionary + Rules mutation.",
    },
  ];

  return (
    <div
      className="glass-panel"
      style={{ padding: "30px", marginBottom: "30px", position: "relative", zIndex: 50 }}
    >
      <div className="panel-header">
        <div
          className="feature-icon"
          style={{ width: "40px", height: "40px", marginBottom: 0 }}
        >
          <ShieldAlert size={20} />
        </div>
        <div>
          <h2 className="panel-title">Attack Configuration</h2>
          <p className="panel-desc">Select attack vector and algorithm</p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "24px"
        }}
      >
        {attacks.map((attack) => {
          const isActive = attackType === attack.id;
          return (
            <div
              key={attack.id}
              onClick={() => setAttackType(attack.id)}
              style={{
                padding: "16px",
                borderRadius: "12px",
                border: isActive
                  ? "1px solid #ff0055"
                  : "1px solid transparent",
                background: isActive
                  ? "rgba(255, 0, 85, 0.1)"
                  : "rgba(255, 255, 255, 0.05)",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: isActive ? "#ff0055" : "#ccc",
                  }}
                >
                  {attack.name}
                </span>
                {isActive && <Zap size={14} color="#ff0055" />}
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "#888",
                  margin: 0,
                  lineHeight: "1.4",
                }}
              >
                {attack.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "8px" }}>
        <label style={{ display: "block", color: "#888", fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}>
          Target Dictionary (Optional)
        </label>
        
        <CustomDropdown 
            value={customDict} 
            onChange={(val) => setCustomDict(val)} 
            options={[
                { value: "", label: "Default (rockyou.txt)" },
                { value: "common-passwords.txt", label: "common-passwords.txt" },
                { value: "english-words.txt", label: "english-words.txt" },
                { value: "custom-list-v1.txt", label: "custom-list-v1.txt" },
            ]}
        />
      </div>
    </div>
  );
}
