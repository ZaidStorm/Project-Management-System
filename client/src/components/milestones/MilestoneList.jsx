import React from 'react';
import MilestoneCard from './MilestoneCard';

const MilestoneList = ({ milestones = [], onEdit, onDelete }) => {
  if (milestones.length === 0) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '3rem 1.5rem',
          textAlign: 'center',
          color: 'var(--text-muted)'
        }}
      >
        <p style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 600 }}>No Milestones Configured Yet</p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.35rem' }}>
          Create key delivery dates and assign responsibilities to track progress across Module 1.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}
    >
      {milestones.map((m) => (
        <MilestoneCard
          key={m._id || m.milestoneId}
          milestone={m}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default MilestoneList;
