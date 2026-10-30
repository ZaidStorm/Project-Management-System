import React, { useState } from 'react';
import Button from '../common/Button';

const ChangeRequestForm = ({ changeRequest, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    changeRequestId: changeRequest?.changeRequestId || '',
    title: changeRequest?.title || '',
    description: changeRequest?.description || '',
    justification: changeRequest?.justification || '',
    requestedBy: changeRequest?.requestedBy || '',
    costImpact: changeRequest?.costImpact || 0,
    scheduleImpact: changeRequest?.scheduleImpact || 0,
    resourceImpact: changeRequest?.resourceImpact || '',
    riskImpact: changeRequest?.riskImpact || '',
    priority: changeRequest?.priority || 'Medium',
    status: changeRequest?.status || 'Draft',
    approvalStatus: changeRequest?.approvalStatus || 'Pending'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.requestedBy.trim()) {
      alert('Please fill in Title, Description, and Requested By.');
      return;
    }
    try {
      setSaving(true);
      await onSave({
        ...formData,
        costImpact: Number(formData.costImpact) || 0,
        scheduleImpact: Number(formData.scheduleImpact) || 0
      });
    } catch (err) {
      alert(err.message || 'Failed to save change request');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Change Request ID (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. CR-001 (auto-generated)"
            value={formData.changeRequestId}
            onChange={(e) => setFormData({ ...formData, changeRequestId: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Requested By <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Dr. Ahmed / Client"
            value={formData.requestedBy}
            onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Change Title <span className="required">*</span>
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Add Online Payment Gateway"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Description of Change <span className="required">*</span>
        </label>
        <textarea
          className="form-textarea"
          rows="3"
          placeholder="Detailed explanation of requested scope modification..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Business Justification</label>
        <textarea
          className="form-textarea"
          rows="2"
          placeholder="Why is this change necessary? How does it benefit the project?"
          value={formData.justification}
          onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
        />
      </div>

      {/* Impact Analysis Section */}
      <div className="form-section-box">
        <div className="form-section-title">Change Impact Analysis</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Cost Impact ($)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 80000"
              value={formData.costImpact}
              onChange={(e) => setFormData({ ...formData, costImpact: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Schedule Impact (Days)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 15"
              value={formData.scheduleImpact}
              onChange={(e) => setFormData({ ...formData, scheduleImpact: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Resource Impact</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 1 Senior Backend Developer for 2 weeks"
              value={formData.resourceImpact}
              onChange={(e) => setFormData({ ...formData, resourceImpact: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Risk Impact</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Third party payment gateway compliance risk"
              value={formData.riskImpact}
              onChange={(e) => setFormData({ ...formData, riskImpact: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select
            className="form-select"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Change Approval Status</label>
          <select
            className="form-select"
            value={formData.approvalStatus}
            onChange={(e) => {
              const appStatus = e.target.value;
              setFormData({
                ...formData,
                approvalStatus: appStatus,
                status: appStatus === 'Approved' ? 'Approved' : appStatus === 'Rejected' ? 'Rejected' : 'Under Review'
              });
            }}
          >
            <option value="Pending">Pending (Under Review)</option>
            <option value="Approved">Approved (Propagate to Scope & WBS)</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={saving}>
          {changeRequest ? 'Update Change Request' : 'Submit Change Request'}
        </Button>
      </div>
    </form>
  );
};

export default ChangeRequestForm;
