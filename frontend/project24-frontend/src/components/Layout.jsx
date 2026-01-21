import { Link, useLocation } from "react-router-dom";
import MatrixBackground from "../components/MatrixBackground";
import { Skull } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Overview" },
    { path: "/hash", label: "Generators" },
    { path: "/rules", label: "Rules Engine" },
    { path: "/attack", label: "Attack Vector" },
    { path: "/analysis", label: "Analytics" },
  ];

  return (
    <div className="layout-root">
      <MatrixBackground />
      
      {/* ===== FLOATING NAVBAR (VANILLA CSS) ===== */}
      <nav className="navbar-fixed">
        <div className="navbar-pill">
            
            {/* Logo */}
            <Link to="/" className="nav-logo">
                <div className="nav-icon" style={{ background: '#ff0055', color: 'white' }}>
                    <Skull size={18} />
                </div>
                <span>CYBERSEC</span>
            </Link>

            {/* Links */}
            <div className="nav-links">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            className={`nav-link ${isActive ? 'active' : ''}`}
                            style={isActive ? { color: '#000', background: '#fff' } : {}}
                        >
                            {item.label}
                        </Link>
                    )
                })}
            </div>

            {/* Status Indicator */}
            <div style={{ marginLeft: '12px', paddingLeft: '20px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff0055', fontSize: '11px', fontFamily: 'monospace' }}>
                    <span style={{ width: '6px', height: '6px', background: '#ff0055', borderRadius: '50%' }}></span>
                    ONLINE
                </div>
            </div>
        </div>
      </nav>

      {/* ===== MAIN CONTENT AREA ===== */}
      <div className="container">
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
