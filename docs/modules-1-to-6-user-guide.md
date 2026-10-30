# Project Management Information System (PMIS) — Modules 1 to 6 User Guide

## Architecture & System Overview
This system is an enterprise MERN PMIS implementing the complete 6-module project management lifecycle without any hardcoded/seeded data:
1. **Module 1:** Project Initiation & Integration Management
2. **Module 2:** Scope Management & Work Breakdown Structure (WBS)
3. **Module 3:** Schedule & Resource Management
4. **Module 4:** Cost Management & Earned Value (EVM)
5. **Module 5:** Quality Management & Risk Control
6. **Module 6:** Integration, Validation & Reporting

---

## Operating Modules Separately via Navigation
The sidebar navigation menu clearly organizes each module under its own header:
- **General:** Global Dashboard, Projects Registry, Project Overview
- **MODULE 1: INITIATION:** Project Charter, Management Plan, Milestones, Status Tracking, Project Closure
- **MODULE 2: SCOPE & WBS:** Requirements, Approved Scope, WBS Hierarchy, Change Requests
- **MODULE 3: SCHEDULE & RESOURCES:** Activities, Gantt Timeline, Resource Roster, Dependencies & Delays
- **MODULE 4: COST & EVM:** Cost & Expenses, Earned Value (EVM)
- **MODULE 5: QUALITY & RISK:** Quality & Testing, Risk & PDPC Matrix
- **MODULE 6: INTEGRATION & REPORTS:** PMIS Performance, Audit Report

---

## Step-by-Step Dynamic Data Entry Guide (Hospital Management System Example)

### Step 1: Create the Project (Registry / Initiation)
1. Go to **Projects Registry** &rarr; Click **"+ Create New Project"**.
2. Enter:
   - **Project Name:** `Hospital Management System`
   - **Category:** `Healthcare Software`
   - **Budget:** `500000` (Rs. 500,000)
   - **Deadline:** Select your project completion deadline (e.g., 30 Dec 2026)
   - **Project Manager:** `Abdul Wahab`
   - **Description:** `Integrated hospital administration, patient record, and billing system.`
3. Save project. Select it as your active project from the top bar.

---

### Step 2: Module 1 — Charter & Governance
1. Go to **Module 1: Project Charter**. Click **"Edit Charter"**.
   - Input objectives, scope boundaries, approved budget, and add stakeholders (e.g. Hospital Director, Chief Medical Officer).
   - Set status to **"Approved"**.
2. Go to **Management Plan**: Fill in the Scope, Schedule, Cost, and Quality management approaches.
3. Go to **Milestones**: Add milestones (e.g. `M1: Charter Approval`, `M2: Core Architecture`, `M3: UAT Sign-off`).

---

### Step 3: Module 2 — Requirements & Scope Control
> **Enforced System Rule:** Unapproved requirements *cannot* be part of the official project scope and *cannot* be broken down into WBS nodes.

1. Go to **Module 2: Requirements** &rarr; Click **"+ New Requirement"**:
   - **REQ-001:**
     - Title: `Patient Registration`
     - Description: `System shall allow receptionists to register new patients.`
     - Type: `Functional`
     - Priority: `Critical`
     - Status: `Draft` &rarr; click **"Under Review"** &rarr; click **"Approve"** (Moves to Approved Scope).
   - **REQ-002:**
     - Title: `Online Payment`
     - Description: `System should support online payment.`
     - Type: `Functional`
     - Priority: `Medium`
     - Status: `Draft` &rarr; click **"Under Review"** (Do *not* approve yet).
2. Go to **Approved Scope**:
   - `REQ-001` appears in the **APPROVED PROJECT SCOPE** list.
   - `REQ-002` remains under **Pending Requirements** and cannot enter WBS.

---

### Step 4: Module 2 — Work Breakdown Structure (WBS)
1. Go to **WBS Hierarchy** &rarr; Click **"+ Add Root Node"**:
   - Name: `Hospital Management System`, Node Type: `Project`
2. Under Hospital Management System, click **"+ Child"**:
   - Name: `Patient Management`, Node Type: `Deliverable`
3. Under Patient Management, click **"+ Child"**:
   - Name: `Patient Registration`, Node Type: `Work Package`, Link Approved Requirement: `REQ-001 Patient Registration`
4. Under Patient Registration, add tasks:
   - `Registration UI` (Task)
   - `Registration API` (Task)
   - `Registration Testing` (Task)

---

