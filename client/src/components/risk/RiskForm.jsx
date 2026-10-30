import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const RiskForm = ({ isOpen, onClose, onSave, risk }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    likelihood: 3,
    impact: 3,
    owner: 'Project Manager',
    responseStrategy: 'Mitigate',
    preventiveAction: '',
    correctiveAction: '',
    status: 'Identified',
    reviewDate: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (risk) {
      setFormData({
        title: risk.title || '',
        description: risk.description || '',
        likelihood: risk.likelihood || 3,
        impact: risk.impact || 3,
        owner: risk.owner || 'Project Manager',
        responseStrategy: risk.responseStrategy || 'Mitigate',
        preventiveAction: risk.preventiveAction || '',
        correctiveAction: risk.correctiveAction || '',
        status: risk.status || 'Identified',
        reviewDate: risk.reviewDate ? new Date(risk.reviewDate).toISOString().split('T')[0] : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        likelihood: 3,
        impact: 3,
        owner: 'Project Manager',
        responseStrategy: 'Mitigate',
        preventiveAction: '',
        correctiveAction: '',
        status: 'Identified',
        reviewDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [risk, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const score = (parseInt(formData.likelihood, 10) || 1) * (parseInt(formData.impact, 10) || 1);
  const getLevel = (sc) => {
    if (sc >= 17) return { text: 'Critical', color: 'var(--danger-color)' };
    if (sc >= 10) return { text: 'High', color: '#f97316' };
    if (sc >= 5) return { text: 'Medium', color: '#eab308' };
    return { text: 'Low', color: 'var(--success-color)' };
  };
  const levelInfo = getLevel(score);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title) {
      setError('Risk title is required.');
      return;
    }

    try {
      setLoading(true);
      await onSave({
        ...formData,
        likelihood: parseInt(formData.likelihood, 10),
        impact: parseInt(formData.impact, 10)
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save risk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={risk ? `Edit Risk: ${risk.riskId}` : 'Identify New Project Risk'}
    >
      <form onSubmit={handleSubmit} className="standard-form">
        {error && <div className="error-banner">{error}</div>}

        <div className="form-group">
          <label>Risk Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Internet outage during cloud database synchronization"
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            rows="2"
            value={formData.description}
            onChange={handleChange}
            placeholder="Context, cause, and potential consequences of the risk"
            className="form-control"
          />
        </div>

        {/* Likelihood & Impact 5x5 Calculation */}
        <div className="form-row">
          <div className="form-group">
            <label>Likelihood (1 - 5) *</label>
            <select
              name="likelihood"
              value={formData.likelihood}
              onChange={handleChange}
              className="form-control"
            >
              <option value="1">1 - Rare</option>
              <option value="2">2 - Unlikely</option>
              <option value="3">3 - Possible</option>
              <option value="4">4 - Likely</option>
              <option value="5">5 - Almost Certain</option>
            </select>
          </div>

          <div className="form-group">
            <label>Impact (1 - 5) *</label>
            <select
              name="impact"
              value={formData.impact}
              onChange={handleChange}
              className="form-control"
            >
              <option value="1">1 - Insignificant</option>
              <option value="2">2 - Minor</option>
              <option value="3">3 - Moderate</option>
              <option value="4">4 - Major</option>
              <option value="5">5 - Catastrophic</option>
            </select>
          </div>
        </div>

        {/* Calculated Score Indicator */}
        <div style={{
          padding: '0.75rem 1rem',
          background: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <div>
            <strong>Risk Score = Likelihood × Impact: </strong>
            <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{formData.likelihood} × {formData.impact} = {score}</span>
          </div>
          <div>
            <span style={{
              fontWeight: 700,
              padding: '0.25rem 0.75rem',
              borderRadius: '6px',
              color: '#fff',
              background: levelInfo.color
            }}>
              {levelInfo.text.toUpperCase()} LEVEL
            </span>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Response Strategy</label>
            <select
              name="responseStrategy"
              value={formData.responseStrategy}
              onChange={handleChange}
              className="form-control"
            >
              <option value="Mitigate">Mitigate</option>
              <option value="Avoid">Avoid</option>
              <option value="Transfer">Transfer</option>
              <option value="Accept">Accept</option>
            </select>
          </div>

          <div className="form-group">
            <label>Risk Owner</label>
            <input
              type="text"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              placeholder="e.g. Lead Architect / Project Manager"
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Preventive Action (PDPC)</label>
          <input
            type="text"
            name="preventiveAction"
            value={formData.preventiveAction}
            onChange={handleChange}
            placeholder="Proactive measure to prevent occurrence (e.g. Backup server & automated sync)"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Corrective Action / Contingency (PDPC)</label>
          <input
            type="text"
            name="correctiveAction"
            value={formData.correctiveAction}
            onChange={handleChange}
            placeholder="Action if risk triggers (e.g. Failover to offline queue)"
            className="form-control"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-control"
            >
              <option value="Identified">Identified</option>
              <option value="Analyzing">Analyzing</option>
              <option value="Mitigated">Mitigated</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Review Date</label>
            <input
              type="date"
              name="reviewDate"
              value={formData.reviewDate}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : risk ? 'Update Risk' : 'Add Risk'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RiskForm;
