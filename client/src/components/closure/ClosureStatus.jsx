import React from 'react';
import { CheckCircle2, Clock, XCircle, Archive } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const ClosureStatus = ({ approvalStatus = 'Pending', finalStatus = 'Completed', closureDate, approvedBy }) => {
  const getApprovalBadge = () => {
    switch (approvalStatus) {
      case 'Approved':
        return <span className="badge badge-approved"><CheckCircle2 size={14} /> Formal Closure Approved</span>;
      case 'Rejected':
        return <span className="badge badge-at-risk"><XCircle size={14} /> Closure Sign-Off Rejected</span>;
      default:
        return <span className="badge badge-in-progress"><Clock size={14} /> Closure Sign-Off Pending</span>;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}
    >
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          Project Closure Status
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {getApprovalBadge()}
          <span className="badge badge-draft">Classification: {finalStatus}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {approvedBy && (
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Approved By
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>{approvedBy}</div>
          </div>
        )}
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Effective Closure Date
          </div>
          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
            {formatDate(closureDate)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClosureStatus;
