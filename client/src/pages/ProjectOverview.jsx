import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  PlayCircle,
  AlertCircle,
  ArrowRight,
  User,
  DollarSign,
  Calendar,
  Activity,
  Compass,
  FileCheck2
} from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { milestoneService } from '../services/milestoneService';
import { statusService } from '../services/statusService';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { formatDate } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';

const ProjectOverview = () => {
  const { currentProject, loading: projLoading } = useProjects();
  const navigate = useNavigate();

  const [milestones, setMilestones] = useState([]);
  const [projectStatus, setProjectStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentProject) {
      setLoading(false);
      return;
    }
    const loadOverview = async () => {
      try {
        setLoading(true);
        const [mRes, sRes] = await Promise.allSettled([
          milestoneService.getByProjectId(currentProject.projectId),
          statusService.getByProjectId(currentProject.projectId)
        ]);

        if (mRes.status === 'fulfilled') setMilestones(mRes.value.data || []);
        if (sRes.status === 'fulfilled') setProjectStatus(sRes.value.data);
      } catch (err) {
        console.error('Failed to load overview:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, [currentProject]);

  if (projLoading || loading) {
    return <Loading message="Loading project overview..." />;
  }

  if (!currentProject) {
    return (
      <div className="page-body">
        <div className="section-card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No project selected. Please choose a project or create a new one.</p>
          <div style={{ marginTop: '1rem' }}>
            <Button variant="primary" onClick={() => navigate('/projects/new')}>
              Create Project
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const progress = projectStatus?.progress || 0;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <span style={{ color: 'var(--accent-emerald)', fontWeight: 'bold' }}>✓</span>;
      case 'In Progress':
        return <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>●</span>;
      case 'Delayed':
        return <span style={{ color: 'var(--accent-rose)', fontWeight: 'bold' }}>✕</span>;
      default:
        return <span style={{ color: 'var(--text-dim)', fontWeight: 'bold' }}>○</span>;
    }
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <FileSpreadsheet color="var(--primary)" size={28} />
            Project Overview
          </h1>
          <p>Consolidated high-level health card, key parameters, and milestone progress</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" icon={FileCheck2} onClick={() => navigate('/charter')}>
            View Charter
          </Button>
          <Button variant="secondary" icon={Compass} onClick={() => navigate('/management-plan')}>
            View Management Plan
          </Button>
        </div>
      </div>

      {/* Main Overview Card Styled to Spec */}
      <div
        className="glass-panel"
        style={{
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '2rem'
        }}
      >
        {/* Card Header Strip */}
        <div
          style={{
            padding: '1.5rem 2rem',
            background: 'rgba(15, 23, 42, 0.9)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--primary)',
                  background: 'rgba(99, 102, 241, 0.1)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontWeight: 600
                }}
              >
                {currentProject.projectId}
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {currentProject.projectName}
              </h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
              {currentProject.description}
            </p>
          </div>

          <span
            className={`badge badge-${(currentProject.status || 'planning').toLowerCase().replace(' ', '-')}`}
            style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}
          >
            ● {currentProject.status}
          </span>
        </div>

        {/* Key Health Parameters */}
        <div
          style={{
            padding: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.75rem',
            background: '#f8fafc',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Overall Status
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {currentProject.status}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Overall Progress
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                {progress}%
              </div>
              <div className="progress-container" style={{ flex: 1, height: '8px' }}>
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Approved Budget
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
              {formatCurrency(currentProject.approvedBudget)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Target Deadline
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
              {formatDate(currentProject.deadline)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Project Manager
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img
                src="/pm-avatar.png"
                alt="Project Manager"
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/user-zaid.jpg';
                }}
              />
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {currentProject.projectManager}
              </span>
            </div>
          </div>
        </div>

        {/* Milestones List Breakdown */}
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Milestones Tracking
            </h3>
            <Button
              size="sm"
              variant="outline"
              icon={ArrowRight}
              onClick={() => navigate('/milestones')}
            >
              Manage Milestones
            </Button>
          </div>

          {milestones.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-dim)' }}>
              No milestones created yet. Go to Milestones to schedule deliverables.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {milestones.map((m) => (
                <div
                  key={m._id || m.milestoneId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: '#f8fafc',
                    border: '1px solid var(--border-subtle)',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '220px' }}>
                    <span style={{ fontSize: '1.1rem', width: '20px' }}>{getStatusIcon(m.status)}</span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        {m.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Due: {formatDate(m.dueDate)} • Owner: {m.responsiblePerson}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '120px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Progress</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{m.progress || 0}%</span>
                      </div>
                      <div className="progress-container" style={{ height: '5px' }}>
                        <div
                          className={`progress-bar-fill ${m.status === 'Completed' ? 'success' : ''}`}
                          style={{ width: `${m.progress || 0}%` }}
                        />
                      </div>
                    </div>

                    <span
                      className={`badge badge-${m.status?.toLowerCase().replace(' ', '-')}`}
                      style={{ minWidth: '100px', justifyContent: 'center' }}
                    >
                      {m.status}
                    </span>
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

export default ProjectOverview;
