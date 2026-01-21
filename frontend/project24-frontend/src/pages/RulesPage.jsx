import RuleDesigner from "../components/RuleDesigner";
import Layout from "../components/Layout";

export default function RulesPage() {
  return (
    <Layout>
      <div className="page-container">
        <h1 style={{ fontSize: '32px', marginBottom: '8px', color: '#fff' }}>Rule Engine</h1>
        <p style={{ color: '#888', marginBottom: '32px' }}>Define mutation patterns for hybrid attacks.</p>
        <RuleDesigner />
      </div>
    </Layout>
  );
}
