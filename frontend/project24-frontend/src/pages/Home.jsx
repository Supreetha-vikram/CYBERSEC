import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield,
  Lock,
  Cpu,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="hero-wrapper">
        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="hero-title"
        >
          Detection and
          <br />
          Response.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hero-subtitle"
        >
          Advanced cryptographic analysis platform designed for security
          professionals. Simulate attacks, analyze hash strength, and audit
          system vulnerabilities in real-time.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="btn-group"
        >
          <Link to="/hash" className="btn-primary">
            Start Analysis <ArrowRight size={16} />
          </Link>

          {/* ✅ FIXED ROUTE */}
          <Link to="/docs" className="btn-outline">
            View Documentation
          </Link>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="feature-grid"
        >
          <FeatureCard
            icon={<Lock size={24} />}
            title="Secure Hashing"
            desc="Industry standard algorithms including SHA-256, bcrypt, and Argon2."
          />
          <FeatureCard
            icon={<Cpu size={24} />}
            title="GPU Acceleration"
            desc="Optimized for CUDA and OpenCL parallel processing workloads."
          />
          <FeatureCard
            icon={<Shield size={24} />}
            title="Threat Intelligence"
            desc="Real-time analytics and vulnerability scoring for your infrastructure."
          />
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            marginTop: "100px",
            padding: "40px 0",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            color: "#666",
          }}
        >
          <div style={{ display: "flex", gap: "24px", marginBottom: "20px" }}>
            <a
              href="#"
              style={{ color: "#888", transition: "color 0.2s" }}
              className="hover:text-pink-500"
            >
              <Github size={20} />
            </a>
            <a
              href="#"
              style={{ color: "#888", transition: "color 0.2s" }}
              className="hover:text-pink-500"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              style={{ color: "#888", transition: "color 0.2s" }}
              className="hover:text-pink-500"
            >
              <Linkedin size={20} />
            </a>
          </div>

          <div
            style={{
              display: "flex",
              gap: "32px",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            <a href="#" style={{ color: "#888", textDecoration: "none" }}>
              Privacy Policy
            </a>
            <a href="#" style={{ color: "#888", textDecoration: "none" }}>
              Terms of Service
            </a>
            <a href="#" style={{ color: "#888", textDecoration: "none" }}>
              Contact Support
            </a>
          </div>

          <p style={{ fontSize: "13px", opacity: 0.6 }}>
            © 2024 CyberSec Intelligence Inc. All rights reserved.
          </p>
        </motion.footer>
      </div>
    </Layout>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-panel feature-card">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
    </div>
  );
}
