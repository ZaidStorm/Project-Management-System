import React, { useState } from 'react';
import Modal from '../common/Modal';

const ExpenseForm = ({ isOpen, onClose, onSave, activities = [] }) => {
  const [formData, setFormData] = useState({
    activityId: '',
    description: '',
    amount: '',
    category: 'Labor',
    date: new Date().toISOString().split('T')[0],
    recordedBy: '',
    reference: ''
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

    if (!formData.description || !formData.amount) {
      setError('Description and Amount are required.');
      return;
    }

    try {
      setLoading(true);
      await onSave({
        ...formData,
        amount: parseFloat(formData.amount) || 0
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Project Expense">
      <form onSubmit={handleSubmit} className="standard-form">
        {error && <div className="error-banner">{error}</div>}

        <div className="form-group">
          <label>Related Activity (Optional)</label>
          <select
            name="activityId"
            value={formData.activityId}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">-- General Project Expense --</option>
            {activities.map(act => (
              <option key={act._id} value={act._id}>
                {act.activityId} - {act.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g. Server hosting renewal, contractor invoice"
            className="form-control"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Amount (Rs.) *</label>
            <input
              type="number"
              name="amount"
              min="0"
              step="any"
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g. 50000"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-control"
            >
              <option value="Labor">Labor</option>
              <option value="Software">Software</option>
              <option value="Material">Material</option>
              <option value="Equipment">Equipment</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Expense Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Recorded By</label>
            <input
              type="text"
              name="recordedBy"
              value={formData.recordedBy}
              onChange={handleChange}
              placeholder="e.g. Finance Officer / Project Manager"
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Receipt / Reference / Invoice #</label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            placeholder="e.g. INV-2026-089"
            className="form-control"
          />
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Record Expense'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseForm;
