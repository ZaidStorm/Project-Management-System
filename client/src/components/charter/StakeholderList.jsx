import React from 'react';
import { UserCheck, Mail, Building, Trash2 } from 'lucide-react';

const StakeholderList = ({ stakeholders = [], onRemove, isEditing = false }) => {
  const getLevelBadge = (level, label) => {
    switch (level) {
      case 'High':
        return <span className="badge badge-at-risk">{label ? `${label}: ` : ''}High</span>;
      case 'Low':
        return <span className="badge badge-draft">{label ? `${label}: ` : ''}Low</span>;
      default:
        return <span className="badge badge-planning">{label ? `${label}: ` : ''}Medium</span>;
    }
  };

  return (
    <div className="data-table-container">
      {stakeholders.length === 0 ? (
        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-dim)' }}>
          No stakeholders identified yet. Add key project sponsors, managers, and team leads.
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name & Role</th>
              <th>Organization</th>
              <th>Interest</th>
              <th>Influence</th>
              <th>Key Responsibility</th>
              {isEditing && <th style={{ textAlign: 'right' }}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {stakeholders.map((sh, idx) => (
              <tr key={sh.stakeholderId || idx}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'var(--primary-tint)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: '0.8rem'
                      }}
                    >
                      {sh.name ? sh.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{sh.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {sh.role}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Building size={14} />
                    <span>{sh.organization || 'Internal'}</span>
                  </div>
                  {sh.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '0.15rem' }}>
                      <Mail size={12} />
                      <span>{sh.email}</span>
                    </div>
                  )}
                </td>
                <td>{getLevelBadge(sh.interest || 'High')}</td>
                <td>{getLevelBadge(sh.influence || sh.influenceLevel || 'High')}</td>
                <td>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    {sh.responsibility || 'General oversight & project participation'}
                  </span>
                </td>
                {isEditing && (
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="list-item-delete-btn"
                      onClick={() => onRemove(idx)}
                      title="Remove Stakeholder"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StakeholderList;
