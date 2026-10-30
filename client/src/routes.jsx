import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Core & Registry
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import CreateProject from './pages/CreateProject';
import ProjectOverview from './pages/ProjectOverview';
import NotFound from './pages/NotFound';

// Module 1: Project Initiation & Integration
import ProjectCharterPage from './pages/ProjectCharter';
import ManagementPlanPage from './pages/ManagementPlan';
import MilestonesPage from './pages/Milestones';
import ProjectStatusPage from './pages/ProjectStatus';
import ProjectClosurePage from './pages/ProjectClosure';

// Module 2: Scope Management & WBS
import RequirementsPage from './pages/Requirements';
import ApprovedScopePage from './pages/ApprovedScope';
import WBSPage from './pages/WBS';
import ChangeRequestsPage from './pages/ChangeRequests';

// Module 3: Schedule & Resource Management
import ActivitiesPage from './pages/Activities';
import GanttPage from './pages/Gantt';
import ResourcesPage from './pages/Resources';
import DependenciesPage from './pages/Dependencies';

// Module 4: Cost Management & EVM
import CostManagementPage from './pages/CostManagement';
import EarnedValuePage from './pages/EarnedValue';

// Module 5: Quality Management & Risk Control
import QualityManagementPage from './pages/QualityManagement';
import RiskManagementPage from './pages/RiskManagement';

// Module 6: Integration, Validation & Reporting
import IntegrationDashboardPage from './pages/IntegrationDashboard';
import ProjectReportPage from './pages/ProjectReport';

const AppRoutes = () => {
  return (
    <Routes>
      {/* PMIS General */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects" element={<ProjectList />} />
      <Route path="/projects/new" element={<CreateProject />} />
      <Route path="/overview" element={<ProjectOverview />} />

      {/* Module 1: Project Initiation & Integration */}
      <Route path="/charter" element={<ProjectCharterPage />} />
      <Route path="/management-plan" element={<ManagementPlanPage />} />
      <Route path="/milestones" element={<MilestonesPage />} />
      <Route path="/status" element={<ProjectStatusPage />} />
      <Route path="/closure" element={<ProjectClosurePage />} />

      {/* Module 2: Scope Management & WBS */}
      <Route path="/requirements" element={<RequirementsPage />} />
      <Route path="/approved-scope" element={<ApprovedScopePage />} />
      <Route path="/wbs" element={<WBSPage />} />
      <Route path="/change-requests" element={<ChangeRequestsPage />} />

      {/* Module 3: Schedule & Resource Management */}
      <Route path="/activities" element={<ActivitiesPage />} />
      <Route path="/gantt" element={<GanttPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/dependencies" element={<DependenciesPage />} />

      {/* Module 4: Cost Management & EVM */}
      <Route path="/cost" element={<CostManagementPage />} />
      <Route path="/earned-value" element={<EarnedValuePage />} />

      {/* Module 5: Quality Management & Risk Control */}
      <Route path="/quality" element={<QualityManagementPage />} />
      <Route path="/risks" element={<RiskManagementPage />} />

      {/* Module 6: Integration, Validation & Reporting */}
      <Route path="/performance-dashboard" element={<IntegrationDashboardPage />} />
      <Route path="/project-report" element={<ProjectReportPage />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
