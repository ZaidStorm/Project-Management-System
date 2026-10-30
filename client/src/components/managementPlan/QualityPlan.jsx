import React, { useState } from 'react';
import { Award, ShieldCheck, Plus, Trash2, CheckCircle } from 'lucide-react';
import Button from '../common/Button';

const QualityPlan = ({ data = {}, onChange, isEditing = false }) => {
  const [newStandard, setNewStandard] = useState('');
  const [newCriteria, setNewCriteria] = useState('');
  const [newMetric, setNewMetric] = useState('');

  const qualityStandards = data.qualityStandards || [];
  const acceptanceCriteria = data.acceptanceCriteria || [];
  const qualityMetrics = data.qualityMetrics || [];

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
        <div className="dashboard-full-grid">
          {/* Quality Standards */}
          <div className="section-card glass-panel">
            <h4 className="section-card-title" style={{ color: 'var(--accent-emerald)' }}>
              <Award size={18} />
              Quality Standards & Frameworks
            </h4>
            {qualityStandards.length === 0 ? (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No quality standards listed.</p>
            ) : (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {qualityStandards.map((std, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <CheckCircle size={16} color="var(--accent-emerald)" />
                    <span>{std}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quality Metrics */}
          <div className="section-card glass-panel">
            <h4 className="section-card-title" style={{ color: 'var(--primary)' }}>
              <ShieldCheck size={18} />
              Quality Metrics & KPIs
            </h4>
            {qualityMetrics.length === 0 ? (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No metrics recorded.</p>
            ) : (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {qualityMetrics.map((met, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--primary)' }}>✦</span>
                    <span>{met}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Process Strategies */}
        <div className="dashboard-full-grid">
          <div className="section-card glass-panel">
            <h4 className="section-card-title">Testing Strategy</h4>
            <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.6', marginTop: '0.5rem' }}>
              {data.testingStrategy || 'Comprehensive unit, integration, and user acceptance testing.'}
            </p>
          </div>

          <div className="section-card glass-panel">
            <h4 className="section-card-title">Code Review & Quality Control</h4>
            <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.6', marginTop: '0.5rem' }}>
              {data.codeReviewProcess || 'Peer code reviews on all pull requests with automated linting and tests.'}
            </p>
          </div>
        </div>

        {/* Acceptance Criteria */}
        <div className="section-card glass-panel">
          <h4 className="section-card-title">Project Acceptance Criteria</h4>
          {acceptanceCriteria.length === 0 ? (
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No acceptance criteria defined.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
              {acceptanceCriteria.map((crit, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.85rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem'
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginRight: '0.5rem' }}>
                    #{i + 1}
                  </span>
                  {crit}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="dashboard-full-grid">
        {/* Quality Standards */}
        <div className="section-card glass-panel">
          <h4 className="section-card-title">Quality Standards</h4>
          <div className="list-builder-row">
            <input
              type="text"
              className="form-input"
              placeholder="e.g. ISO 9001, Clean Architecture..."
              value={newStandard}
              onChange={(e) => setNewStandard(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd('qualityStandards', newStandard, setNewStandard);
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              icon={Plus}
              onClick={() => handleAdd('qualityStandards', newStandard, setNewStandard)}
            >
              Add
            </Button>
          </div>
          <div className="list-builder">
            {qualityStandards.map((item, i) => (
              <div key={i} className="list-item-badge">
                <span>{item}</span>
                <button
                  type="button"
                  className="list-item-delete-btn"
                  onClick={() => handleRemove('qualityStandards', i)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="section-card glass-panel">
          <h4 className="section-card-title">Quality Metrics & Targets</h4>
          <div className="list-builder-row">
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Code coverage >= 85%, SLA 99.9%..."
              value={newMetric}
              onChange={(e) => setNewMetric(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd('qualityMetrics', newMetric, setNewMetric);
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              icon={Plus}
              onClick={() => handleAdd('qualityMetrics', newMetric, setNewMetric)}
            >
              Add
            </Button>
          </div>
          <div className="list-builder">
            {qualityMetrics.map((item, i) => (
              <div key={i} className="list-item-badge">
                <span>{item}</span>
                <button
                  type="button"
                  className="list-item-delete-btn"
                  onClick={() => handleRemove('qualityMetrics', i)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-card glass-panel">
        <h4 className="section-card-title">Testing & Code Review Strategy</h4>
        <div className="form-group">
          <label className="form-label">Testing Strategy</label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="Describe unit testing, integration testing, system testing, UAT..."
            value={data.testingStrategy || ''}
            onChange={(e) => onChange({ ...data, testingStrategy: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Code Review & Approval Process</label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="Peer review requirements, branch protection rules, lint checks..."
            value={data.codeReviewProcess || ''}
            onChange={(e) => onChange({ ...data, codeReviewProcess: e.target.value })}
          />
        </div>
      </div>

      <div className="section-card glass-panel">
        <h4 className="section-card-title">Acceptance Criteria</h4>
        <div className="list-builder-row">
          <input
            type="text"
            className="form-input"
            placeholder="Add acceptance criterion..."
            value={newCriteria}
            onChange={(e) => setNewCriteria(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd('acceptanceCriteria', newCriteria, setNewCriteria);
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            icon={Plus}
            onClick={() => handleAdd('acceptanceCriteria', newCriteria, setNewCriteria)}
          >
            Add
          </Button>
        </div>
        <div className="list-builder">
          {acceptanceCriteria.map((item, i) => (
            <div key={i} className="list-item-badge">
              <span>{item}</span>
              <button
                type="button"
                className="list-item-delete-btn"
                onClick={() => handleRemove('acceptanceCriteria', i)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QualityPlan;
