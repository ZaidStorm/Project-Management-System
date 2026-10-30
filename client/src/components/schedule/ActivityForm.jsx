import React, { useState } from 'react';
import Button from '../common/Button';
import { toInputDateFormat } from '../../utils/formatDate';

const ActivityForm = ({ activity, wbsNodes = [], resources = [], onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    activityId: activity?.activityId || '',
    wbsId: activity?.wbsId || (wbsNodes.length > 0 ? wbsNodes[0].wbsId : ''),
    name: activity?.name || '',
    description: activity?.description || '',
    assignedResources: activity?.assignedResources || [],
    startDate: toInputDateFormat(activity?.startDate || new Date()),
    endDate: toInputDateFormat(activity?.endDate || new Date(Date.now() + 7 * 24 * 3600 * 1000)),
    estimatedHours: activity?.estimatedHours || 40,
    actualHours: activity?.actualHours || 0,
    progress: activity?.progress || 0,
    priority: activity?.priority || 'Medium',
    status: activity?.status || 'Not Started'
  });
  const [saving, setSaving] = useState(false);

  const handleResourceToggle = (name) => {
    setFormData((prev) => {
      const exists = prev.assignedResources.includes(name);
      return {
        ...prev,
        assignedResources: exists
          ? prev.assignedResources.filter((r) => r !== name)
          : [...prev.assignedResources, name]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.wbsId || !formData.startDate || !formData.endDate) {
      alert('Please fill in Activity Name, WBS Work Package, and Dates.');
      return;
    }
    try {
      setSaving(true);
      await onSave({
        ...formData,
        estimatedHours: Number(formData.estimatedHours) || 0,
        actualHours: Number(formData.actualHours) || 0,
        progress: Number(formData.progress) || 0,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate)
      });
    } catch (err) {
      alert(err.message || 'Failed to save activity');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Activity ID (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. ACT-001"
            value={formData.activityId}
            onChange={(e) => setFormData({ ...formData, activityId: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Associated WBS Work Package <span className="required">*</span>
          </label>
          <select
            className="form-select"
            value={formData.wbsId}
            onChange={(e) => setFormData({ ...formData, wbsId: e.target.value })}
            required
          >
            {wbsNodes.length === 0 ? (
              <option value="">No WBS nodes created yet</option>
            ) : (
              wbsNodes.map((n) => (
                <option key={n.wbsId} value={n.wbsId}>
                  [{n.code}] {n.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Activity Name <span className="required">*</span>
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Develop Patient Registration API"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          rows="2"
          placeholder="Activity deliverables and specifications..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Start Date <span className="required">*</span>
          </label>
          <input
            type="date"
            className="form-input"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            End Date <span className="required">*</span>
          </label>
          <input
            type="date"
            className="form-input"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Estimated Hours</label>
          <input
            type="number"
            min="0"
            className="form-input"
            value={formData.estimatedHours}
            onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Actual Hours Spent</label>
          <input
            type="number"
            min="0"
            className="form-input"
            value={formData.actualHours}
            onChange={(e) => setFormData({ ...formData, actualHours: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={formData.status}
            onChange={(e) => {
              const s = e.target.value;
              setFormData({
                ...formData,
                status: s,
                progress: s === 'Completed' ? 100 : formData.progress
              });
            }}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>

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
      </div>

      <div className="form-group">
        <label className="form-label">Progress ({formData.progress}%)</label>
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
              status: val === 100 ? 'Completed' : val > 0 ? 'In Progress' : 'Not Started'
            });
          }}
        />
      </div>

      {/* Assign Resources Selection */}
      <div className="form-group">
        <label className="form-label">Assign Team Resources</label>
        {resources.length === 0 ? (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            No team resources added yet. Add team members under Schedule &gt; Resources.
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
            {resources.map((res) => {
              const selected = formData.assignedResources.includes(res.name);
              return (
                <button
                  key={res.resourceId}
                  type="button"
                  onClick={() => handleResourceToggle(res.name)}
                  className={`btn btn-sm ${selected ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: '9999px', fontSize: '0.75rem' }}
                >
                  {selected ? '✓ ' : '+ '} {res.name} ({res.role})
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={saving}>
          {activity ? 'Update Activity' : 'Create Activity'}
        </Button>
      </div>
    </form>
  );
};

export default ActivityForm;
