import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  FileSpreadsheet,
  FileCheck2,
  Compass,
  Milestone as MilestoneIcon,
  Activity,
  CheckCircle2,
  ListTodo,
  CheckSquare2,
  Network,
  GitPullRequest,
  CalendarDays,
  BarChart3,
  Users2,
  GitMerge,
  DollarSign,
  TrendingUp,
  ShieldAlert,
  AlertCircle,
  FileText,
  Sliders
} from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';

const Sidebar = ({ mobileOpen, closeMobile }) => {
  const { currentProject } = useProjects();

  const moduleSections = [
    {
      title: 'GENERAL',
      links: [
        { to: '/', label: 'Global Dashboard', icon: LayoutDashboard },
        { to: '/projects', label: 'Projects Registry', icon: FolderGit2 },
        { to: '/overview', label: 'Project Overview', icon: FileSpreadsheet }
      ]
    },
    {
      title: 'MODULE 1: INITIATION',
      links: [
        { to: '/charter', label: 'Project Charter', icon: FileCheck2 },
        { to: '/management-plan', label: 'Management Plan', icon: Compass },
        { to: '/milestones', label: 'Milestones', icon: MilestoneIcon },
        { to: '/status', label: 'Status Tracking', icon: Activity },
        { to: '/closure', label: 'Project Closure', icon: CheckCircle2 }
      ]
    },
    {
      title: 'MODULE 2: SCOPE & WBS',
      links: [
        { to: '/requirements', label: 'Requirements', icon: ListTodo },
        { to: '/approved-scope', label: 'Approved Scope', icon: CheckSquare2 },
        { to: '/wbs', label: 'WBS Hierarchy', icon: Network },
        { to: '/change-requests', label: 'Change Requests', icon: GitPullRequest }
      ]
    },
    {
      title: 'MODULE 3: SCHEDULE & RESOURCES',
      links: [
        { to: '/activities', label: 'Activities', icon: CalendarDays },
        { to: '/gantt', label: 'Gantt Timeline', icon: BarChart3 },
        { to: '/resources', label: 'Resource Roster', icon: Users2 },
        { to: '/dependencies', label: 'Dependencies & Delays', icon: GitMerge }
      ]
    },
    {
      title: 'MODULE 4: COST & EVM',
      links: [
        { to: '/cost', label: 'Cost & Expenses', icon: DollarSign },
        { to: '/earned-value', label: 'Earned Value (EVM)', icon: TrendingUp }
      ]
    },
    {
      title: 'MODULE 5: QUALITY & RISK',
      links: [
        { to: '/quality', label: 'Quality & Testing', icon: AlertCircle },
        { to: '/risks', label: 'Risk & PDPC Matrix', icon: ShieldAlert }
      ]
    },
    {
      title: 'MODULE 6: INTEGRATION & REPORTS',
      links: [
        { to: '/performance-dashboard', label: 'PMIS Performance', icon: Sliders },
        { to: '/project-report', label: 'Audit Report', icon: FileText }
      ]
    }
  ];

  return (
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-icon">
          <Sliders size={20} />
        </div>
        <div>
          <div className="brand-title">PMIS Enterprise</div>
          <div className="brand-badge">Modules 1 – 6 Active</div>
        </div>
      </div>

      <div className="sidebar-nav" style={{ paddingBottom: '2rem' }}>
        {moduleSections.map((sec, secIdx) => (
          <div key={secIdx} style={{ marginBottom: '1.25rem' }}>
            <div
              className="nav-section-title"
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.8px',
                color: 'var(--primary, #ea580c)',
                padding: '0.35rem 0.75rem',
                textTransform: 'uppercase'
              }}
            >
              {sec.title}
            </div>
            {sec.links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMobile}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="icon" size={17} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="module-badge-box">
          <div className="module-indicator" />
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Active Project
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-main, #0f172a)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {currentProject ? currentProject.projectName : 'None Selected'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
