import HashGenerator from "../components/HashGenerator";
import Layout from "../components/Layout";

export default function HashPage() {
  return (
    <Layout>
      <div className="page-container">
        <h1 style={{ fontSize: '32px', marginBottom: '8px', color: '#fff' }}>Hash Generation</h1>
        <p style={{ color: '#888', marginBottom: '32px' }}>Convert plain-text to cryptographic hash functions.</p>
        <HashGenerator />
      </div>
    </Layout>
  );
}
