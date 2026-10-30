import React from 'react';
import { Calendar, User, Edit2, Trash2, CheckCircle2, Clock, PlayCircle, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const MilestoneCard = ({ milestone, onEdit, onDelete }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="badge badge-completed"><CheckCircle2 size={12} /> Completed</span>;
      case 'In Progress':
        return <span className="badge badge-in-progress"><PlayCircle size={12} /> In Progress</span>;
      case 'Delayed':
        return <span className="badge badge-at-risk"><AlertCircle size={12} /> Delayed</span>;
      default:
        return <span className="badge badge-planning"><Clock size={12} /> Pending</span>;
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1rem',
        borderLeft: `4px solid ${
          milestone.status === 'Completed'
            ? 'var(--accent-emerald)'
            : milestone.status === 'In Progress'
            ? 'var(--accent-cyan)'
            : milestone.status === 'Delayed'
            ? 'var(--accent-rose)'
            : 'var(--primary)'
        }`
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--primary)',
              background: 'rgba(99, 102, 241, 0.1)',
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              fontWeight: 600
            }}
          >
            {milestone.milestoneId}
          </span>
          {getStatusBadge(milestone.status)}
        </div>

        <h4 style={{ color: 'var(--text-main)', fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.4rem' }}>
          {milestone.title}
        </h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
          {milestone.description || 'No milestone description provided.'}
        </p>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
          <span style={{ color: 'var(--text-dim)' }}>Progress</span>
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{milestone.progress || 0}%</span>
        </div>
        <div className="progress-container" style={{ height: '6px' }}>
          <div
            className={`progress-bar-fill ${milestone.status === 'Completed' ? 'success' : ''}`}
            style={{ width: `${milestone.progress || 0}%` }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.8rem'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={13} /> Due: {formatDate(milestone.dueDate)}
            </span>
            <span style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <User size={13} /> {milestone.responsiblePerson}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              type="button"
              className="list-item-delete-btn"
              onClick={() => onEdit(milestone)}
              title="Edit Milestone"
              style={{ color: 'var(--text-muted)' }}
            >
              <Edit2 size={16} />
            </button>
            <button
              type="button"
              className="list-item-delete-btn"
              onClick={() => onDelete(milestone)}
              title="Delete Milestone"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneCard;
