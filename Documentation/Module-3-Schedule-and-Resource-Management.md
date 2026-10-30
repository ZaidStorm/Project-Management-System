# Module 3: Schedule & Resource Management Implementation

**System:** Project Management Information System (PMIS)  
**Course:** CSE-494 Software Project Management  
**Marks Weightage:** 05 Marks  
**Architecture:** MERN (MongoDB, Express, React, Node.js)

---

## 1. Module Overview & Syllabus Objectives
This module provides automated programmatic project scheduling, resource roster allocation, Critical Path Method (CPM) network analysis, cascading delay impact calculation, and interactive timeline visualization. No dates or floats are hardcoded; all start dates, finish dates, floats, and critical paths are computed dynamically from activity durations, predecessors, and the project calendar.

---

## 2. Detailed Feature Implementation

### 2.1 Project Activities & Resource Allocation
* **Database Entity:** `Activity` and `TeamMember`
* **Controller / Service:** `server/src/services/scheduleService.js` and `server/src/engines/scheduleEngine.js`
* **Frontend Component:** `client/src/components/modals/AddActivityModal.jsx`, `client/src/components/modals/UpdateActivityProgressModal.jsx`, and `client/src/pages/SchedulePage.jsx`
* **Activity Attributes:**
  * `code`: Unique task code (e.g., `ACT-001`, `ACT-005`).
  * `name`: Activity title (e.g., "Lab Diagnostic Orders & Result Integration").
  * `wbsNodeId`: Parent WBS deliverable/work package.
  * `assigneeId`: Reference to `TeamMember` (Lead PM, Backend, Frontend, DB, QA).
  * `durationDays`: Duration in business working days.
  * `predecessors`: Array of `{ code, type: 'FS', lagDays }` (Finish-to-Start relationships).
  * `percentComplete`: Task execution progress ($0\%$ to $100\%$).
  * `plannedCost`: Baseline budget allocated for this activity (BAC portion).

---

### 2.2 Date Utilities & Working Calendar Arithmetic
* **Implementation:** `server/src/engines/dateUtils.js`
* **Business Calendar Rules:**
  * System operates on a standard **5-day working week (Monday through Friday)**.
  * Saturdays and Sundays are strictly non-working days and are skipped when adding duration or computing working intervals.
* **Core Functions:**
  * `addWorkingDays(startDateStr, days)`: Steps through calendar dates and increments count only on weekdays.
  * `getWorkingDaysDifference(startDateStr, endDateStr)`: Computes actual business days elapsed between two dates.
  * `isWorkingDay(dateObj)`: Boolean check (`day !== 0 && day !== 6`).

---

### 2.3 Critical Path Method (CPM) Programmatic Engine
* **Algorithm Location:** `server/src/engines/scheduleEngine.js` -> `calculateSchedule()`
* **Step 1: Cycle Detection (Kahn's Algorithm)**
  Before computing passes, the engine validates the directed acyclic graph (DAG):
  * Computes in-degree for every activity based on predecessors.
  * Processes nodes with zero in-degree.
  * If processed nodes count $<$ total nodes, throws:
    $$\text{Error: "Circular dependency detected in schedule network: A } \to \text{B } \to \text{ A"}$$
* **Step 2: Forward Pass (Early Dates)**
  For each activity in topological order:
  $$\text{Early Start (ES)} = \begin{cases} \text{Project Start Date}, & \text{if no predecessors} \\ \max_{\text{preds}}(\text{addWorkingDays}(\text{Pred EF}, 1)), & \text{otherwise} \end{cases}$$
  $$\text{Early Finish (EF)} = \text{addWorkingDays}(\text{ES}, \text{Duration} - 1)$$
* **Step 3: Backward Pass (Late Dates)**
  Starting from project completion date $\text{Project Finish} = \max(\text{EF})$:
  $$\text{Late Finish (LF)} = \begin{cases} \text{Project Finish}, & \text{if no successors} \\ \min_{\text{succs}}(\text{addWorkingDays}(\text{Succ LS}, -1)), & \text{otherwise} \end{cases}$$
  $$\text{Late Start (LS)} = \text{addWorkingDays}(\text{LF}, -(\text{Duration} - 1))$$
* **Step 4: Total Float & Critical Path Identification**
  $$\text{Total Float} = \text{getWorkingDaysDifference}(\text{ES}, \text{LS})$$
  $$\text{isCritical} = \begin{cases} \text{true}, & \text{if } \text{Total Float} \le 0 \\ \text{false}, & \text{otherwise} \end{cases}$$
  Any delay on an activity with $\text{Total Float} = 0$ will directly delay the final project deadline!

---

### 2.4 Delay Identification & Cascading Slippage Impact
* **Algorithm Location:** `server/src/services/scheduleService.js` -> `getScheduleDelays()`
* **Mechanism at Status Date:**
  1. Compares `statusDate` (e.g. `2026-12-28`) against scheduled `plannedFinish` of each activity.
  2. If an activity is scheduled to be completed before or at `statusDate` but has `percentComplete < 100`, it is flagged as **Delayed**:
     $$\text{Remaining Duration} = \lceil \text{Duration} \times (1 - \frac{\text{Percent Complete}}{100}) \rceil$$
     $$\text{Forecast Finish} = \text{addWorkingDays}(\text{statusDate}, \text{Remaining Duration})$$
     $$\text{Delay Days} = \text{getWorkingDaysDifference}(\text{Planned Finish}, \text{Forecast Finish})$$
  3. **Cascading Propagation:**
     If the delayed activity is on the **Critical Path** (e.g., `ACT-005 Lab Integration` at 40%), its slippage automatically pushes the start dates of all dependent downstream activities (`ACT-007`, `ACT-008`, `ACT-009`, `ACT-010`), and projects the new final delivery date.

---

### 2.5 Gantt-Style Interactive Timeline
* **Frontend Component:** `client/src/components/GanttChart.jsx`
* **Visual Elements:**
  * **Critical Path Highlighting:** Critical tasks are highlighted with high-visibility red bars (`bg-rose-500`) with critical badges. Non-critical tasks render in blue (`bg-blue-500`).
  * **Progress Overlay:** Nested darker fill displays exact percent complete inside the task bar.
  * **Milestone Markers:** Diamond milestone pins indicate target vs forecast dates.
  * **Today / Status Date Line:** A vertical red indicator line marks the current evaluation date across the 16-week timeline.

---

## 3. API Endpoints Reference

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/activities` | Fetch all activities with CPM calculated dates and float | `200 OK` |
| `POST` | `/api/activities` | Define new activity with duration and predecessors | `201 Created` |
| `PUT` | `/api/activities/:id` | Update activity progress %, actual dates, or duration | `200 OK` |
| `GET` | `/api/schedule/critical-path` | Retrieve only critical path activities ($\text{Float} \le 0$) | `200 OK` |
| `GET` | `/api/schedule/delays` | Calculate delays and cascading finish projection | `200 OK` |
| `GET` | `/api/schedule/resources` | Fetch resource roster allocation and loading | `200 OK` |
