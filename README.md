# 🔐 CYBERSEC – Cyber Password Analysis Lab
**Authorized · Educational · Controlled Environment**



## 📌 Overview

This project is a full-stack cybersecurity lab designed to demonstrate **how password cracking works internally** using **Hashcat**, rule-based mutations, and real-time visual analytics.

The lab allows students to:
- Generate password hashes
- Apply predefined mutation rules
- Execute multiple attack algorithms
- Analyze cracking performance using graphs and heatmaps

⚠️ This project is strictly for **educational and defensive security learning**.



## 🧩 System Architecture


- Frontend runs on the host machine (Windows)
- Backend runs on Kali Linux
- Communication via HTTP (Axios)
- Hashcat executes attacks locally on Kali

---

## 🖥️ Frontend

### 🔹 Technology Stack
- React (Vite)
- Axios
- Recharts
- react-heatmap-grid
- Lucide Icons
- Custom Matrix-style UI

### 🔹 Features
- Hash Generator (SHA-256)
- Predefined Rule Engine
- Attack Algorithm Selector (MD5, SHA-1, SHA-256, NTLM)
- Live Execution Console
- Attack Time Comparison Charts
- Rule Effectiveness Heatmaps

### 🔹 Run Frontend and Backend
```bash
cd project24-frontend
npm install
npm run dev

Backend(Kali linux)
cd backend
node server.js
