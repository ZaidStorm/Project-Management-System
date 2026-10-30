import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { formatDate, toInputDateFormat } from '../../utils/formatDate';

const SchedulePlan = ({ data = {}, onChange, isEditing = false }) => {
  if (!isEditing) {
    const phases = [
      {
        name: 'Development Phase',
        start: data.developmentStart,
        end: data.developmentEnd,
        color: 'var(--primary)'
      },
      {
        name: 'Quality & Testing Phase',
        start: data.testingStart,
        end: data.testingEnd,
        color: 'var(--accent-cyan)'
      },
      {
        name: 'Deployment & Release Target',
        start: data.deploymentDate,
        end: data.deploymentDate,
        color: 'var(--accent-emerald)',
        singleDate: true
      }
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="section-card glass-panel">
          <h4 className="section-card-title">Project Schedule Milestones & Phases</h4>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
              marginTop: '1rem'
            }}
          >
            {phases.map((phase) => (
              <div
                key={phase.name}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  borderTop: `3px solid ${phase.color}`
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                  {phase.name}
                </div>
                {phase.singleDate ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: phase.color }}>
                    <Calendar size={16} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{formatDate(phase.start)}</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Start:</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{formatDate(phase.start)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Target Finish:</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{formatDate(phase.end)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {data.scheduleNotes && (
          <div className="section-card glass-panel">
            <h4 className="section-card-title">Schedule Notes & Critical Path Considerations</h4>
            <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {data.scheduleNotes}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="section-card glass-panel">
      <h4 className="section-card-title">Edit Project Schedule Plan</h4>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Development Start Date</label>
          <input
            type="date"
            className="form-input"
            value={toInputDateFormat(data.developmentStart)}
            onChange={(e) =>
              onChange({
                ...data,
                developmentStart: e.target.value ? new Date(e.target.value) : undefined
              })
            }
          />
        </div>
        <div className="form-group">
          <label className="form-label">Development End Date</label>
          <input
            type="date"
            className="form-input"
            value={toInputDateFormat(data.developmentEnd)}
            onChange={(e) =>
              onChange({
                ...data,
                developmentEnd: e.target.value ? new Date(e.target.value) : undefined
              })
            }
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Testing Start Date</label>
          <input
            type="date"
            className="form-input"
            value={toInputDateFormat(data.testingStart)}
            onChange={(e) =>
              onChange({
                ...data,
                testingStart: e.target.value ? new Date(e.target.value) : undefined
              })
            }
          />
        </div>
        <div className="form-group">
          <label className="form-label">Testing End Date</label>
          <input
            type="date"
            className="form-input"
            value={toInputDateFormat(data.testingEnd)}
            onChange={(e) =>
              onChange({
                ...data,
                testingEnd: e.target.value ? new Date(e.target.value) : undefined
              })
            }
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Official Deployment Target Date</label>
          <input
            type="date"
            className="form-input"
            value={toInputDateFormat(data.deploymentDate)}
            onChange={(e) =>
              onChange({
                ...data,
                deploymentDate: e.target.value ? new Date(e.target.value) : undefined
              })
            }
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Schedule Assumptions & Critical Path Notes</label>
        <textarea
          className="form-textarea"
          rows="3"
          placeholder="Dependencies, critical path constraints, lead times..."
          value={data.scheduleNotes || ''}
          onChange={(e) => onChange({ ...data, scheduleNotes: e.target.value })}
        />
      </div>
    </div>
  );
};

export default SchedulePlan;
