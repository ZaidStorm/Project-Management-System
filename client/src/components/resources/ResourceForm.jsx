import React, { useState } from 'react';
import Button from '../common/Button';

const ResourceForm = ({ resource, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    resourceId: resource?.resourceId || '',
    name: resource?.name || '',
    role: resource?.role || '',
    email: resource?.email || '',
    availability: resource?.availability || 100,
    hourlyRate: resource?.hourlyRate || 0,
    status: resource?.status || 'Active'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) {
      alert('Please fill in Name and Role.');
      return;
    }
    try {
      setSaving(true);
      await onSave({
        ...formData,
        availability: Number(formData.availability) || 100,
        hourlyRate: Number(formData.hourlyRate) || 0
      });
    } catch (err) {
      alert(err.message || 'Failed to save resource');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Resource ID (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. R-001 (auto-generated)"
            value={formData.resourceId}
            onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Full Name <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Muhammad Zaid"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Role / Designation <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Backend Developer / QA Lead"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            placeholder="e.g. zaid@hospital.org"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Availability (% Capacity)</label>
          <input
            type="number"
            min="0"
            max="100"
            className="form-input"
            value={formData.availability}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Hourly Rate ($ / hr)</label>
          <input
            type="number"
            min="0"
            className="form-input"
            value={formData.hourlyRate}
            onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="Active">Active</option>
          <option value="Assigned">Assigned</option>
          <option value="Unavailable">Unavailable</option>
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={saving}>
          {resource ? 'Update Resource' : 'Add Team Member'}
        </Button>
      </div>
    </form>
  );
};

export default ResourceForm;
