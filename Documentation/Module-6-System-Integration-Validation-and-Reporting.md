# Module 6: System Integration, Validation, and Reporting Implementation

**System:** Project Management Information System (PMIS)  
**Course:** CSE-494 Software Project Management  
**Marks Weightage:** 03 Marks  
**Architecture:** MERN (MongoDB, Express, React, Node.js)

---

## 1. Module Overview & Syllabus Objectives
This module synthesizes all 5 preceding modules into a single, cohesive, enterprise-grade software application. It enforces cross-module referential integrity, guarantees consistent state synchronization across database records, provides an executive performance monitoring dashboard, delivers printable audit reports, and provides persistent database backup and restore capabilities for academic evaluation.

---

## 2. Detailed Feature Implementation

### 2.1 Database Integration & Cross-Module Consistency
* **Architecture:** Unified MongoDB database (`healthcare_pms` / `project_management_db`) with 12 interconnected collections.
* **Referential Consistency Mechanisms:**
  1. **Scope $\longleftrightarrow$ Schedule Consistency:** Activities (`Activity`) cannot exist without an authorized parent WBS Work Package (`WBSNode`).
  2. **Scope $\longleftrightarrow$ Quality Consistency:** Defects (`Defect`) and Quality Inspections (`QualityInspection`) are bound directly to their corresponding deliverable.
  3. **Schedule $\longleftrightarrow$ Cost Consistency:** Actual expenditures (`CostEntry`) are linked directly to activities (`Activity`), ensuring that Earned Value (EV) and Actual Cost (AC) reconcile to the exact same baseline activities.
  4. **Change Control $\longleftrightarrow$ Baseline Consistency:** Approving a Change Request (`ChangeRequest`) automatically updates requirements, WBS, schedule dates, and persists an immutable Baseline version (`Baseline v2`).

* **Entity Relationship Diagram (ERD):**

![PMIS Database ERD Diagram](file:///d:/BS-SE%20CUI/CUI%20Semester%207/SPM/Lab%20Mid/Documentation/UI%20Screenshots/PMIS-ERD-Diagram.drawio.png)

*(File reference: [Documentation/UI Screenshots/PMIS-ERD-Diagram.drawio.png](file:///d:/BS-SE%20CUI/CUI%20Semester%207/SPM/Lab%20Mid/Documentation/UI%20Screenshots/PMIS-ERD-Diagram.drawio.png))*

---

### 2.2 Input Validation & Comprehensive Exception Handling
* **Backend Validation Layer:**
  * Express central error middleware (`server/src/app.js`):
    ```javascript
    app.use((err, req, res, next) => {
      const statusCode = err.statusCode || 500;
      console.error(`[API Error] ${statusCode} - ${err.message}`);
      res.status(statusCode).json({
        success: false,
        error: { code: err.code || 'INTERNAL_ERROR', message: err.message }
      });
    });
    ```
  * Custom HTTP Status Codes Enforced:
    * `HTTP 400 Bad Request`: Missing mandatory fields, negative budget, invalid date sequence.
    * `HTTP 404 Not Found`: Invalid entity ID lookup.
    * `HTTP 409 Conflict`: Duplicate code detected.
    * `HTTP 422 Unprocessable Entity`: Business logic gate violation (e.g. Scope Gate unapproved requirement, or Closure Gate open critical defects).

---

### 2.3 Executive Performance Dashboard
* **Endpoint:** `GET /api/dashboard?statusDate=2026-12-28`
* **Controller:** `server/src/routes/api.js`
* **Frontend Component:** `client/src/pages/DashboardPage.jsx`
* **Unified Metrics Displayed:**
  * **Overall RAG Status Banner:** Evaluates system health as `RED`, `AMBER`, or `GREEN`:
    $$\text{RAG} = \begin{cases} \text{RED}, & \text{if } CPI < 0.85 \lor SPI < 0.85 \lor \text{Critical Defects} > 0 \lor \text{Slippage} > 5 \text{ days} \\ \text{AMBER}, & \text{if } CPI < 0.95 \lor SPI < 0.95 \lor \text{Delays} > 0 \\ \text{GREEN}, & \text{otherwise} \end{cases}$$
  * **EVM Metric Cards (6 KPI Cards):** Planned Value (PV), Earned Value (EV), Actual Cost (AC), CPI, SPI, and EAC.
  * **Delayed Activities Alert Box:** Lists activities slipping past status date with reason and delay days.
  * **Critical Defects Card:** Active high-priority defects blocking system sign-off.
  * **Pending Change Requests Card:** Outstanding CCB change requests with simulated cost and schedule impact.

---

### 2.4 Comprehensive Status & Audit Report
* **Frontend Component:** `client/src/pages/StatusReportPage.jsx`
* **Document Content for Hospital Consortium Review:**
  1. **Header & Project Identifiers:** Project Name, Active Baseline, Evaluation Status Date, Forecast Finish.
  2. **Section 1 — Executive Summary:** Status narrative, CPI/SPI commentary, and health evaluation.
  3. **Section 2 — Earned Value Performance Indicators:** Complete tabular breakdown of PV, EV, AC, CPI, SPI, and EAC with underlying formulas.
  4. **Section 3 — Major Milestones Tracking:** Delivery targets, forecast dates, and milestone completion status.
  5. **Section 4 — Quality & Critical Defect Log:** Open critical defects requiring remediation.
  6. **Section 5 — Governance Sign-off Blocks:** Formal signature lines for Lead Project Manager (Dr. Zeeshan Ali) and Consortium Chairman (Dr. Tariq Mahmood).
  7. **Print / Export PDF:** Integrated `@media print` CSS stylesheet formatting the screen into an executive letterhead document when clicking **"Print / Export PDF"**.

---

### 2.5 Database Backup, Restore & Examiner Clean-Slate Mode
* **Service:** `server/src/services/backupRestoreService.js`
* **Frontend Component:** `client/src/components/modals/BackupRestoreModal.jsx`
* **Features Provided:**
  * **Export / Backup Data:** Exports all 12 MongoDB collections into a single JSON file (`pmis-database-backup.json`) for GitHub check-in.
  * **Examiner File Restore:** Examiner can select and upload any `.json` backup file to instantly restore database state.
  * **Default Sample Restore:** 1-click restore from `PMIS-sample-data.json`.
  * **Clean-Slate Wipe (Empty):** Clears all collections so the examiner can verify clean manual data entry with zero hardcoded/static records.

---

## 3. API Endpoints Reference

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/dashboard` | Aggregated executive project dashboard data | `200 OK` |
| `GET` | `/api/database/backup` | Download complete database backup as JSON | `200 OK` |
| `POST` | `/api/database/restore` | Restore database from JSON backup file or default sample | `200 OK` |
| `POST` | `/api/database/clear` | Wipe database completely for clean-slate testing | `200 OK` |
| `POST` | `/api/seed/reset` | Restore case study Week 9 baseline state | `200 OK` |
