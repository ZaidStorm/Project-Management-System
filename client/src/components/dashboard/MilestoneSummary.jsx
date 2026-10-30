import React from 'react';
import { CheckCircle2, Clock, PlayCircle, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const MilestoneSummary = ({ milestones = [] }) => {
  const getMilestoneIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 size={16} color="var(--accent-emerald)" />;
      case 'In Progress':
        return <PlayCircle size={16} color="var(--accent-cyan)" />;
      case 'Delayed':
        return <AlertCircle size={16} color="var(--accent-rose)" />;
      default:
        return <Clock size={16} color="var(--text-dim)" />;
    }
  };

  return (
    <div className="section-card glass-panel">
      <div className="section-card-header">
        <h3 className="section-card-title">Key Milestones Tracking</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {milestones.filter((m) => m.status === 'Completed').length} / {milestones.length} Completed
        </span>
      </div>

      {milestones.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-dim)' }}>
          No milestones defined yet. Add milestones in the Milestones section.
        </div>
      ) : (
        <div className="timeline-list">
          {milestones.slice(0, 5).map((m) => (
            <div key={m._id || m.milestoneId} className="milestone-item">
              <div className={`milestone-indicator ${m.status?.toLowerCase().replace(' ', '-')}`}>
                {getMilestoneIcon(m.status)}
              </div>
              <div className="milestone-content">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div className="milestone-title">{m.title}</div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: m.status === 'Completed' ? 'var(--accent-emerald)' : 'var(--accent-cyan)'
                    }}
                  >
                    {m.progress || 0}%
                  </span>
                </div>
                <div className="milestone-meta">
                  <span>Due: {formatDate(m.dueDate)}</span>
                  <span>Owner: {m.responsiblePerson}</span>
                  <span
                    className={`badge badge-${m.status?.toLowerCase().replace(' ', '-')}`}
                    style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}
                  >
                    {m.status}
                  </span>
                </div>
                <div className="progress-container" style={{ height: '4px', marginTop: '0.5rem' }}>
                  <div
                    className={`progress-bar-fill ${m.status === 'Completed' ? 'success' : ''}`}
                    style={{ width: `${m.progress || 0}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MilestoneSummary;
