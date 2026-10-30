import React from 'react';
import { Calendar, User, DollarSign, Clock, Layers } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

const ProjectSummary = ({ project }) => {
  if (!project) return null;

  const getStatusClass = (status) => {
    switch (status) {
      case 'In Progress':
        return 'badge-in-progress';
      case 'Completed':
        return 'badge-completed';
      case 'On Hold':
        return 'badge-on-hold';
      case 'At Risk':
        return 'badge-at-risk';
      default:
        return 'badge-planning';
    }
  };

  return (
    <div className="section-card glass-panel">
      <div className="section-card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--primary)',
                background: 'var(--primary-tint)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontWeight: 700,
                border: '1px solid #ffedd5'
              }}
            >
              {project.projectId}
            </span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {project.projectName}
            </h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
            {project.description || 'No detailed project description recorded.'}
          </p>
        </div>
        <span className={`badge ${getStatusClass(project.status)}`}>
          ● {project.status || 'Planning'}
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.25rem',
          marginTop: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src="/pm-avatar.png"
            alt="Project Manager"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--primary, #ea580c)'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/user-zaid.jpg';
            }}
          />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Project Manager
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
              {project.projectManager}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              background: '#f0fdfa',
              color: 'var(--accent-teal)'
            }}
          >
            <Calendar size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Start Date
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
              {formatDate(project.startDate)}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              background: '#eff6ff',
              color: 'var(--accent-cyan)'
            }}
          >
            <Layers size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Client / Sponsor
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
              {project.client || 'Network of Five Hospitals'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              background: '#fff7ed',
              color: 'var(--primary)'
            }}
          >
            <Clock size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Duration (Original ➔ Revised)
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
              {project.originalDuration || '16 Weeks'} ➔ <span style={{ color: 'var(--primary)' }}>{project.revisedDuration || '19 Weeks'}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              background: '#fef2f2',
              color: 'var(--accent-rose)'
            }}
          >
            <Clock size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Revised Deadline
            </div>
            <div style={{ fontWeight: 700, color: 'var(--accent-rose)', fontSize: '0.9rem' }}>
              {formatDate(project.revisedDeadline || project.deadline)}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              background: '#f0fdf4',
              color: 'var(--accent-emerald)'
            }}
          >
            <DollarSign size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Revised Budget (Base + Change)
            </div>
            <div style={{ fontWeight: 700, color: 'var(--accent-emerald)', fontSize: '0.95rem' }}>
              {formatCurrency(project.revisedBudget || 5800000)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Base: {formatCurrency(project.approvedBudget)} {project.changeCost > 0 ? `(+${formatCurrency(project.changeCost)})` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSummary;
