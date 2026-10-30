# Module 1: Project Initiation & Integration Management

## 1. Overview
Module 1 serves as the foundational pillar of the Project Management System (PMS). It establishes formal project governance, defines high-level objectives and constraints, aligns key stakeholders, plans scope, schedule, cost, and quality, and manages the complete lifecycle from authorization through execution tracking to formal closure.

---

## 2. Architecture & Data Flow

```
              CREATE PROJECT
                    │
                    ▼
             PROJECT CHARTER
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
  Objectives   Stakeholders   Scope
        │
        ▼
  APPROVED CHARTER
        │
        ▼
  MANAGEMENT PLAN
        │
  ┌─────┼─────────────┐
  ▼     ▼             ▼
 Scope Schedule      Cost
  │
  └──────────┬──────────┘
             ▼
          Quality
             │
             ▼
          MILESTONES
             │
             ▼
       PROJECT STATUS
             │
             ▼
        RESPONSIBILITIES
             │
             ▼
         COMPLETION
             │
             ▼
        PROJECT CLOSURE
```

---

## 3. Core Database Schemas & Collections

All models are linked via `projectId`:

1. **`Project`** (`models/Project.js`)
   - `projectId`: Unique uppercase identifier (e.g., `PRJ-001`).
   - `projectName`: Business title of the project.
   - `description`: Scope summary.
   - `projectManager`: Lead project manager.
   - `startDate`: Project kickoff date.
   - `deadline`: Official completion deadline.
   - `approvedBudget`: Baseline allocated budget.
   - `status`: Lifecycle status (`Planning`, `In Progress`, `On Hold`, `At Risk`, `Completed`, `Cancelled`).

2. **`ProjectCharter`** (`models/ProjectCharter.js`)
   - Objectives array.
   - Stakeholders array with roles, organizations, and influence levels.
   - In-scope, Out-of-scope, Assumptions, Constraints.
   - Approval status (`Draft`, `Submitted`, `Approved`, `Rejected`), approval date, approved by.

3. **`ManagementPlan`** (`models/ManagementPlan.js`)
   - `scopePlan`: Scope definition, deliverables list, inclusions, exclusions, approval process.
   - `schedulePlan`: Development dates, testing dates, deployment date, critical path notes.
   - `costPlan`: Development, hardware, software, contingency, other expenses, auto-computed total cost.
   - `qualityPlan`: Quality standards, testing strategy, code review process, acceptance criteria, quality metrics.

4. **`Milestone`** (`models/Milestone.js`)
   - `milestoneId`: e.g., `M-001`.
   - `title`, `description`, `dueDate`, `responsiblePerson`, `status`, `progress`, `completedDate`.

5. **`ProjectStatus`** (`models/ProjectStatus.js`)
   - `overallStatus`, `progress`, `currentPhase`, `currentIssues[]`, `achievements[]`, `risks[]`, `nextActions[]`.
   - `responsibilities[]`: Assigned roles with specific responsibility, timelines, and statuses.

6. **`ProjectClosure`** (`models/ProjectClosure.js`)
   - `closureDate`, `finalStatus`, `finalProgress`, `finalBudget`, `deliverablesCompleted[]`, `pendingItems[]`, `lessonsLearned[]`, `closureNotes`, `approvedBy`, `approvalStatus`.

---

## 4. REST API Endpoints

| Resource | Method | Endpoint | Description |
|---|---|---|---|
| **Projects** | `GET` | `/api/projects` | List all projects |
| | `POST` | `/api/projects` | Create a new project (auto-scaffolds companion records) |
| | `GET` | `/api/projects/:id` | Get project by ID or projectId |
| | `PUT` | `/api/projects/:id` | Update project details |
| | `DELETE` | `/api/projects/:id` | Cascade delete project and associated data |
| **Charter** | `GET` | `/api/projects/:projectId/charter` | Fetch project charter |
| | `PUT` | `/api/projects/:projectId/charter` | Save/update charter |
| **Management Plan** | `GET` | `/api/projects/:projectId/management-plan` | Fetch management plan |
| | `PUT` | `/api/projects/:projectId/management-plan` | Save/update scope, schedule, cost, quality |
| **Milestones** | `GET` | `/api/projects/:projectId/milestones` | Get all milestones for project |
| | `POST` | `/api/projects/:projectId/milestones` | Create a new milestone |
| | `PUT` | `/api/milestones/:id` | Update milestone progress/status |
| | `DELETE` | `/api/milestones/:id` | Delete milestone |
| **Status** | `GET` | `/api/projects/:projectId/status` | Get project status & responsibilities |
| | `PUT` | `/api/projects/:projectId/status` | Update execution status and responsibilities |
| **Closure** | `GET` | `/api/projects/:projectId/closure` | Get closure details |
| | `PUT` | `/api/projects/:projectId/closure` | Save closure & record approval sign-off |

---

## 5. Extensibility for Subsequent Modules
All future modules (Module 2: Requirements/Scope, Module 3: Scheduling/Gantt, Module 4: Cost & Procurement, etc.) directly reference `projectId`, reusing the unified authentication, database connection, dashboard layouts, and navigation.
