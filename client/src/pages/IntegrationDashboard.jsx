import React, { useState, useEffect } from 'react';
import { useProjects } from '../hooks/useProjects';
import { reportingService } from '../services/reportingService';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import {
  LayoutDashboard,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
  FileText,
  ShieldAlert,
  GitPullRequest,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const IntegrationDashboard = () => {
  const { currentProject } = useProjects();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentProject?._id) {
      loadPerformance();
    }
  }, [currentProject]);

  const loadPerformance = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await reportingService.getPerformance(currentProject._id);
      setData(res.data.data || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load integrated performance data.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentProject) {
    return (
      <div className="empty-state-card">
        <h3>No Project Selected</h3>
        <p>Please select an active project to view the Performance Dashboard.</p>
      </div>
    );
  }

  if (loading) return <Loading text="Aggregating PMIS Cross-Module Performance Indicators..." />;

  const m = data?.metrics || {};
  const evm = data?.evm || {};
  const issues = data?.criticalIssues || [];
  const progress = data?.overallProgress || 0;
  const schedStatus = data?.scheduleStatus || 'On Schedule';
  const budStatus = data?.budgetStatus || 'On Budget';

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Module 6: Project Performance Dashboard</h1>
          <p className="page-subtitle">
            Integrated Project Management Information System (PMIS) health & performance control center.
          </p>
        </div>
        <button className="btn-secondary" onClick={loadPerformance}>
          <RefreshCw size={16} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadPerformance} />}

      {/* Main Performance Dashboard Card (Matching Wireframe 6.4) */}
      <div className="content-card" style={{ border: '2px solid var(--border-color)', marginBottom: '2rem' }}>
        <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>PROJECT PERFORMANCE DASHBOARD</h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Project: <strong>{currentProject.projectName}</strong> ({currentProject.projectId})
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className={`badge ${schedStatus.includes('Delay') || schedStatus.includes('Risk') ? 'badge-warning' : 'badge-success'}`}>
                Schedule: {schedStatus}
              </span>
              <span className={`badge ${budStatus.includes('Over') || budStatus.includes('Critical') ? 'badge-danger' : 'badge-success'}`}>
                Budget: {budStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar Row */}
        <div style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 600 }}>Overall Project Progress:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-color)' }}>
              {progress}%
            </span>
          </div>
          <div className="progress-bar-container" style={{ height: '14px' }}>
            <div
              className="progress-bar-fill"
              style={{
                width: `${progress}%`,
                background: progress === 100 ? 'var(--success-color)' : 'var(--primary-color)'
              }}
            />
          </div>
        </div>

        {/* 4-Column Stat Box (Activities | Delayed | Changes | Defects) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            borderBottom: '1px solid var(--border-color)',
            textAlign: 'center'
          }}
        >
          <div style={{ padding: '1.25rem', borderRight: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Activities
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>
              {m.activitiesCount || 0}
            </div>
          </div>

          <div style={{ padding: '1.25rem', borderRight: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Delayed
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: (m.delayedActivities || 0) > 0 ? 'var(--danger-color)' : 'inherit' }}>
              {m.delayedActivities || 0}
            </div>
          </div>

          <div style={{ padding: '1.25rem', borderRight: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Changes
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: (m.pendingChanges || 0) > 0 ? '#eab308' : 'inherit' }}>
              {m.changeRequestsCount || 0}
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '4px' }}>
                ({m.pendingChanges || 0} pend)
              </span>
            </div>
          </div>

          <div style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Defects
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: (m.criticalDefects || 0) > 0 ? 'var(--danger-color)' : 'inherit' }}>
              {m.defectsCount || 0}
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--danger-color)', marginLeft: '4px' }}>
                ({m.criticalDefects || 0} crit)
              </span>
            </div>
          </div>
        </div>

        {/* EVM Section */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} /> EARNED VALUE MANAGEMENT (EVM)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            <div className="stat-card" style={{ padding: '0.75rem' }}>
              <div className="stat-label">Planned Value (PV)</div>
              <div className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--primary-color)' }}>
                Rs. {(evm.pv || 0).toLocaleString()}
              </div>
            </div>

            <div className="stat-card" style={{ padding: '0.75rem' }}>
              <div className="stat-label">Earned Value (EV)</div>
              <div className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--info-color, #38bdf8)' }}>
                Rs. {(evm.ev || 0).toLocaleString()}
              </div>
            </div>

            <div className="stat-card" style={{ padding: '0.75rem' }}>
              <div className="stat-label">Actual Cost (AC)</div>
              <div className="stat-value" style={{ fontSize: '1.25rem', color: (evm.ac || 0) > (evm.ev || 0) ? 'var(--danger-color)' : 'inherit' }}>
                Rs. {(evm.ac || 0).toLocaleString()}
              </div>
            </div>

            <div className="stat-card" style={{ padding: '0.75rem' }}>
              <div className="stat-label">CPI (EV / AC)</div>
              <div className="stat-value" style={{ fontSize: '1.25rem', color: (evm.cpi || 1) < 0.9 ? 'var(--danger-color)' : 'var(--success-color)' }}>
                {(evm.cpi || 1).toFixed(2)} {(evm.cpi || 1) < 1 ? '⚠' : '✓'}
              </div>
            </div>

            <div className="stat-card" style={{ padding: '0.75rem' }}>
              <div className="stat-label">SPI (EV / PV)</div>
              <div className="stat-value" style={{ fontSize: '1.25rem', color: (evm.spi || 1) < 0.9 ? 'var(--danger-color)' : 'var(--success-color)' }}>
                {(evm.spi || 1).toFixed(2)} {(evm.spi || 1) < 1 ? '⚠' : '✓'}
              </div>
            </div>
          </div>
        </div>

        {/* Critical Issues Section */}
        <div style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} /> CRITICAL ISSUES & BOTTLENECKS
          </h3>

          {issues.length === 0 ? (
            <div style={{ color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <CheckCircle2 size={16} /> All project indicators healthy. Zero critical defects, risks, or overdue delays detected.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {issues.map((issue, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.6rem 0.9rem',
                    borderRadius: '6px',
                    background: issue.includes('🔴') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                    borderLeft: `4px solid ${issue.includes('🔴') ? 'var(--danger-color)' : '#eab308'}`,
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }}
                >
                  {issue}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Module Traceability Summary Card */}
      <div className="content-card">
        <h3>PMIS Traceability & Integration Chain</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          End-to-end data integrity across all 6 project modules:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="stat-card">
            <div className="stat-label">Module 1: Initiation</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '4px' }}>
              {currentProject.status || 'Active'}
            </div>
            <div className="stat-hint">Budget: Rs. {Number(currentProject.approvedBudget || currentProject.budget || 0).toLocaleString()}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Module 2: Scope & WBS</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '4px' }}>
              {m.approvedRequirementsCount || 0} / {m.requirementsCount || 0} Approved
            </div>
            <div className="stat-hint">{m.wbsNodesCount || 0} WBS Nodes Hierarchically Linked</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Module 3: Schedule</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '4px' }}>
              {m.activitiesCount || 0} Activities Tracked
            </div>
            <div className="stat-hint">{m.delayedActivities || 0} Delays Propagated</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Module 4: Cost & EVM</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '4px' }}>
              CPI: {(evm.cpi || 1).toFixed(2)} | SPI: {(evm.spi || 1).toFixed(2)}
            </div>
            <div className="stat-hint">Expenditure: Rs. {(evm.ac || 0).toLocaleString()}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Module 5: Quality & Risk</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '4px' }}>
              {m.defectsCount || 0} Defects | {m.risksCount || 0} Risks
            </div>
            <div className="stat-hint">{m.criticalRisks || 0} Critical Unmitigated Risks</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationDashboard;
