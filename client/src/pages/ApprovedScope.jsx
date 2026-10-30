import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Clock, AlertCircle, ArrowRight, Layers, PlusCircle } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { requirementService } from '../services/requirementService';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';

const ApprovedScopePage = () => {
  const { currentProject } = useProjects();
  const navigate = useNavigate();

  const [approvedScope, setApprovedScope] = useState([]);
  const [allRequirements, setAllRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScopeData = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      setError(null);
      // Fetch strictly from /api/projects/:projectId/scope (backend-enforced)
      const [scopeRes, allRes] = await Promise.all([
        requirementService.getApprovedScope(currentProject.projectId),
        requirementService.getAll(currentProject.projectId)
      ]);
      setApprovedScope(scopeRes.data || []);
      setAllRequirements(allRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load approved scope');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScopeData();
  }, [currentProject]);

  if (!currentProject) {
    return (
      <div className="page-body">
        <div className="section-card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No project selected. Please choose a project or create a new one.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading message="Loading official approved project scope baseline..." />;
  }

  if (error) {
    return (
      <div className="page-body">
        <ErrorMessage message={error} onRetry={fetchScopeData} />
      </div>
    );
  }

  const pendingRequirements = allRequirements.filter((r) => r.approvalStatus !== 'Approved');

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'Critical':
        return <span className="badge badge-at-risk">Critical</span>;
      case 'High':
        return <span className="badge badge-on-hold">High</span>;
      case 'Medium':
        return <span className="badge badge-planning">Medium</span>;
      default:
        return <span className="badge badge-draft">Low</span>;
    }
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <ShieldCheck color="var(--accent-emerald)" size={28} />
            Approved Project Scope
          </h1>
          <p>
            Official scope baseline. Only requirements with verified "Approved" status are included and permitted in the WBS.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" icon={Layers} onClick={() => navigate('/wbs')}>
            Open WBS Builder
          </Button>
          <Button variant="primary" icon={PlusCircle} onClick={() => navigate('/requirements')}>
            Manage Requirements
          </Button>
        </div>
      </div>

      {/* Scope Control Rule Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          borderLeft: '4px solid var(--accent-emerald)',
          background: 'rgba(16, 185, 129, 0.05)'
        }}
      >
        <ShieldCheck size={24} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
            Strict Scope Control Enforcement Active
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Unapproved or Draft requirements cannot enter the WBS or Work Package decomposition until formally approved by the Project Sponsor.
          </div>
        </div>
      </div>

      {/* Main Spec Wireframe Card */}
      <div
        className="glass-panel"
        style={{
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}
      >
        {/* Approved Scope Section */}
        <div
          style={{
            padding: '1.5rem 2rem',
            background: 'rgba(15, 23, 42, 0.85)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} />
              APPROVED PROJECT SCOPE ({approvedScope.length})
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Project: [{currentProject.projectId}] {currentProject.projectName}
            </div>
          </div>
          <span className="badge badge-approved">Baseline Active</span>
        </div>

        <div style={{ padding: '2rem' }}>
          {approvedScope.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-dim)' }}>
              No requirements approved into the scope yet. Go to Requirements to review and approve candidate user stories.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {approvedScope.map((req) => (
                <div
                  key={req.requirementId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(16, 185, 129, 0.03)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: '240px' }}>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '1.1rem' }}>✓</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        color: 'var(--primary)',
                        background: 'rgba(99, 102, 241, 0.1)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        fontWeight: 600
                      }}
                    >
                      {req.requirementId}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        {req.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {req.description}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      Approved by: {req.approvedBy || 'Project Sponsor'}
                    </span>
                    {getPriorityBadge(req.priority)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Requirements Section */}
        <div
          style={{
            padding: '1.5rem 2rem',
            background: 'rgba(10, 15, 29, 0.6)',
            borderTop: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} />
            Pending Requirements ({pendingRequirements.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Excluded from Scope until authorized
          </span>
        </div>

        <div style={{ padding: '2rem', background: 'rgba(10, 15, 29, 0.3)' }}>
          {pendingRequirements.length === 0 ? (
            <div style={{ padding: '1rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              No pending unapproved requirements.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {pendingRequirements.map((req) => (
                <div
                  key={req.requirementId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1 }}>
                    <span style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>○</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        color: 'var(--text-dim)',
                        background: 'var(--bg-tertiary)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px'
                      }}
                    >
                      {req.requirementId}
                    </span>
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        {req.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Status: {req.approvalStatus} • Requested: {req.requestedBy || 'Team'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {getPriorityBadge(req.priority)}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => navigate('/requirements')}
                      style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovedScopePage;
