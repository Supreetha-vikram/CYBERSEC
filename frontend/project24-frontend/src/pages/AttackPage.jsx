import { useState } from "react";
import HashcatRunner from "../components/HashcatRunner";
import AttackSelector from "../components/AttackSelector";
import Layout from "../components/Layout";
import ResultsViewer from "../components/ResultsViewer";

export default function AttackPage() {
    const [attackType, setAttackType] = useState("SHA-256");
    const [customDict, setCustomDict] = useState("");
    const [attackCounter, setAttackCounter] = useState(0);

  return (
    <Layout>
        <div className="page-container">
            <h1 style={{ fontSize: '32px', marginBottom: '8px', color: '#fff' }}>Attack Vector</h1>
            <p style={{ color: '#888', marginBottom: '32px' }}>Configure and execute targeted brute-force attacks.</p>

            <AttackSelector attackType={attackType} setAttackType={setAttackType} customDict={customDict} setCustomDict={setCustomDict} />
            <HashcatRunner attackType={attackType} customDict={customDict} onAttackComplete={() => setAttackCounter(c => c + 1)} />
            
            <ResultsViewer attackCounter={attackCounter} />
        </div>
    </Layout>
  );
}
