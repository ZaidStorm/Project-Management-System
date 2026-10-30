# PMIS System Architecture & Technical Specifications

**Project:** Project Management Information System (PMIS)  
**Course:** CSE-494 Software Project Management  
**Institution:** COMSATS University Islamabad  
**Stack:** MERN (MongoDB, Express.js, React, Node.js)

---

## 1. System Architecture Overview

The PMIS is engineered as a decoupled, multi-tiered enterprise architecture:

```
[ Web Browser Client (React 18 + Vite) ]
                    │
                    │  RESTful JSON APIs (HTTP/HTTPS)
                    ▼
[ Node.js + Express API Gateway (Port 5000) ]
        │                       │
        ├── Algorithmic Engines ├── Validation & Security Middleware
        │   ├── scheduleEngine  │   └── projectResolver, errorMiddleware
        │   ├── evmEngine       │
        │   ├── riskEngine      │
        │   └── changeEngine    │
        ▼                       ▼
[ MongoDB Database (Port 27017, Mongoose ODM) ]
```

---

## 2. Database Entity Relationship Diagram (ERD)

Below is the complete database architecture and relationship diagram for the PMIS database:

![PMIS Database Entity Relationship Diagram](file:///d:/BS-SE%20CUI/CUI%20Semester%207/SPM/Lab%20Mid/Documentation/UI%20Screenshots/PMIS-ERD-Diagram.drawio.png)

*Source Draw.io File:* [database_erd.drawio](file:///d:/BS-SE%20CUI/CUI%20Semester%207/SPM/Lab%20Mid/docs/database_erd.drawio)  
*High-Resolution PNG:* [PMIS-ERD-Diagram.drawio.png](file:///d:/BS-SE%20CUI/CUI%20Semester%207/SPM/Lab%20Mid/Documentation/UI%20Screenshots/PMIS-ERD-Diagram.drawio.png)

---

## 3. Directory Structure

```
SPM/Lab Mid/
├── client/                     # Vite + React 18 User Interface
│   ├── src/
│   │   ├── api/                # Axios API client (client.js)
│   │   ├── components/         # Shared UI, GanttChart, EVMChart, RiskHeatmap, PDPCViewer
│   │   │   └── modals/         # Input Modals (Charter, WBS, Activity, Cost, Defect, Backup)
│   │   ├── pages/              # 9 Core Pages (Dashboard, Charter, Scope, Schedule, etc.)
│   │   └── index.css           # Clean corporate design system & modal styling
├── server/                     # Node.js + Express API Server
│   ├── src/
│   │   ├── config/             # MongoDB connection manager (db.js)
│   │   ├── engines/            # Pure mathematical computation functions
│   │   │   ├── dateUtils.js    # 5-day business calendar arithmetic
│   │   │   ├── scheduleEngine.js # CPM, Kahn's cycle detection, Float
│   │   │   ├── evmEngine.js    # PV, EV, AC, CPI, SPI, EAC formulas
│   │   │   ├── riskEngine.js   # 5x5 matrix scoring & PDPC graph builder
│   │   │   └── changeImpactEngine.js # Triple-constraint simulation
│   │   ├── models/             # 12 Mongoose Database Schemas
│   │   ├── routes/             # REST API endpoint routes (api.js)
│   │   ├── services/           # Business logic & referential integrity controllers
│   │   └── seed/               # Case study seed generator
│   └── tests/                  # Jest automated test suites (api & unit)
├── Documentation/              # Complete Project Documentation & Examiner Deliverables
│   ├── Module-1-Project-Initiation-and-Integration-Management.md
│   ├── Module-2-Scope-Management-and-WBS.md
│   ├── Module-3-Schedule-and-Resource-Management.md
│   ├── Module-4-Cost-Management-and-EVM.md
│   ├── Module-5-Quality-Management-and-Risk-Control.md
│   ├── Module-6-System-Integration-Validation-and-Reporting.md
│   ├── PMIS-System-Architecture.md
│   ├── PMIS-sample-data.json   # 902 lines realistic sample data
│   ├── PMIS-test-cases.json    # 15 automated test cases
│   ├── pmis-database-backup.json # Complete MongoDB JSON backup
│   └── database_erd.drawio     # Crow's Foot ERD for Draw.io
├── run.bat                     # Unified system launcher
└── package.json
```

---

## 3. Technology Stack & Packages

| Layer | Technology | Key Libraries | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 18 | `vite`, `lucide-react`, `recharts`, `axios` | Interactive GUI, forms, Gantt, charts |
| **Styling** | Vanilla CSS | Custom Design System, Flexbox, CSS Grid | Fast rendering, responsive layout |
| **Backend** | Node.js / Express | `express`, `mongoose`, `cors`, `morgan` | REST API, validation, business gates |
| **Database** | MongoDB 8.x | Mongoose ODM | Persistent multi-document storage |
| **Testing** | Jest | `jest`, `supertest` | Automated unit & integration testing |
