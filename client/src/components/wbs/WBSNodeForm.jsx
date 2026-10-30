import React, { useState } from 'react';
import Button from '../common/Button';
import { toInputDateFormat } from '../../utils/formatDate';

const WBSNodeForm = ({ node, parentId = null, existingNodes = [], approvedRequirements = [], onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    wbsId: node?.wbsId || '',
    parentId: node ? node.parentId : parentId || null,
    code: node?.code || '',
    name: node?.name || '',
    description: node?.description || '',
    nodeType: node?.nodeType || 'Work Package',
    requirementId: node?.requirementId || '',
    responsiblePerson: node?.responsiblePerson || '',
    status: node?.status || 'Not Started',
    progress: node?.progress || 0,
    estimatedCost: node?.estimatedCost || 0,
    startDate: toInputDateFormat(node?.startDate),
    endDate: toInputDateFormat(node?.endDate)
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please provide a WBS Node Name.');
      return;
    }
    try {
      setSaving(true);
      await onSave({
        ...formData,
        parentId: formData.parentId || null,
        requirementId: formData.requirementId ? formData.requirementId.trim().toUpperCase() : null,
        estimatedCost: Number(formData.estimatedCost) || 0,
        progress: Number(formData.progress) || 0,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined
      });
    } catch (err) {
      alert(err.message || 'Failed to save WBS node');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Parent WBS Node</label>
          <select
            className="form-select"
            value={formData.parentId || ''}
            onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
          >
            <option value="">(None - Top Level Project Node)</option>
            {existingNodes
              .filter((n) => !node || n.wbsId !== node.wbsId)
              .map((n) => (
                <option key={n.wbsId} value={n.wbsId}>
                  [{n.code}] {n.name} ({n.nodeType})
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Node Type</label>
          <select
            className="form-select"
            value={formData.nodeType}
            onChange={(e) => setFormData({ ...formData, nodeType: e.target.value })}
          >
            <option value="Project">Project (Level 1)</option>
            <option value="Deliverable">Deliverable (Level 2)</option>
            <option value="Work Package">Work Package (Level 3)</option>
            <option value="Task">Task (Level 4)</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">WBS Code (Auto-generated if empty)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. 2.1 or 2.1.1"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Node Title / Name <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Patient Registration API"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Linked Approved Requirement */}
      <div className="form-group">
        <label className="form-label">
          Linked Approved Requirement
          <span className="form-help">Only approved requirements can enter the WBS</span>
        </label>
        <select
          className="form-select"
          value={formData.requirementId || ''}
          onChange={(e) => setFormData({ ...formData, requirementId: e.target.value })}
        >
          <option value="">(None - Independent or Management Work Package)</option>
          {approvedRequirements.map((req) => (
            <option key={req.requirementId} value={req.requirementId}>
              [{req.requirementId}] {req.title} ({req.priority})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Description & Scope of Work</label>
        <textarea
          className="form-textarea"
          rows="2"
          placeholder="Detailed breakdown of activities and work included..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Responsible Person</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Muhammad Zaid / Backend Lead"
            value={formData.responsiblePerson}
            onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Estimated Cost ($)</label>
          <input
            type="number"
            min="0"
            className="form-input"
            value={formData.estimatedCost}
            onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
          />
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
            onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Target Start Date</label>
          <input
            type="date"
            className="form-input"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Target End Date</label>
          <input
            type="date"
            className="form-input"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={saving}>
          {node ? 'Update WBS Node' : 'Create WBS Node'}
        </Button>
      </div>
    </form>
  );
};

export default WBSNodeForm;
