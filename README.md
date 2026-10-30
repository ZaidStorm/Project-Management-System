# Project Management Information System (PMIS)

A full-stack, enterprise-grade MERN application covering the complete software project management lifecycle across all 6 core SPM knowledge areas.

---

## 🌟 Modules Implemented

1. **Module 1: Project Initiation & Integration Management**
   - Project Charter creation and management (objectives, stakeholders, scope boundaries, approved budget, deadlines).
   - Project Management Plan (scope, schedule, cost, quality baselines).
   - Milestone tracking, status reporting, and formal Project Closure with lessons learned.
2. **Module 2: Scope Management & WBS**
   - Requirements engineering lifecycle (add, update, prioritize MoSCoW, approve/reject).
   - Scope baseline enforcement (unapproved requirements are barred from approved scope).
   - Hierarchical Work Breakdown Structure (WBS) visual tree and work packages.
   - Change Request mechanism recording impact on scope, schedule, and cost.
3. **Module 3: Schedule & Resource Management**
   - Activity sequencing with dependencies (FS, SS, FF, SF) and lead/lag times.
   - Critical Path Method (CPM) calculation (ES, EF, LS, LF, total float, and critical path identification).
   - Interactive visual Gantt chart with drag/zoom and progress visualization.
   - Resource allocation and over-allocation warning detection.
4. **Module 4: Cost Management & Earned Value Management (EVM)**
   - Cost budgeting and expense tracking.
   - Programmatic EVM calculation: PV, EV, AC, CV, SV, CPI, SPI, EAC, ETC, and VAC.
   - Financial variance analysis and trend graphs.
5. **Module 5: Quality Management & Risk Control**
   - Quality control checklists, inspection records, and defect severity tracking.
   - Risk register with 5x5 Probability-Impact matrix and automated RPN scoring.
   - Process Decision Program Chart (PDPC) for contingency and mitigation planning.
6. **Module 6: System Integration, Reporting & Audit**
   - Comprehensive Project Status Dashboard with real-time health indicators.
   - Dynamic report generation and data export.
   - Programmatic database backup & restore (`Documentation/pmis-database-backup.json`).

---

## 📚 Examination & Documentation Deliverables

All required examination deliverables are located in the [`Documentation/`](./Documentation) directory:

- 📄 **Complete Scope & Implementation Document**: [`Documentation/PMIS-Software-Scope-and-Implementation-Document.docx`](./Documentation/PMIS-Software-Scope-and-Implementation-Document.docx)
- 📊 **Database Schema & ERD Diagram**: [`Documentation/PMIS-ERD-Diagram.drawio.png`](./Documentation/PMIS-ERD-Diagram.drawio.png) & [`docs/database_erd.drawio`](./docs/database_erd.drawio)
- 💾 **Database Backup File**: [`Documentation/pmis-database-backup.json`](./Documentation/pmis-database-backup.json)
- 📋 **Realistic Sample Dataset**: [`Documentation/PMIS-sample-data.json`](./Documentation/PMIS-sample-data.json)
- 🧪 **15 Automated Test Cases**: [`Documentation/PMIS-test-cases.json`](./Documentation/PMIS-test-cases.json)
- 🎬 **Demonstration Guide**: [`Documentation/Short Demonstration of the Working Application.txt`](./Documentation/Short%20Demonstration%20of%20the%20Working%20Application.txt)
- 🖼️ **UI Screen Captures**: Located in [`Documentation/UI Screenshots/`](./Documentation/UI%20Screenshots/)

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, React Router 6, Axios, Lucide Icons, Custom CSS Design System.
- **Backend**: Node.js, Express.js, Mongoose, CORS, Dotenv, Morgan.
- **Database**: MongoDB (Persistent document database).

---

## 📁 Repository Structure

```
.
├── client/                     # Vite + React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Modular UI components (WBS, Gantt, EVM, Quality, Risk, etc.)
│   │   ├── context/            # ProjectContext for state synchronization
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # 20+ specialized page views for all modules
│   │   ├── services/           # Axios API connectors
│   │   ├── styles/             # Modern CSS tokens, responsive layouts, glassmorphism
│   │   └── utils/              # Mathematical, currency, and date formatters
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── config/                 # MongoDB database & environment configuration
│   ├── controllers/            # Module controllers with validation & error handling
│   ├── middleware/             # Error & payload validation middleware
│   ├── models/                 # Mongoose schemas for all PMIS entities
│   ├── routes/                 # RESTful API route endpoints
│   ├── services/               # CPM, EVM, and business logic calculation engines
│   ├── utils/                  # Seeding & response formatters
│   ├── server.js
│   └── package.json
│
├── Documentation/              # Official Examination Documents & Assets
│   ├── PMIS-Software-Scope-and-Implementation-Document.docx
│   ├── PMIS-ERD-Diagram.drawio.png
│   ├── pmis-database-backup.json
│   ├── PMIS-sample-data.json
│   ├── PMIS-test-cases.json
│   └── UI Screenshots/
│
├── docs/                       # Architectural diagrams & specifications
│   └── database_erd.drawio
│
├── .env.example                # Sample environment variables
├── .gitignore
├── package.json                # Root orchestration package
├── run.bat                     # Double-click launcher
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally on port `27017` or MongoDB Atlas URI)

### 2. Environment Setup
Copy `.env.example` to `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/project_management_db
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Installation
Install root, backend, and frontend dependencies:
```bash
npm run install-all
```

### 4. Running the System
#### Option A: One-Click Launcher (Windows)
Double-click:
```bash
run.bat
```
This script launches the MongoDB service, boots the Node.js backend on port `5000`, starts the Vite frontend on port `5173`, and opens the browser.

#### Option B: Manual Terminal Execution
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 💾 Database Backup & Restore Feature

To ensure no hardcoded data is displayed and the examiner can verify persistent records:
1. **Restore Backup**: Use the in-app backup/restore interface or import `Documentation/pmis-database-backup.json`.
2. **Seed Realistic Sample Data**: Run `node server/seedHealthcareData.js` to populate a complete hospital digitization project with all activities, WBS, EVM metrics, risks, and quality inspections.
