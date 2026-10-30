import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const CostEstimateForm = ({ isOpen, onClose, onSave, activity, currentEstimate }) => {
  const [formData, setFormData] = useState({
    laborCost: 0,
    materialCost: 0,
    softwareCost: 0,
    otherCost: 0,
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentEstimate) {
      setFormData({
        laborCost: currentEstimate.laborCost || 0,
        materialCost: currentEstimate.materialCost || 0,
        softwareCost: currentEstimate.softwareCost || 0,
        otherCost: currentEstimate.otherCost || 0,
        notes: currentEstimate.notes || ''
      });
    } else {
      setFormData({
        laborCost: 0,
        materialCost: 0,
        softwareCost: 0,
        otherCost: 0,
        notes: ''
      });
    }
  }, [currentEstimate, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const totalPlanned =
    (parseFloat(formData.laborCost) || 0) +
    (parseFloat(formData.materialCost) || 0) +
    (parseFloat(formData.softwareCost) || 0) +
    (parseFloat(formData.otherCost) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await onSave({
        activityId: activity?.activityId || activity?._id,
        laborCost: parseFloat(formData.laborCost) || 0,
        materialCost: parseFloat(formData.materialCost) || 0,
        softwareCost: parseFloat(formData.softwareCost) || 0,
        otherCost: parseFloat(formData.otherCost) || 0,
        notes: formData.notes
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save cost estimate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Planned Cost Estimation: ${activity ? activity.name : 'Activity'}`}
    >
      <form onSubmit={handleSubmit} className="standard-form">
        {error && <div className="error-banner">{error}</div>}

        <div className="callout-info" style={{ marginBottom: '1rem' }}>
          <strong>Activity:</strong> {activity?.activityId} - {activity?.name}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Estimated Labor (Rs.)</label>
            <input
              type="number"
              min="0"
              name="laborCost"
              value={formData.laborCost}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Estimated Material (Rs.)</label>
            <input
              type="number"
              min="0"
              name="materialCost"
              value={formData.materialCost}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Estimated Software / Licenses (Rs.)</label>
            <input
              type="number"
              min="0"
              name="softwareCost"
              value={formData.softwareCost}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Other / Contingency (Rs.)</label>
            <input
              type="number"
              min="0"
              name="otherCost"
              value={formData.otherCost}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <div style={{
          padding: '1rem',
          background: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <span style={{ fontWeight: 600 }}>Total Planned Cost:</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-color)' }}>
            Rs. {totalPlanned.toLocaleString()}
          </span>
        </div>

        <div className="form-group">
          <label>Estimation Notes</label>
          <textarea
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Cost breakdown justification or assumptions"
            className="form-control"
          />
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Estimate'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CostEstimateForm;
