# Module 2: Scope Management & Work Breakdown Structure (WBS) Implementation

**System:** Project Management Information System (PMIS)  
**Course:** CSE-494 Software Project Management  
**Marks Weightage:** 04 Marks  
**Architecture:** MERN (MongoDB, Express, React, Node.js)

---

## 1. Module Overview & Syllabus Objectives
This module manages the project scope boundary from initial requirements capture through MoSCoW prioritization, decomposition into a Work Breakdown Structure (WBS), and formal Change Control Board (CCB) governance. A central architectural feature of the software is the **Scope Gate**, which strictly prevents unapproved requirements from entering the official project scope or being broken down into work packages.

---

## 2. Detailed Feature Implementation

### 2.1 Requirements Management Module
* **Database Entity:** `Requirement`
* **Controller / Service:** `server/src/services/scopeService.js` -> `createRequirement()`, `updateRequirementStatus()`
* **Frontend Component:** `client/src/components/modals/AddRequirementModal.jsx` and `client/src/pages/RequirementsWBSPage.jsx`
* **MoSCoW Prioritization & Attributes:**
  * `code`: Unique identifier (e.g., `REQ-001`, `REQ-AI-01`).
  * `title` & `description`: Acceptance criteria and functional specifications.
  * `type`: `Functional` (clinical, booking, billing) vs `Non-Functional` (HIPAA security, sub-second latency).
  * `priority`: MoSCoW standard (`Must have`, `Should have`, `Could have`, `Won't have`).
  * `status`: State machine lifecycle:
    $$\text{Proposed} \longrightarrow \text{Under Review} \longrightarrow \text{Approved} \longrightarrow \text{Implemented}$$
    $$\text{Proposed / Under Review} \longrightarrow \text{Rejected}$$

---

### 2.2 Architectural Scope Gate Enforcement
* **Enforced System Rule:**
  Unapproved requirements (`Proposed`, `Under Review`, `Rejected`) **cannot** be linked to WBS elements, **cannot** be assigned activities, and **cannot** consume project budget.
* **Backend Verification Logic:**
  In `server/src/services/scopeService.js` (inside `createWBSNode()`):
  ```javascript
  if (data.requirementIds && data.requirementIds.length > 0) {
    const linkedReqs = await Requirement.find({ _id: { $in: data.requirementIds } });
    for (const req of linkedReqs) {
      if (req.status !== 'Approved') {
        const error = new Error(
          `Scope Gate Violation: Requirement [${req.code}: ${req.title}] is currently '${req.status}'. Only 'Approved' requirements can be included in the project scope.`
        );
        error.statusCode = 422;
        throw error;
      }
    }
  }
  ```
* **Frontend UI Prevention:**
  In `AddWBSModal.jsx`, the requirements linkage checklist displays status badges and disables checkboxes for any requirement that is not in `Approved` status.

---

### 2.3 Hierarchical Work Breakdown Structure (WBS)
* **Database Entity:** `WBSNode`
* **Hierarchy Model:**
  * **Level 1 (Root):** Project Level (`1.0 Smart Healthcare PMS`).
  * **Level 2 (Deliverables):** Major functional deliverables (`1.1 Patient Appointments`, `1.2 Lab Reports`, `1.3 Doctor Schedules`, `1.4 Hospital Billing`, `1.5 System Acceptance`).
  * **Level 3 (Work Packages):** Terminal nodes containing discrete assignable units of work (`1.1.1 Patient Registration`, `1.1.2 Appointment Booking Engine`).
* **Attributes:**
  * `code`: Decimal outline numbering (`1.1`, `1.1.1`).
  * `parentId`: Self-referential `ObjectId` linking child node to parent deliverable.
  * `requirementIds`: Bidirectional traceability references to approved requirements.

---

### 2.4 Change Control Board (CCB) & Impact Simulation
* **Database Entity:** `ChangeRequest`
* **Controller / Service:** `server/src/services/scopeService.js` and `server/src/engines/changeImpactEngine.js`
* **Frontend Component:** `client/src/components/modals/SubmitCRModal.jsx`, `client/src/components/BeforeAfterModal.jsx`, and `client/src/pages/ChangeRequestsPage.jsx`
* **Impact Simulation Algorithm:**
  Before approval, `GET /api/change-requests/:id/impact` simulates the triple constraint delta:
  1. **Budget Delta:** $\text{Revised BAC} = \text{Current BAC} + \text{CR Cost Impact}$. If $\text{Revised BAC} > \text{Approved Budget}$, flags `budgetCapExceeded: true`.
  2. **Schedule Delta:** Shifts project completion deadline by adding working days (`scheduleImpactDays`) to the finish date using the 5-day calendar.
  3. **Scope Delta:** Identifies proposed requirements (`REQ-AI-01`, `REQ-MOB-01`) waiting to be promoted to approved scope.
* **Approval & Re-baselining:**
  When CCB clicks **"Approve & Baseline v2"**:
  * Associated proposed requirements are automatically updated to `status = 'Approved'`.
  * WBS deliverable `1.6 AI & Mobile Expansion` is activated.
  * A new **Baseline v2** is created and frozen in `project.baselines` (`budget: 5,800,000 PKR`, `finishDate: 2027-03-09`).

---

## 3. API Endpoints Reference

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/requirements` | Retrieve all requirements with MoSCoW filter | `200 OK` |
| `POST` | `/api/requirements` | Add new requirement (starts as Proposed/Draft) | `201 Created` |
| `PUT` | `/api/requirements/:id/status` | Promote requirement status (e.g. to Approved) | `200 OK` |
| `GET` | `/api/wbs` | Get tree-structured WBS hierarchy | `200 OK` |
| `POST` | `/api/wbs` | Create deliverable or work package (enforces Scope Gate) | `201` / `422` |
| `POST` | `/api/change-requests` | Submit formal Change Request to CCB | `201 Created` |
| `GET` | `/api/change-requests/:id/impact` | Simulate triple constraint delta (Cost, Schedule, Scope) | `200 OK` |
| `POST` | `/api/change-requests/:id/approve` | CCB approval & automatic creation of Baseline v2 | `200 OK` |