### Step 5: Module 2 — Change Request (CCB Workflow)
1. Go to **Change Requests** &rarr; Click **"+ New Change Request"**:
   - Title: `Add Online Payment Gateway`
   - Description: `Client requests credit card and bank transfer for patient invoices.`
   - Justification: `Improve patient payment convenience.`
   - Cost Impact: `80000` (+Rs. 80,000)
   - Schedule Impact: `15` (+15 Days)
   - Resource Impact: `1 Backend Developer`
   - Risk Impact: `Payment gateway PCI compliance and uptime`
2. Impact Analysis & Review:
   - Click **"Approve"** to accept the change request into the project scope.

---

### Step 6: Module 3 — Schedule & Resource Management
1. Go to **Resource Roster** &rarr; Click **"+ Add Resource"**:
   - `Muhammad Zaid` — `Backend Developer` (Rate: Rs. 1,500/hr)
   - `Abdullah` — `Frontend Developer` (Rate: Rs. 1,400/hr)
2. Go to **Activities** &rarr; Click **"+ Add Activity"**:
   - Name: `Develop Patient Registration API`
   - WBS: Select `Patient Registration`
   - Start Date & End Date (e.g. 10 Nov &rarr; 15 Nov, 6 days)
   - Assign Resource: `Muhammad Zaid`
   - Progress: `70%`, Status: `In Progress`
3. Go to **Dependencies & Delays**:
   - Link predecessor/successor activities with Finish-to-Start (FS). If Activity A finishes late, the system flags the delay propagation to dependent activities!
4. Go to **Gantt Timeline**: View the visual bar chart schedule.

---

### Step 7: Module 4 — Cost Management & EVM
1. Go to **Cost & Expenses**:
   - Under **Activity Planned Cost Breakdown**, click **"Estimate"** on an activity:
     - Labor: `Rs. 80,000`
     - Software: `Rs. 10,000`
     - Other: `Rs. 5,000`
     - Total Planned: `Rs. 95,000`
   - Under **Actual Expenditure Log**, click **"Record Expense"**:
     - Description: `Backend contractor milestone payment`
     - Amount: `105000` (Rs. 105,000)
     - Category: `Labor`
2. Go to **Earned Value (EVM)**:
   - View automated calculations:
     - **PV (Planned Value):** `Planned Budget × Planned Completion %`
     - **EV (Earned Value):** `Planned Budget × Actual Completion %`
     - **AC (Actual Cost):** `Total Actual Expenditure`
     - **CPI (Cost Performance Index):** `EV / AC` (Status: Over / On / Under Budget)
     - **SPI (Schedule Performance Index):** `EV / PV` (Status: Ahead / On / Behind Schedule)
     - Automatic alert banners fire if CPI < 0.90 or SPI < 0.90!

---

### Step 8: Module 5 — Quality & Risk Control
1. Go to **Quality & Testing**:
   - **Defects:** Click **"Report Defect"**: Title: `Login API returns 500 error`, Severity: `Critical`, Status: `Open`.
   - **Quality Checklists:** Click **"New Checklist"**: Deliverable: `Patient Registration Module`, check off unit tests, code review, etc.
   - **Inspections:** Click **"Record Inspection"**: Total Test Cases: `25`, Passed: `24`, Failed: `1`, Result: `PASS`.
2. Go to **Risk & PDPC Matrix**:
   - Click **"Identify Risk"**:
     - Title: `Internet outage during cloud synchronization`
     - Likelihood: `4` (Likely), Impact: `5` (Catastrophic) &rarr; Score: `20` (**CRITICAL**)
     - Preventive Action: `Dual ISP failover & local database cache`
     - Corrective Action: `Offline transaction queue`
     - Strategy: `Mitigate`, Owner: `Muhammad Zaid`
   - Switch to **5×5 Prioritization Matrix** to view the interactive heatmap.
   - Switch to **Process Decision Program Chart (PDPC)** to view the failure prevention chain.

---

### Step 9: Module 6 — Integration Dashboard & Audit Report
1. Go to **PMIS Performance**:
   - Displays the overall health dashboard matching wireframe 6.4:
     - Overall progress %
     - Schedule & Budget health status badges
     - Activities, Delayed, Changes, and Defects counter cards
     - Real-time EVM indices (PV, EV, AC, CPI, SPI)
     - Critical bottlenecks & red/yellow alert box
2. Go to **Audit Report**:
   - Formats a comprehensive, printable report with executive summary, charter, scope traceability, schedule, EVM breakdown, defects, risks, and governance sign-off blocks. Click **"Print / Save PDF"** to export.

---

## How to Start the System
Double-click `start.bat` (or run `run.bat`) in the project root:
1. Spawns MongoDB on `127.0.0.1:27017` using `D:\mongodb-data`.
2. Starts the Node.js Express server on port 5000 and Vite React dev server on port 5173.
3. Automatically opens `http://localhost:5173` in your default browser.
