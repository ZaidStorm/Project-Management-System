import React from 'react';
import { formatDate } from '../../utils/formatDate';

const GanttChart = ({ activities = [] }) => {
  if (activities.length === 0) {
    return (
      <div className="section-card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>No activities scheduled for Gantt chart rendering.</p>
      </div>
    );
  }

  // Calculate project overall timeline range
  const dates = activities.flatMap((a) => [new Date(a.startDate).getTime(), new Date(a.endDate).getTime()]);
  const minTime = Math.min(...dates);
  const maxTime = Math.max(...dates);
  const totalDuration = Math.max(1, maxTime - minTime);

  return (
    <div className="section-card glass-panel" style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: '700px' }}>
        {/* Timeline Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '220px 1fr 100px',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase'
          }}
        >
          <div>Activity / Task</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{formatDate(minTime)}</span>
            <span>Project Schedule Timeline</span>
            <span>{formatDate(maxTime)}</span>
          </div>
          <div style={{ textAlign: 'right' }}>Status</div>
        </div>

        {/* Timeline Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1rem' }}>
          {activities.map((act) => {
            const start = new Date(act.startDate).getTime();
            const end = new Date(act.endDate).getTime();
            const leftPct = Math.max(0, Math.min(100, ((start - minTime) / totalDuration) * 100));
            const widthPct = Math.max(3, Math.min(100 - leftPct, ((end - start) / totalDuration) * 100));

            const isOverdue = act.status !== 'Completed' && new Date() > new Date(act.endDate);

            return (
              <div
                key={act.activityId}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '220px 1fr 100px',
                  alignItems: 'center',
                  fontSize: '0.85rem'
                }}
              >
                {/* Title & Code */}
                <div style={{ paddingRight: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--primary)', marginRight: '0.4rem', fontWeight: 700 }}>
                    {act.activityId}
                  </span>
                  <strong style={{ color: 'var(--text-main)' }}>{act.name}</strong>
                </div>

                {/* Bar */}
                <div
                  style={{
                    position: 'relative',
                    height: '24px',
                    background: '#f1f5f9',
                    borderRadius: '4px'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      height: '100%',
                      background: isOverdue
                        ? 'linear-gradient(90deg, #dc2626 0%, #f87171 100%)'
                        : act.status === 'Completed'
                        ? 'linear-gradient(90deg, #16a34a 0%, #22c55e 100%)'
                        : 'var(--primary-gradient)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 0.5rem',
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      overflow: 'hidden'
                    }}
                    title={`${act.name}: ${formatDate(act.startDate)} to ${formatDate(act.endDate)} (${act.progress}%)`}
                  >
                    <span>{act.progress || 0}%</span>
                    <span>{act.duration || 1}d</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge badge-${(act.status || 'not-started').toLowerCase().replace(' ', '-')}`} style={{ fontSize: '0.7rem' }}>
                    {isOverdue ? 'Overdue' : act.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
