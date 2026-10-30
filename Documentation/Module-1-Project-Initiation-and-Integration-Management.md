# Module 1: Project Initiation & Integration Management Implementation

**System:** Project Management Information System (PMIS)  
**Course:** CSE-494 Software Project Management  
**Marks Weightage:** 04 Marks  
**Architecture:** MERN (MongoDB, Express, React, Node.js)

---

## 1. Module Overview & Syllabus Objectives
This module provides the executive governance framework for the software project lifecycle. It establishes the project baseline through formal charter authorization, defines subsidiary management plans (Scope, Schedule, Cost, Quality), maintains delivery milestones, manages team responsibility matrices, and enforces strict governance gates for project closure.

---

## 2. Detailed Feature Implementation

### 2.1 Project Charter Management
* **Database Entity:** `Project` (schema field `charter`)
* **Controller / Service:** `server/src/services/projectService.js` -> `updateCharter()`
* **Frontend Component:** `client/src/components/modals/EditCharterModal.jsx` and `client/src/pages/CharterPage.jsx`
* **Form & Data Attributes:**
  * **Project Objectives:** Dynamic list of SMART project goals (e.g., centralized multi-hospital appointments, diagnostic lab integration, automated billing).
  * **Stakeholder Register:** Array of `{ name, role, influence: ['High','Medium','Low'], interest: ['High','Medium','Low'] }`.
  * **Scope Boundaries:**
    * `scopeIn`: Deliverables explicitly authorized for funding and development.
    * `scopeOut`: Negative boundaries (e.g., hardware server racks, biometric kiosks, pharmacy vending machines).
  * **Approved Budget (BAC):** Baseline budget allocated (PKR 5,000,000).
  * **Project Timeline:** `startDate` ('2026-11-02') and fixed `deadline` ('2027-02-20', 16 weeks).
  * **Project Sponsor:** Institutional sponsor (Hospital Consortium Executive Board).
* **Implementation Mechanism:**
  When the user opens the "Edit Charter" modal, values are fetched from `GET /api/project`. Submitting changes dispatches `PUT /api/project/charter`, which validates that approved budget is numeric $> 0$, dates are in ISO format, and persists the updated charter in MongoDB.

---

### 2.2 Project Management Plan
* **Database Entity:** `Project` (schema field `plan`)
* **Four Subsidiary Plans Implemented:**
  1. **Scope Management Plan:** Defines how requirements are collected, validated through the Scope Gate, and decomposed into WBS work packages.
  2. **Schedule Management Plan:** Establishes working calendars (Mon–Fri), Critical Path Method (CPM) calculation intervals, and weekly status reviews.
  3. **Cost Management Plan:** Outlines Budget at Completion (BAC), contingency reserves (PKR 400,000), and EVM variance thresholds.
  4. **Quality Management Plan:** Mandates ISO/IEC 25010 standards, automated testing checklists, and the zero-critical-defect policy at milestone release.

---

### 2.3 Milestones & Responsibility Matrix
* **Database Entity:** `Milestone` and `TeamMember`
* **API Endpoints:**
  * `GET /api/project/milestones`, `POST /api/project/milestones`, `PUT /api/project/milestones/:id`
  * `GET /api/project/responsibilities`
* **Features:**
  * Milestones record `targetDate`, `forecastDate`, `owner`, and `status` (`Pending`, `Achieved`, `Delayed`).
  * If an activity on the Critical Path slips past the target date, the milestone status automatically transitions to `Delayed`.
  * Responsibility Matrix links WBS deliverables to team roles (PM, Backend, Frontend, DB, QA) with designated accountability.

---

### 2.4 Project Closure Records & Governance Gate
* **Database Entity:** `Project` (schema field `closure`)
* **Controller:** `server/src/services/projectService.js` -> `closeProject()`
* **Enforced Governance Gate:**
  A project **cannot** be closed if unresolved blockers remain. The backend enforces:
  1. All activities must have `percentComplete === 100`.
  2. Zero open defects with `severity === 'Critical'` or `'Major'`.
  3. All deliverables must have passed quality inspection audits.
  If any condition fails, `POST /api/project/close` rejects with `HTTP 422 Unprocessable Entity` and returns an itemized list of blockers.
* **Closure Record Content:**
  * `closedAt`: Timestamp of formal closure.
  * `signedOffBy`: Executive sponsor signature.
  * `lessonsLearned`: Comprehensive post-mortem documentation.
  * `finalBudgetVariance`: Final expenditure vs approved BAC.

---

## 3. API Endpoints Reference

| Method | Endpoint | Description | Request Body / Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/project` | Fetch active project charter & plan | `projectId` (query/header) |
| `PUT` | `/api/project/charter` | Update charter objectives, budget, dates | `{ objectives, stakeholders, scopeIn, scopeOut, approvedBudget, deadline }` |
| `GET` | `/api/project/milestones` | Get all delivery milestones | `projectId` |
| `POST` | `/api/project/milestones` | Create milestone | `{ name, targetDate, forecastDate, owner, status }` |
| `POST` | `/api/project/close` | Attempt project formal closure | `{ lessonsLearned, signedOffBy }` |
