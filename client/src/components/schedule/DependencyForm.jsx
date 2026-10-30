import React, { useState } from 'react';
import Button from '../common/Button';

const DependencyForm = ({ activities = [], onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    predecessorActivity: activities.length > 0 ? activities[0].activityId : '',
    successorActivity: activities.length > 1 ? activities[1].activityId : '',
    dependencyType: 'FS',
    lag: 0
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.predecessorActivity || !formData.successorActivity) {
      alert('Please select both predecessor and successor activities.');
      return;
    }
    if (formData.predecessorActivity === formData.successorActivity) {
      alert('Predecessor and successor cannot be the same activity.');
      return;
    }
    try {
      setSaving(true);
      await onSave({
        ...formData,
        lag: Number(formData.lag) || 0
      });
    } catch (err) {
      alert(err.message || 'Failed to save dependency');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Predecessor Activity</label>
          <select
            className="form-select"
            value={formData.predecessorActivity}
            onChange={(e) => setFormData({ ...formData, predecessorActivity: e.target.value })}
            required
          >
            {activities.map((a) => (
              <option key={a.activityId} value={a.activityId}>
                [{a.activityId}] {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Successor Activity</label>
          <select
            className="form-select"
            value={formData.successorActivity}
            onChange={(e) => setFormData({ ...formData, successorActivity: e.target.value })}
            required
          >
            {activities.map((a) => (
              <option key={a.activityId} value={a.activityId}>
                [{a.activityId}] {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Dependency Relationship Type</label>
          <select
            className="form-select"
            value={formData.dependencyType}
            onChange={(e) => setFormData({ ...formData, dependencyType: e.target.value })}
          >
            <option value="FS">Finish-to-Start (FS) - Standard software sequence</option>
            <option value="SS">Start-to-Start (SS) - Concurrent start</option>
            <option value="FF">Finish-to-Finish (FF) - Synchronous delivery</option>
            <option value="SF">Start-to-Finish (SF)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Lag / Lead Time (Days)</label>
          <input
            type="number"
            className="form-input"
            value={formData.lag}
            onChange={(e) => setFormData({ ...formData, lag: e.target.value })}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={saving}>
          Add Dependency Link
        </Button>
      </div>
    </form>
  );
};

export default DependencyForm;
