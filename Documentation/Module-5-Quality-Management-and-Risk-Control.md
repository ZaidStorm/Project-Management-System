# Module 5: Quality Management & Risk Control Implementation

**System:** Project Management Information System (PMIS)  
**Course:** CSE-494 Software Project Management  
**Marks Weightage:** 04 Marks  
**Architecture:** MERN (MongoDB, Express, React, Node.js)

---

## 1. Module Overview & Syllabus Objectives
This module enforces software quality standards and proactive risk control. It provides full lifecycle defect tracking, deliverable quality inspection audits with checklists, quantitative $5 \times 5$ risk prioritization matrix ranking, and structured Process Decision Program Chart (PDPC) contingency tree visualization.

---

## 2. Detailed Feature Implementation

### 2.1 Defect Tracking Module
* **Database Entity:** `Defect`
* **Controller / Service:** `server/src/services/qualityService.js` -> `createDefect()`, `updateDefect()`
* **Frontend Component:** `client/src/components/modals/AddDefectModal.jsx` and `client/src/pages/QualityPage.jsx`
* **Attributes & Workflow:**
  * `code`: Unique defect code (e.g., `DEF-001`, `DEF-002`).
  * `title` & `description`: Detailed reproduction steps and symptoms.
  * `severity`: Categorized into `Critical`, `Major`, `Minor`, and `Trivial`.
  * `status`: Finite state machine:
    $$\text{Open} \longrightarrow \text{In Progress} \longrightarrow \text{Resolved} \longrightarrow \text{Verified} \longrightarrow \text{Closed}$$
  * `foundInPhase`: Testing phase (Unit Testing, Integration Testing, System Testing, UAT).
  * `assignedTo`: Reference to team developer/QA engineer.
  * `deliverableId`: Direct link to parent WBS deliverable.
* **Governance Gate Linkage:**
  Any open defect with `severity === 'Critical'` triggers a RED warning banner across the system and immediately **blocks formal project closure** until resolved and verified.

---

### 2.2 Quality Checklists & Inspection Audits
* **Database Entity:** `QualityInspection`
* **Controller / Service:** `server/src/services/qualityService.js` -> `createInspection()`, `getInspections()`
* **Frontend Component:** `client/src/components/modals/AddInspectionModal.jsx`
* **Audit Review Attributes:**
  * `deliverableName`: WBS deliverable audited (e.g. `1.1 Patient Appointment & Scheduling System`).
  * `inspector`: Lead Quality Engineer (Zainab Qureshi).
  * `inspectionDate`: Audit execution date.
  * `checklist`: Array of inspection criteria:
    * `criterion`: Description (e.g., "Unit test suite achieves $>85\%$ code coverage", "Patient data sanitized against SQL/NoSQL injection", "Appointment conflict locking prevents duplicate bookings").
    * `isMandatory`: Boolean flag.
    * `passed`: Boolean pass/fail toggle.
  * `overallResult`: Automated evaluation:
    $$\text{overallResult} = \begin{cases} \text{FAIL}, & \text{if any mandatory criterion is false} \\ \text{PASS}, & \text{otherwise} \end{cases}$$
  * `remarks`: Auditor notes and blocking defect references.

---

### 2.3 Quantitative Risk Prioritization Matrix ($5 \times 5$)
* **Database Entity:** `Risk`
* **Controller / Service:** `server/src/services/riskService.js` and `server/src/engines/riskEngine.js`
* **Frontend Component:** `client/src/components/modals/AddRiskModal.jsx`, `client/src/components/RiskHeatmap.jsx`, and `client/src/pages/RiskPDPCPage.jsx`
* **Scoring Algorithm:**
  Every identified risk is evaluated on two quantitative scales from $1$ to $5$:
  * **Likelihood ($L$):** $1$ (Rare), $2$ (Unlikely), $3$ (Moderate), $4$ (Likely), $5$ (Almost Certain).
  * **Impact ($I$):** $1$ (Insignificant), $2$ (Minor), $3$ (Moderate), $4$ (Major), $5$ (Catastrophic).
  $$\text{Risk Score} = \text{Likelihood} \times \text{Impact} \quad (1 \le \text{Score} \le 25)$$
* **Severity Bands & Action Priority:**
  * **HIGH (Red, Score $15 - 25$):** Immediate senior PM attention and active daily mitigation.
  * **MEDIUM (Amber, Score $8 - 14$):** Standard contingency and weekly monitoring.
  * **LOW (Green, Score $1 - 7$):** Routine monitoring and acceptance.
* **Interactive Heatmap:**
  Renders a dynamic $5 \times 5$ matrix grid. Clicking any cell filters and lists the exact risks falling inside that probability-severity quadrant.

---

### 2.4 Process Decision Program Chart (PDPC) Risk Tree
* **Algorithm Location:** `server/src/engines/riskEngine.js` -> `generatePDPCTree()`
* **Frontend Component:** `client/src/components/PDPCViewer.jsx`
* **Tree Structure & Dual Action Branches:**
  The PDPC systematically models the chain of potential failure and dual-layer defense:
  1. **Level 1 (Goal Node):** Overall project mission (e.g., "Continuous Multi-Hospital Patient Scheduling & EHR Sync").
  2. **Level 2 (Process Step):** Functional operational phase.
  3. **Level 3 (Potential Problem):** Specific quantified risk event (e.g., `RSK-001: Hospital network fiber cut during municipal roadworks`).
  4. **Level 4A (Preventive Countermeasure Branch):** Proactive action to reduce likelihood (e.g., *Configure automatic secondary cellular 4G/5G failover tunnels at each hospital branch*).
  5. **Level 4B (Corrective Contingency Branch):** Reactive action to reduce impact if failure still occurs (e.g., *Enable local SQLite transaction queue on reception desks with delayed cloud sync*).
* **Rendering:**
  Renders an interactive hierarchical tree graph using SVG connectors and color-coded node cards (Goal in Blue, Problem in Red, Preventive in Cyan, Corrective in Purple).

---

## 3. API Endpoints Reference

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/defects` | Get all defect tracking records with severity filter | `200 OK` |
| `POST` | `/api/defects` | Log new defect with severity, deliverable, assignee | `201 Created` |
| `PUT` | `/api/defects/:id` | Transition defect workflow status (Open -> Closed) | `200 OK` |
| `GET` | `/api/quality/inspections` | Fetch deliverable inspection audit history | `200 OK` |
| `POST` | `/api/quality/inspections` | Record formal deliverable quality inspection audit | `201 Created` |
| `GET` | `/api/risks` | Fetch prioritized risk register | `200 OK` |
| `POST` | `/api/risks` | Identify new risk with L, I, and PDPC actions | `201 Created` |
| `GET` | `/api/risks/matrix` | Get aggregated $5 \times 5$ risk heatmap distribution | `200 OK` |
| `GET` | `/api/risks/pdpc` | Generate complete structured PDPC graph tree | `200 OK` |
