import { ArrowLeft, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Explanation() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        minHeight: "100vh",
        padding: "80px 20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: "960px",
          width: "100%",
          padding: "48px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#ff0055",
              fontFamily: "monospace",
              fontSize: "13px",
              marginBottom: "10px",
            }}
          >
            <BookOpen size={16} />
            DOCUMENTATION
          </div>

          <h1
            style={{
              fontSize: "28px",
              fontWeight: "600",
              color: "#fff",
              marginBottom: "12px",
            }}
          >
            What Is Happening in This Lab?
          </h1>

          <p
            style={{
              fontSize: "15px",
              lineHeight: "1.8",
              color: "#ccc",
              maxWidth: "820px",
            }}
          >
            This laboratory simulates a controlled password cracking environment
            using <b>Hashcat</b>. Each module mirrors a real-world phase of a
            password attack pipeline, helping learners understand how weak
            passwords are exploited and how defenders analyze them.
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.06)",
            margin: "32px 0",
          }}
        />

        {/* Flow Sections */}
        <div style={{ display: "grid", gap: "18px" }}>
          {[
            [
              "Hash Generator",
              "Converts user passwords into cryptographic hashes to simulate stored credentials.",
            ],
            [
              "Rule Designer",
              "Applies intelligent mutation rules to expand the password search space.",
            ],
            [
              "Attack Engine & Dictionaries",
              "Executes Hashcat using standard or custom dictionaries (e.g., rockyou.txt) with selected algorithms.",
            ],
            [
              "Real-Time Visualization",
              "Dynamic charts and heatmaps that track success rates, rule efficiency, and vulnerability hotspots live.",
            ],
            [
              "Rule Intelligence",
              "Statistical analysis identifying the most effective mutation patterns for optimized cracking.",
            ],
            [
              "Guided Reporting",
              "Generates downloadable, detailed reports of all attack sessions for documentation and analysis.",
            ],
          ].map(([title, desc], i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: "#ff0055", marginTop: "2px" }}>➜</span>
              <div>
                <div
                  style={{
                    fontWeight: "600",
                    color: "#fff",
                    marginBottom: "4px",
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#bbb",
                    lineHeight: "1.6",
                  }}
                >
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Warning Box */}
        <div
          style={{
            marginTop: "36px",
            padding: "14px 18px",
            borderRadius: "8px",
            background: "rgba(255,0,85,0.08)",
            borderLeft: "4px solid #ff0055",
            fontSize: "13px",
            color: "#ddd",
          }}
        >
          ⚠ All passwords used are synthetic. This system is intended strictly
          for educational, ethical hacking, and defensive security analysis.
        </div>

        {/* Back Button */}
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <button
            onClick={() => navigate("/")}
            className="btn-outline"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          <span
            style={{
              fontSize: "12px",
              color: "#666",
              fontFamily: "monospace",
            }}
          >
            Project 24 · Security Analysis Lab
          </span>
        </div>
      </div>
    </section>
  );
}
