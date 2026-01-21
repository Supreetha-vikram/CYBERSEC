import { useEffect, useState } from "react";
import TerminalTyping from "./TerminalTyping";
import api from "../services/api";
import { Terminal } from "lucide-react";

export default function ResultsViewer({ attackCounter }) {
  const [output, setOutput] = useState("");

  useEffect(() => {
    try {
        api.get("/results").then((res) => {
          if (!res.data.length) {
            setOutput("[+] No hashes cracked\n");
            return;
          }
          const r = res.data[res.data.length - 1];
          const rules = Object.entries(r.rules || {}).filter(([_, v]) => v).map(([k]) => k).join(", ") || "none";
          
          if (r.password) {
              setOutput(`
[+] Hashcat v6.2.6
[*] Attack Type: ${r.attackType}
[*] Rules: ${rules}
[✓] PASSWORD FOUND!
Plaintext: ${r.password}
Time: ${r.time}s
[+] Session complete
`);
          } else {
              setOutput(`
[+] Hashcat v6.2.6
[*] Attack Type: ${r.attackType}
[*] Rules: ${rules}
[!] PASSWORD NOT CRACKED
Status: Exotic Exhausted
Time: ${r.time}s
[+] Session complete
`);
          }
        });
    } catch {
        setOutput("[!] Connection failed. Running in visual mode.");
    }
  }, [attackCounter]);

  return (
    <div className="glass-panel" style={{ padding: '24px', marginTop: '30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#ff0055', fontSize: '12px', fontFamily: 'monospace', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
        <Terminal size={14} /> Live Terminal Output
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.6', color: '#ccc' }}>
        <TerminalTyping text={output || "Waiting for execution..."} speed={25} />
      </div>
    </div>
  );
}
