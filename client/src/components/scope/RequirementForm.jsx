import React, { useState } from 'react';
import Button from '../common/Button';

const RequirementForm = ({ requirement, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    requirementId: requirement?.requirementId || '',
    title: requirement?.title || '',
    description: requirement?.description || '',
    type: requirement?.type || 'Functional',
    priority: requirement?.priority || 'Medium',
    status: requirement?.status || 'Draft',
    requestedBy: requirement?.requestedBy || '',
    assignedTo: requirement?.assignedTo || '',
    justification: requirement?.justification || '',
    approvalStatus: requirement?.approvalStatus || 'Draft',
    approvedBy: requirement?.approvedBy || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in Requirement Title and Description.');
      return;
    }
    try {
      setSaving(true);
      await onSave(formData);
    } catch (err) {
      alert(err.message || 'Failed to save requirement');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Requirement ID (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. REQ-001 (auto-generated if empty)"
            value={formData.requirementId}
            onChange={(e) => setFormData({ ...formData, requirementId: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Requirement Type</label>
          <select
            className="form-select"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="Functional">Functional</option>
            <option value="Non-Functional">Non-Functional</option>
            <option value="Business">Business</option>
            <option value="Technical">Technical</option>
            <option value="Regulatory">Regulatory</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Requirement Title <span className="required">*</span>
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Patient Registration System"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Detailed Description <span className="required">*</span>
        </label>
        <textarea
          className="form-textarea"
          rows="3"
          placeholder="System shall allow receptionists to register new patients and collect contact details..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
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
          <label className="form-label">Approval Status</label>
          <select
            className="form-select"
            value={formData.approvalStatus}
            onChange={(e) => {
              const appStatus = e.target.value;
              setFormData({
                ...formData,
                approvalStatus: appStatus,
                status: appStatus === 'Approved' ? 'Approved' : formData.status
              });
            }}
          >
            <option value="Draft">Draft (Excluded from Scope)</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved (Official Scope)</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Requested By</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Dr. Ahmed (Clinic Sponsor)"
            value={formData.requestedBy}
            onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Assigned Lead / Team</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Muhammad Zaid / Backend Team"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Business Justification</label>
        <textarea
          className="form-textarea"
          rows="2"
          placeholder="Explain the business value and rationale for this requirement..."
          value={formData.justification}
          onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={saving}>
          {requirement ? 'Update Requirement' : 'Add Requirement'}
        </Button>
      </div>
    </form>
  );
};

export default RequirementForm;
