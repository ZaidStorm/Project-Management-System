import React, { useState } from 'react';
import Button from '../common/Button';
import { toInputDateFormat } from '../../utils/formatDate';

const MilestoneForm = ({ milestone, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    milestoneId: milestone?.milestoneId || '',
    title: milestone?.title || '',
    description: milestone?.description || '',
    dueDate: toInputDateFormat(milestone?.dueDate),
    responsiblePerson: milestone?.responsiblePerson || '',
    status: milestone?.status || 'Pending',
    progress: milestone?.progress || 0,
    completedDate: toInputDateFormat(milestone?.completedDate)
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.dueDate || !formData.responsiblePerson.trim()) {
      alert('Please fill in title, due date, and responsible person.');
      return;
    }
    try {
      setSaving(true);
      await onSave({
        ...formData,
        progress: Number(formData.progress) || 0,
        dueDate: new Date(formData.dueDate),
        completedDate: formData.completedDate ? new Date(formData.completedDate) : undefined
      });
    } catch (err) {
      alert(err.message || 'Failed to save milestone');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Milestone ID (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. M-001 (auto-generated if empty)"
            value={formData.milestoneId}
            onChange={(e) => setFormData({ ...formData, milestoneId: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            Due Date <span className="required">*</span>
          </label>
          <input
            type="date"
            className="form-input"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Milestone Title <span className="required">*</span>
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. System Architecture & High-Level Design Approved"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          rows="2"
          placeholder="Describe deliverables and verification criteria for this milestone..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Responsible Person / Lead <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Muhammad Zaid / Development Team"
            value={formData.responsiblePerson}
            onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={formData.status}
            onChange={(e) => {
              const newStatus = e.target.value;
              setFormData({
                ...formData,
                status: newStatus,
                progress: newStatus === 'Completed' ? 100 : formData.progress
              });
            }}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Completion Progress ({formData.progress}%)</label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            className="form-input"
            style={{ padding: '0.25rem 0' }}
            value={formData.progress}
            onChange={(e) => {
              const val = Number(e.target.value);
              setFormData({
                ...formData,
                progress: val,
                status: val === 100 ? 'Completed' : val > 0 ? 'In Progress' : 'Pending'
              });
            }}
          />
        </div>

        {formData.status === 'Completed' && (
          <div className="form-group">
            <label className="form-label">Completed Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.completedDate}
              onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })}
            />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={saving}>
          {milestone ? 'Update Milestone' : 'Create Milestone'}
        </Button>
      </div>
    </form>
  );
};

export default MilestoneForm;
