import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HashPage from "./pages/HashPage";
import RulesPage from "./pages/RulesPage";
import AttackPage from "./pages/AttackPage";
import AnalysisPage from "./pages/AnalysisPage";
import Explanation from "./components/Explanation";

import "./App.css";

export default function App() {
  return (
    <Router>
      {/* MatrixBackground is now handled in the Layout component used by pages */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hash" element={<HashPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/attack" element={<AttackPage />} />
          <Route path="/docs" element={<Explanation />} />

          <Route path="/analysis" element={<AnalysisPage />} />
        </Routes>
      </div>
    </Router>
  );
}
