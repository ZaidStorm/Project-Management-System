import React from 'react';
import { CheckCircle2, AlertTriangle, BookOpen, Edit3, DollarSign, Award } from 'lucide-react';
import ClosureStatus from './ClosureStatus';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const ClosureDetails = ({ closure, onEdit }) => {
  if (!closure) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <ClosureStatus
            approvalStatus={closure.approvalStatus}
            finalStatus={closure.finalStatus}
            closureDate={closure.closureDate}
            approvedBy={closure.approvedBy}
          />
        </div>
        <Button variant="primary" icon={Edit3} onClick={onEdit}>
          Edit Project Closure
        </Button>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <div className="section-card glass-panel" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Final Progress Achieved
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.35rem' }}>
            {closure.finalProgress || 100}%
          </div>
        </div>

        <div className="section-card glass-panel" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Final Realized Expenditure
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.35rem' }}>
            {formatCurrency(closure.finalBudget)}
          </div>
        </div>

        <div className="section-card glass-panel" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Formal Sign-Off
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.5rem' }}>
            {closure.approvedBy || 'Pending Formal Approval'}
          </div>
        </div>
      </div>

      {/* Lessons Learned */}
      <div className="section-card glass-panel">
        <div className="section-card-header">
          <h3 className="section-card-title" style={{ color: 'var(--accent-amber)' }}>
            <BookOpen size={20} />
            Lessons Learned & Organizational Process Assets
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {closure.lessonsLearned?.length || 0} Key Insights Documented
          </span>
        </div>
        {(!closure.lessonsLearned || closure.lessonsLearned.length === 0) ? (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            No lessons learned documented yet. Capture insights, risks encountered, and process improvements for future modules.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {closure.lessonsLearned.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.05)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                <span style={{ color: 'var(--accent-amber)', fontWeight: 700, marginTop: '2px' }}>
                  #{i + 1}
                </span>
                <span style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deliverables vs Pending Items */}
      <div className="dashboard-full-grid">
        <div className="section-card glass-panel">
          <h3 className="section-card-title" style={{ color: 'var(--accent-emerald)' }}>
            <CheckCircle2 size={20} />
            Deliverables Completed & Accepted
          </h3>
          {(!closure.deliverablesCompleted || closure.deliverablesCompleted.length === 0) ? (
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>None recorded.</p>
          ) : (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {closure.deliverablesCompleted.map((del, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--accent-emerald)' }}>✓</span>
                  <span>{del}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="section-card glass-panel">
          <h3 className="section-card-title" style={{ color: 'var(--accent-rose)' }}>
            <AlertTriangle size={20} />
            Pending Handover / Post-Closure Items
          </h3>
          {(!closure.pendingItems || closure.pendingItems.length === 0) ? (
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No pending items. Project is 100% cleanly wrapped up.</p>
          ) : (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {closure.pendingItems.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--accent-rose)' }}>!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Closure Notes */}
      {closure.closureNotes && (
        <div className="section-card glass-panel">
          <h3 className="section-card-title">Final Project Closure Notes & Executive Summary</h3>
          <p style={{ color: 'var(--text-main)', fontSize: '0.925rem', lineHeight: '1.6', marginTop: '0.5rem' }}>
            {closure.closureNotes}
          </p>
        </div>
      )}
    </div>
  );
};

export default ClosureDetails;
