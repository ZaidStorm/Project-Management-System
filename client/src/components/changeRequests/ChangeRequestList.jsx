import React from 'react';
import { Check, X, Edit2, AlertCircle, Clock, CheckCircle2, DollarSign, Calendar } from 'lucide-react';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';

const ChangeRequestList = ({ changeRequests = [], onEdit, onApprove, onReject }) => {
  const getApprovalBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="badge badge-approved"><CheckCircle2 size={12} /> Approved</span>;
      case 'Rejected':
        return <span className="badge badge-at-risk"><AlertCircle size={12} /> Rejected</span>;
      default:
        return <span className="badge badge-in-progress"><Clock size={12} /> Under Review</span>;
    }
  };

  if (changeRequests.length === 0) {
    return (
      <div className="section-card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>No Change Requests submitted yet.</p>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
          Use the "+ New Change Request" button to log customer changes and perform impact analyses.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {changeRequests.map((cr) => (
        <div
          key={cr._id || cr.changeRequestId}
          className="section-card glass-panel"
          style={{
            borderLeft: `4px solid ${
              cr.approvalStatus === 'Approved'
                ? 'var(--accent-emerald)'
                : cr.approvalStatus === 'Rejected'
                ? 'var(--accent-rose)'
                : 'var(--primary)'
            }`
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--primary)',
                    background: 'var(--primary-tint)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    fontWeight: 600
                  }}
                >
                  {cr.changeRequestId}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {cr.title}
                </h3>
                {getApprovalBadge(cr.approvalStatus)}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                {cr.description}
              </p>
            </div>

            {/* Actions: Approve / Reject / Edit */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {cr.approvalStatus !== 'Approved' && (
                <Button
                  size="sm"
                  variant="primary"
                  icon={Check}
                  onClick={() => onApprove(cr)}
                  title="Approve and Propagate to Scope & WBS"
                >
                  Approve
                </Button>
              )}
              {cr.approvalStatus !== 'Rejected' && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onReject(cr)}
                  style={{ color: 'var(--accent-rose)' }}
                  title="Reject Change Request"
                >
                  <X size={14} /> Reject
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onEdit(cr)}
                title="Edit Change Request"
              >
                <Edit2 size={14} /> Edit
              </button>
            </div>
          </div>

          {/* Impact Analysis Details Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.825rem'
            }}
          >
            <div>
              <span style={{ color: 'var(--text-dim)' }}>Cost Impact:</span>{' '}
              <strong style={{ color: cr.costImpact > 0 ? 'var(--accent-amber)' : '#fff' }}>
                +{formatCurrency(cr.costImpact)}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-dim)' }}>Schedule Impact:</span>{' '}
              <strong style={{ color: cr.scheduleImpact > 0 ? 'var(--accent-cyan)' : '#fff' }}>
                +{cr.scheduleImpact} Days
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-dim)' }}>Resource Impact:</span>{' '}
              <span style={{ color: 'var(--text-main)' }}>{cr.resourceImpact || 'None identified'}</span>
            </div>

            <div>
              <span style={{ color: 'var(--text-dim)' }}>Requested By:</span>{' '}
              <span style={{ color: 'var(--text-main)' }}>{cr.requestedBy}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChangeRequestList;
