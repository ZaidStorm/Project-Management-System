import React from 'react';
import { Target, CheckSquare, Plus, Trash2 } from 'lucide-react';
import Button from '../common/Button';

const ScopePlan = ({ data = {}, onChange, isEditing = false }) => {
  const [newDeliverable, setNewDeliverable] = React.useState('');
  const [newInclusion, setNewInclusion] = React.useState('');
  const [newExclusion, setNewExclusion] = React.useState('');

  const deliverables = data.deliverables || [];
  const inclusions = data.inclusions || [];
  const exclusions = data.exclusions || [];

  const handleAdd = (field, val, setter) => {
    if (!val.trim()) return;
    onChange({
      ...data,
      [field]: [...(data[field] || []), val.trim()]
    });
    setter('');
  };

  const handleRemove = (field, index) => {
    onChange({
      ...data,
      [field]: (data[field] || []).filter((_, i) => i !== index)
    });
  };

  if (!isEditing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="section-card glass-panel">
          <h4 className="section-card-title">Project Scope Definition</h4>
          <p style={{ color: 'var(--text-main)', fontSize: '0.925rem', lineHeight: '1.6', marginTop: '0.5rem' }}>
            {data.projectScopeDefinition || 'No detailed scope description provided.'}
          </p>
        </div>

        <div className="dashboard-full-grid">
          <div className="section-card glass-panel">
            <h4 className="section-card-title" style={{ color: 'var(--primary)' }}>
              Key Project Deliverables ({deliverables.length})
            </h4>
            {deliverables.length === 0 ? (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No deliverables specified yet.</p>
            ) : (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {deliverables.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <CheckSquare size={16} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="section-card glass-panel">
            <h4 className="section-card-title">Scope Inclusions & Exclusions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34d399', marginBottom: '0.35rem' }}>
                  Inclusions
                </div>
                {inclusions.length === 0 ? (
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>None specified</p>
                ) : (
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {inclusions.map((inc, i) => (
                      <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>✓ {inc}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fb7185', marginBottom: '0.35rem' }}>
                  Exclusions
                </div>
                {exclusions.length === 0 ? (
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>None specified</p>
                ) : (
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {exclusions.map((exc, i) => (
                      <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>✕ {exc}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="section-card glass-panel">
          <h4 className="section-card-title">Scope Approval & Governance Process</h4>
          <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {data.scopeApprovalProcess || 'All scope modifications require formal review and sign-off by the Project Sponsor.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="section-card glass-panel">
        <h4 className="section-card-title">Scope Definition & Governance</h4>
        <div className="form-group">
          <label className="form-label">Project Scope Definition</label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="Define the complete scope of work, technical boundaries and end-user solution..."
            value={data.projectScopeDefinition || ''}
            onChange={(e) => onChange({ ...data, projectScopeDefinition: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Scope Approval Process</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Formal change request and approval from Project Sponsor"
            value={data.scopeApprovalProcess || ''}
            onChange={(e) => onChange({ ...data, scopeApprovalProcess: e.target.value })}
          />
        </div>
      </div>

      <div className="dashboard-full-grid">
        {/* Deliverables */}
        <div className="section-card glass-panel">
          <h4 className="section-card-title">Key Deliverables</h4>
          <div className="list-builder-row">
            <input
              type="text"
              className="form-input"
              placeholder="Add key deliverable..."
              value={newDeliverable}
              onChange={(e) => setNewDeliverable(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd('deliverables', newDeliverable, setNewDeliverable);
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              icon={Plus}
              onClick={() => handleAdd('deliverables', newDeliverable, setNewDeliverable)}
            >
              Add
            </Button>
          </div>
          <div className="list-builder">
            {deliverables.map((del, i) => (
              <div key={i} className="list-item-badge">
                <span>{del}</span>
                <button
                  type="button"
                  className="list-item-delete-btn"
                  onClick={() => handleRemove('deliverables', i)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Inclusions & Exclusions */}
        <div className="section-card glass-panel">
          <h4 className="section-card-title">Inclusions & Exclusions</h4>
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ color: '#34d399' }}>Inclusions</label>
            <div className="list-builder-row">
              <input
                type="text"
                className="form-input"
                placeholder="Add inclusion..."
                value={newInclusion}
                onChange={(e) => setNewInclusion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAdd('inclusions', newInclusion, setNewInclusion);
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                icon={Plus}
                onClick={() => handleAdd('inclusions', newInclusion, setNewInclusion)}
              >
                Add
              </Button>
            </div>
            <div className="list-builder">
              {inclusions.map((item, i) => (
                <div key={i} className="list-item-badge">
                  <span>✓ {item}</span>
                  <button
                    type="button"
                    className="list-item-delete-btn"
                    onClick={() => handleRemove('inclusions', i)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label" style={{ color: '#fb7185' }}>Exclusions</label>
            <div className="list-builder-row">
              <input
                type="text"
                className="form-input"
                placeholder="Add exclusion..."
                value={newExclusion}
                onChange={(e) => setNewExclusion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAdd('exclusions', newExclusion, setNewExclusion);
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                icon={Plus}
                onClick={() => handleAdd('exclusions', newExclusion, setNewExclusion)}
              >
                Add
              </Button>
            </div>
            <div className="list-builder">
              {exclusions.map((item, i) => (
                <div key={i} className="list-item-badge">
                  <span>✕ {item}</span>
                  <button
                    type="button"
                    className="list-item-delete-btn"
                    onClick={() => handleRemove('exclusions', i)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScopePlan;
