import React from 'react';
import { Target, Users, Shield, Edit3, DollarSign, Calendar, User } from 'lucide-react';
import CharterStatus from './CharterStatus';
import StakeholderList from './StakeholderList';
import ScopeSection from './ScopeSection';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const CharterDetails = ({ charter, onEdit }) => {
  if (!charter) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Status banner with quick Edit button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <CharterStatus
            status={charter.approvalStatus}
            approvalDate={charter.approvalDate}
            approvedBy={charter.approvedBy}
          />
        </div>
        <Button variant="primary" icon={Edit3} onClick={onEdit}>
          Edit Project Charter
        </Button>
      </div>

      {/* Core Project Charter Meta Summary */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Project Type
          </div>
          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            {charter.projectType || 'Software Development'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Client / Sponsor
          </div>
          <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            {charter.client || 'Network of Five Hospitals'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Project Manager
          </div>
          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            {charter.projectManager || 'Project Manager'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Priority
          </div>
          <div style={{ marginTop: '0.2rem' }}>
            <span className="badge badge-at-risk">{charter.priority || 'High'}</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Approved Budget (Base)
          </div>
          <div style={{ fontWeight: 600, color: 'var(--accent-emerald)', fontSize: '1rem', marginTop: '0.2rem' }}>
            {formatCurrency(charter.approvedBudget || 5000000)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Change Cost (CR-001)
          </div>
          <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '1rem', marginTop: '0.2rem' }}>
            +{formatCurrency(charter.changeCost || 800000)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Revised Total Budget
          </div>
          <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem', marginTop: '0.2rem' }}>
            {formatCurrency(charter.revisedBudget || 5800000)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Duration (Base / Revised)
          </div>
          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            {charter.originalDuration || '16 Weeks'} ➔ <span style={{ color: 'var(--primary)' }}>{charter.revisedDuration || '19 Weeks'}</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Original Deadline
          </div>
          <div style={{ fontWeight: 500, color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            {formatDate(charter.originalDeadline || '2027-02-16')}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Revised Deadline
          </div>
          <div style={{ fontWeight: 700, color: 'var(--accent-rose)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            {formatDate(charter.revisedDeadline || charter.deadline || '2027-03-09')}
          </div>
        </div>
      </div>

      {/* Project Objectives */}
      <div className="section-card glass-panel">
        <div className="section-card-header">
          <h3 className="section-card-title">
            <Target size={20} color="var(--primary)" />
            Project Objectives
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {charter.objectives?.length || 0} Objectives Established
          </span>
        </div>
        {(!charter.objectives || charter.objectives.length === 0) ? (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            No objectives defined yet. Click "Edit Project Charter" to specify measurable project goals.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {charter.objectives.map((obj, i) => (
              <div
                key={i}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#f8fafc',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                <span
                  style={{
                    background: 'var(--primary-glow)',
                    color: 'var(--primary)',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{obj}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stakeholders Matrix */}
      <div className="section-card glass-panel">
        <div className="section-card-header">
          <h3 className="section-card-title">
            <Users size={20} color="var(--accent-cyan)" />
            Key Stakeholders
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {charter.stakeholders?.length || 0} Registered Stakeholders
          </span>
        </div>
        <StakeholderList stakeholders={charter.stakeholders} isEditing={false} />
      </div>

      {/* Scope Boundaries */}
      <div className="section-card glass-panel">
        <div className="section-card-header">
          <h3 className="section-card-title">
            <Shield size={20} color="var(--accent-emerald)" />
            Project Scope Boundaries
          </h3>
        </div>
        <ScopeSection
          inScope={charter.inScope}
          outOfScope={charter.outOfScope}
          assumptions={charter.assumptions}
          constraints={charter.constraints}
        />
      </div>
    </div>
  );
};

export default CharterDetails;
