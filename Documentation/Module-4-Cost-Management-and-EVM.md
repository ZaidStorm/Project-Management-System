# Module 4: Cost Management & Earned Value Analysis (EVM) Implementation

**System:** Project Management Information System (PMIS)  
**Course:** CSE-494 Software Project Management  
**Marks Weightage:** 05 Marks  
**Architecture:** MERN (MongoDB, Express, React, Node.js)

---

## 1. Module Overview & Syllabus Objectives
This module manages project cost baselines, logs actual expenditures (AC), and computes standard Earned Value Management (EVM) performance indicators (PV, EV, AC, CV, SV, CPI, SPI, EAC, VAC) programmatically. The software automatically monitors financial health and triggers proactive warning alerts when CPI or SPI drops below predefined performance thresholds.

---

## 2. Detailed Feature Implementation

### 2.1 Planned Budget & Activity Cost Estimation
* **Database Entity:** `Project` (`plan.costPlan.bac`), `Activity` (`plannedCost`)
* **Total Planned Budget (BAC):**
  $$\text{BAC} = \sum_{i=1}^{n} \text{plannedCost}(\text{Activity}_i)$$
  In our case study baseline:
  $$\text{BAC} = \text{PKR } 5,000,000 \quad (\text{Revised to PKR } 5,800,000 \text{ following CR-001})$$

---

### 2.2 Actual Expenditure Tracking (AC)
* **Database Entity:** `CostEntry`
* **Controller / Service:** `server/src/services/costService.js` -> `addCostEntry()`, `getCosts()`
* **Frontend Component:** `client/src/components/modals/AddCostModal.jsx` and `client/src/pages/CostEVMPage.jsx`
* **Fields Captured:**
  * `activityId`: Activity against which cost was incurred.
  * `date`: Date of transaction.
  * `amount`: Numeric PKR spend.
  * `category`: Cost breakdown category (`Labour`, `Infrastructure`, `Licence`, `Other`).
  * `note`: Descriptive justification (e.g. "Senior backend developer overtime", "Cloud database cluster setup").

---

### 2.3 Programmatic EVM Computation Engine
* **Algorithm Location:** `server/src/engines/evmEngine.js` -> `calculateEVM()`
* **Pure Mathematical Formulas Enforced:**

| Indicator | Formal Name | Mathematical Formula | System Interpretation |
| :--- | :--- | :--- | :--- |
| **BAC** | Budget at Completion | $\sum \text{plannedCost}$ | Total authorized baseline project budget. |
| **PV** | Planned Value | $\sum (\text{plannedCost} \times \text{plannedPercentAtStatusDate})$ | Value of work scheduled to be completed by status date. |
| **EV** | Earned Value | $\sum (\text{plannedCost} \times \frac{\text{percentComplete}}{100})$ | Budgeted value of work actually performed. |
| **AC** | Actual Cost | $\sum_{\text{date} \le \text{statusDate}} \text{CostEntry.amount}$ | Total actual expenses recorded up to status date. |
| **CV** | Cost Variance | $EV - AC$ | Negative indicates spending exceeds earned value. |
| **SV** | Schedule Variance | $EV - PV$ | Negative indicates progress behind schedule target. |
| **CPI** | Cost Performance Index | $\frac{EV}{AC}$ | Value earned per PKR spent ($< 1.0$ is cost overrun). |
| **SPI** | Schedule Performance Index | $\frac{EV}{PV}$ | Schedule efficiency ratio ($< 1.0$ is delayed progress). |
| **EAC** | Estimate at Completion | $\frac{\text{BAC}}{CPI}$ | Projected total final cost if current efficiency persists. |
| **VAC** | Variance at Completion | $\text{BAC} - EAC$ | Projected overrun or surplus at project finish. |

* **Zero AC Edge Case Protection:**
  When a project has zero expenses logged ($AC = 0$), calculating $\frac{EV}{AC}$ would result in `Infinity` or `NaN`. The engine handles this cleanly:
  ```javascript
  const cpi = ac > 0 ? Number((ev / ac).toFixed(3)) : null;
  const cpiReason = ac === 0 ? 'No expenditure logged yet' : null;
  ```

---

### 2.4 Automatic Variance Alerts & Threshold Warnings
* **Predefined Thresholds Configured in Database:**
  * $\text{CPI Warning Threshold} = 0.95$
  * $\text{CPI Critical Threshold} = 0.85$
  * $\text{SPI Warning Threshold} = 0.95$
  * $\text{SPI Critical Threshold} = 0.85$
* **Automated Warning Generation:**
  At Week 9 Status Date (`2026-12-28`), the case study data evaluates to:
  $$PV = 2,850,000 \text{ PKR}, \quad EV = 2,230,000 \text{ PKR}, \quad AC = 2,850,000 \text{ PKR}$$
  $$CPI = \frac{2,230,000}{2,850,000} = \mathbf{0.782} < 0.85 \quad (\text{CRITICAL COST OVERRUN})$$
  $$SPI = \frac{2,230,000}{2,850,000} = \mathbf{0.842} < 0.85 \quad (\text{CRITICAL SCHEDULE DELAY})$$
  $$EAC = \frac{5,000,000}{0.782} = \mathbf{6,410,256} \text{ PKR} \quad (\text{Projected Overrun of PKR 1,410,256})$$
  The system automatically triggers **RED Alert Banners** on the Global Dashboard and Cost Management screens, displaying exact overrun metrics.

---

### 2.5 Cumulative S-Curve Visualization
* **Frontend Component:** `client/src/components/EVMChart.jsx`
* **Features:**
  * Uses Recharts library to plot cumulative lines for **PV (Baseline Schedule)**, **EV (Earned Work)**, and **AC (Actual Spend)** over time.
  * Allows the project manager and hospital consortium board to visually track cost divergence and schedule slip progression across the project timeline.

---

## 3. API Endpoints Reference

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/costs` | Get itemized expenditure ledger entries | `200 OK` |
| `POST` | `/api/costs` | Log new expenditure entry (Labour/Licence/Infra) | `201 Created` |
| `GET` | `/api/evm` | Compute PV, EV, AC, CPI, SPI, EAC, and threshold warnings | `200 OK` |
| `GET` | `/api/evm/history` | Generate time-series data points for EVM S-Curve chart | `200 OK` |
