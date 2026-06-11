# 🛡️ CityShield AI – Smart City Threat Intelligence & Security Management System

## 📌 Overview

**CityShield AI** is an intelligent smart city security platform that integrates **Artificial Intelligence, Cybersecurity, Blockchain Technology, Smart Traffic Management, and Design & Analysis of Algorithms (DAA)** into a unified dashboard.

The system enables city administrators to monitor threats, analyze risks, optimize traffic routes, maintain tamper-proof records, and visualize algorithmic decision-making through an interactive web interface.

---

# 🎯 Objectives

* Detect and manage city-wide security threats.
* Monitor critical incidents in real time.
* Optimize traffic movement using graph algorithms.
* Store security logs using blockchain-inspired integrity verification.
* Demonstrate practical applications of Design and Analysis of Algorithms.
* Provide a centralized command center for smart city operations.

---

# ✨ Key Features

## 🔍 AI Monitoring

* Real-time surveillance monitoring.
* Threat severity assessment.
* Emergency response planning.
* Branch & Bound based resource planning.

## 🚨 Threat Analytics

* Threat classification and prioritization.
* Risk-based threat ranking.
* City zone exploration.
* Alert compression simulation.

## 🚦 Smart Traffic Management

* Route optimization between city zones.
* Traffic congestion analysis.
* Resource allocation for emergency response.
* Signal scheduling optimization.

## ⛓️ Blockchain Security Logs

* Immutable event records.
* Integrity verification.
* Hash-based record validation.
* Tamper detection.

## 👨‍💼 Admin Panel

* Manage threats.
* Manage traffic records.
* Monitor system status.
* Administrative controls.

## 📚 DAA Overview Module

* Complete algorithm summary.
* Complexity analysis.
* Visual screenshots of project modules.
* Real-world algorithm applications.

---

# 🧠 Algorithms Implemented

| Algorithm                  | Module           | Purpose                       | Time Complexity    |
| -------------------------- | ---------------- | ----------------------------- | ------------------ |
| Merge Sort                 | Threat Analytics | Risk Sorting                  | O(n log n)         |
| Breadth First Search (BFS) | Threat Analytics | Zone Exploration              | O(V + E)           |
| Priority Queue (Max Heap)  | Threat Analytics | Threat Prioritization         | O(log n)           |
| Huffman Coding             | Threat Analytics | Alert Compression             | O(n log n)         |
| Dijkstra Algorithm         | Smart Traffic    | Route Optimization            | O(E log V)         |
| Floyd-Warshall Algorithm   | Smart Traffic    | All-Pairs Shortest Path       | O(V³)              |
| Kruskal MST                | Smart Traffic    | Network Optimization          | O(E log E)         |
| Activity Selection         | Smart Traffic    | Traffic Signal Scheduling     | O(n log n)         |
| 0/1 Knapsack               | Smart Traffic    | Emergency Resource Allocation | O(nW)              |
| Branch & Bound             | AI Monitoring    | Emergency Planning            | Pruned Exponential |

---

# 🏗️ System Architecture

Frontend (Next.js + TypeScript)
│
▼
REST API (Express.js Backend)
│
┌──────┼──────┐
▼      ▼      ▼
Threats Traffic Blockchain
Module  Module   Module
│
▼
Algorithm Engine
(BFS, Dijkstra, MST,
Knapsack, Huffman,
Branch & Bound)

---

# 🛠️ Technology Stack

## Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* Recharts
* React Leaflet
* Framer Motion

## Backend

* Node.js
* Express.js
* REST APIs
* JSON-based Storage

## Algorithms & Security

* Graph Algorithms
* Greedy Algorithms
* Dynamic Programming
* Branch & Bound
* Blockchain Hash Verification

---

# 📂 Project Structure

```text
EL-CITYSHIELD-AI/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   │   └── assets/
│   │       ├── screenshots/
│   │       └── icons/
│   └── services/
│
├── backend/
│   ├── routes/
│   ├── data/
│   └── server.js
│
├── algorithms/
├── blockchain/
├── cybersecurity/
├── ai-engine/
├── docs/
└── README.md
```

---

# 🚀 Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd EL-CityShield-AI
```

## 2️⃣ Start Backend

```bash
cd backend
npm install
npm start
```

Backend runs on:

```text
http://localhost:5000
```

---

## 3️⃣ Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

# 🔌 API Endpoints

## Threat Management

```http
GET    /api/threats
POST   /api/threats
DELETE /api/threats/:id
```

## Traffic Management

```http
GET    /api/traffic
POST   /api/traffic
DELETE /api/traffic/:id
```

## Blockchain Records

```http
GET    /api/blockchain
POST   /api/blockchain
PUT    /api/blockchain/:id
DELETE /api/blockchain/:id
DELETE /api/blockchain
```

---

# 📸 Project Screenshots

The project includes screenshots for:

* Dashboard
* AI Monitoring
* Threat Analytics
* Smart Traffic
* Blockchain Logs
* Admin Panel
* DAA Overview

Location:

```text
frontend/public/assets/screenshots/
```

---

# 📈 Future Enhancements

* Machine Learning based threat prediction.
* Real-time CCTV integration.
* Cloud deployment.
* IoT sensor integration.
* Advanced blockchain consensus mechanism.
* Predictive traffic analytics.
* Mobile application support.

---

# 🎓 Academic Relevance

This project demonstrates practical implementation of major concepts from:

* Design and Analysis of Algorithms (DAA)
* Artificial Intelligence
* Cyber Security
* Blockchain Technology
* Smart City Systems
* Full Stack Development

---

# 👨‍💻 Developed By

**Yash Choudhary**

Department of Computer Science & Engineering

---

# 📄 License

This project is developed for educational and academic purposes.
