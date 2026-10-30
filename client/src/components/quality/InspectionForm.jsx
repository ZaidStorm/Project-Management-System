import React, { useState } from 'react';
import Modal from '../common/Modal';

const InspectionForm = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    deliverable: '',
    inspector: 'QA Lead',
    inspectionDate: new Date().toISOString().split('T')[0],
    result: 'PASS',
    totalTestCases: 25,
    passedCases: 24,
    failedCases: 1,
    criticalDefectsCount: 0,
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.deliverable || !formData.inspector) {
      setError('Deliverable and Inspector are required.');
      return;
    }

    try {
      setLoading(true);
      await onSave({
        ...formData,
        totalTestCases: parseInt(formData.totalTestCases, 10) || 0,
        passedCases: parseInt(formData.passedCases, 10) || 0,
        failedCases: parseInt(formData.failedCases, 10) || 0,
        criticalDefectsCount: parseInt(formData.criticalDefectsCount, 10) || 0
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record inspection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Inspection & Test Result">
      <form onSubmit={handleSubmit} className="standard-form">
        {error && <div className="error-banner">{error}</div>}

        <div className="form-group">
          <label>Deliverable / Target Module *</label>
          <input
            type="text"
            name="deliverable"
            value={formData.deliverable}
            onChange={handleChange}
            placeholder="e.g. Patient Registration API & UI"
            className="form-control"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Inspector / QA Officer *</label>
            <input
              type="text"
              name="inspector"
              value={formData.inspector}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Inspection Date</label>
            <input
              type="date"
              name="inspectionDate"
              value={formData.inspectionDate}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Inspection Result *</label>
            <select
              name="result"
              value={formData.result}
              onChange={handleChange}
              className="form-control"
            >
              <option value="PASS">PASS</option>
              <option value="FAIL">FAIL</option>
            </select>
          </div>

          <div className="form-group">
            <label>Total Test Cases Executed</label>
            <input
              type="number"
              min="0"
              name="totalTestCases"
              value={formData.totalTestCases}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Passed Test Cases</label>
            <input
              type="number"
              min="0"
              name="passedCases"
              value={formData.passedCases}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Failed Test Cases</label>
            <input
              type="number"
              min="0"
              name="failedCases"
              value={formData.failedCases}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Critical Defects Found</label>
            <input
              type="number"
              min="0"
              name="criticalDefectsCount"
              value={formData.criticalDefectsCount}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Inspection Notes & Observations</label>
          <textarea
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Key findings, verification summary, sign-off status"
            className="form-control"
          />
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Record Result'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InspectionForm;
