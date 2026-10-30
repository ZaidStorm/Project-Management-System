import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const DefectForm = ({ isOpen, onClose, onSave, defect, activities = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    activityId: '',
    severity: 'Medium',
    priority: 'Medium',
    assignedTo: '',
    status: 'Open',
    reportedBy: 'QA Tester',
    resolution: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (defect) {
      setFormData({
        title: defect.title || '',
        description: defect.description || '',
        activityId: defect.activityId || '',
        severity: defect.severity || 'Medium',
        priority: defect.priority || 'Medium',
        assignedTo: defect.assignedTo || '',
        status: defect.status || 'Open',
        reportedBy: defect.reportedBy || 'QA Tester',
        resolution: defect.resolution || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        activityId: '',
        severity: 'Medium',
        priority: 'Medium',
        assignedTo: '',
        status: 'Open',
        reportedBy: 'QA Tester',
        resolution: ''
      });
    }
  }, [defect, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description) {
      setError('Title and Description are required.');
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save defect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={defect ? `Edit Defect: ${defect.defectId}` : 'Report New Defect'}
    >
      <form onSubmit={handleSubmit} className="standard-form">
        {error && <div className="error-banner">{error}</div>}

        <div className="form-group">
          <label>Defect Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Login API returns 500 error on invalid payload"
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Steps to reproduce, expected result, actual result"
            className="form-control"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Severity *</label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="form-control"
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority *</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-control"
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Related Activity</label>
            <select
              name="activityId"
              value={formData.activityId}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">-- General Project / None --</option>
              {activities.map(act => (
                <option key={act._id} value={act.activityId || act._id}>
                  {act.activityId} - {act.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-control"
            >
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Assigned To</label>
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="e.g. Backend Developer"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Reported By</label>
            <input
              type="text"
              name="reportedBy"
              value={formData.reportedBy}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {(formData.status === 'Resolved' || formData.status === 'Closed') && (
          <div className="form-group">
            <label>Resolution Summary</label>
            <textarea
              name="resolution"
              rows="2"
              value={formData.resolution}
              onChange={handleChange}
              placeholder="How the defect was resolved / root cause addressed"
              className="form-control"
            />
          </div>
        )}

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : defect ? 'Update Defect' : 'Log Defect'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DefectForm;
