import React from 'react';
import { CheckCircle2, AlertCircle, FileEdit, Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const CharterStatus = ({ status = 'Draft', approvalDate, approvedBy }) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'Approved':
        return (
          <span className="badge badge-approved" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
            <CheckCircle2 size={16} /> Approved Charter
          </span>
        );
      case 'Submitted':
        return (
          <span className="badge badge-in-progress" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
            <Clock size={16} /> Submitted for Sign-off
          </span>
        );
      case 'Rejected':
        return (
          <span className="badge badge-at-risk" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
            <AlertCircle size={16} /> Revisions Requested
          </span>
        );
      default:
        return (
          <span className="badge badge-draft" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
            <FileEdit size={16} /> Working Draft
          </span>
        );
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
          Official Charter Authorization Status
        </div>
        {getStatusBadge()}
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
        {approvalDate && (
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Approval Date
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
              {formatDate(approvalDate)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharterStatus;
