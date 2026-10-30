import React from 'react';
import { Check, X, Edit2, Trash2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../common/Button';

const RequirementList = ({ requirements = [], onEdit, onDelete, onApprove, onReject }) => {
  const getPriorityBadge = (p) => {
    switch (p) {
      case 'Critical':
        return <span className="badge badge-at-risk">Critical</span>;
      case 'High':
        return <span className="badge badge-on-hold">High</span>;
      case 'Medium':
        return <span className="badge badge-planning">Medium</span>;
      default:
        return <span className="badge badge-draft">Low</span>;
    }
  };

  const getApprovalBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="badge badge-approved" style={{ gap: '0.25rem' }}>
            <CheckCircle2 size={12} /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="badge badge-at-risk" style={{ gap: '0.25rem' }}>
            <AlertCircle size={12} /> Rejected
          </span>
        );
      case 'Under Review':
        return (
          <span className="badge badge-in-progress" style={{ gap: '0.25rem' }}>
            <Clock size={12} /> Under Review
          </span>
        );
      default:
        return (
          <span className="badge badge-draft" style={{ gap: '0.25rem' }}>
            Draft
          </span>
        );
    }
  };

  if (requirements.length === 0) {
    return (
      <div className="section-card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>No requirements registered yet.</p>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
          Add requirements using the "+ New Requirement" button to initiate project scope planning.
        </p>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID & Title</th>
            <th>Type</th>
            <th>Priority</th>
            <th>Approval Status</th>
            <th>Owner / Requested By</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requirements.map((req) => (
            <tr key={req._id || req.requirementId}>
              <td>
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--primary)',
                      background: 'var(--primary-tint)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      fontWeight: 700,
                      display: 'inline-block',
                      marginBottom: '0.25rem',
                      border: '1px solid #ffedd5'
                    }}
                  >
                    {req.requirementId}
                  </span>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                    {req.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      maxWidth: '320px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {req.description}
                  </div>
                </div>
              </td>
              <td>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--accent-cyan)',
                    background: 'rgba(6, 182, 212, 0.08)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px'
                  }}
                >
                  {req.type}
                </span>
              </td>
              <td>{getPriorityBadge(req.priority)}</td>
              <td>{getApprovalBadge(req.approvalStatus)}</td>
              <td>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  {req.assignedTo || 'Unassigned'}
                </div>
                {req.requestedBy && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Req: {req.requestedBy}
                  </div>
                )}
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  {req.approvalStatus !== 'Approved' && (
                    <Button
                      size="sm"
                      variant="primary"
                      icon={Check}
                      onClick={() => onApprove(req)}
                      title="Approve Requirement into Official Scope"
                      style={{ padding: '0.25rem 0.5rem' }}
                    >
                      Approve
                    </Button>
                  )}
                  {req.approvalStatus !== 'Rejected' && (
                    <button
                      type="button"
                      className="list-item-delete-btn"
                      onClick={() => onReject(req)}
                      title="Reject Requirement"
                      style={{ color: 'var(--accent-rose)' }}
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    className="list-item-delete-btn"
                    onClick={() => onEdit(req)}
                    title="Edit Requirement"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    className="list-item-delete-btn"
                    onClick={() => onDelete(req)}
                    title="Delete Requirement"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequirementList;
