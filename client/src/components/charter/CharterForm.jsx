import React, { useState } from 'react';
import { Plus, Trash2, Save, X, UserPlus, Target, Shield, Users } from 'lucide-react';
import StakeholderList from './StakeholderList';
import Button from '../common/Button';
import { toInputDateFormat } from '../../utils/formatDate';

const CharterForm = ({ charter, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    projectType: charter?.projectType || 'Software Development',
    client: charter?.client || 'Network of Five Hospitals',
    projectManager: charter?.projectManager || 'Project Manager',
    priority: charter?.priority || 'High',
    approvedBudget: charter?.approvedBudget || 5000000,
    changeCost: charter?.changeCost || 800000,
    revisedBudget: charter?.revisedBudget || 5800000,
    originalDuration: charter?.originalDuration || '16 Weeks',
    changeDuration: charter?.changeDuration || '3 Weeks',
    revisedDuration: charter?.revisedDuration || '19 Weeks',
    originalDeadline: toInputDateFormat(charter?.originalDeadline || '2027-02-16'),
    deadline: toInputDateFormat(charter?.deadline || '2027-03-09'),
    revisedDeadline: toInputDateFormat(charter?.revisedDeadline || charter?.deadline || '2027-03-09'),
    approvalStatus: charter?.approvalStatus || 'Approved',
    approvedBy: charter?.approvedBy || 'Hospital Management & Sponsor',
    approvalDate: toInputDateFormat(charter?.approvalDate || '2026-10-28'),
    objectives: charter?.objectives || [],
    inScope: charter?.inScope || [],
    outOfScope: charter?.outOfScope || [],
    assumptions: charter?.assumptions || [],
    constraints: charter?.constraints || [],
    stakeholders: charter?.stakeholders || []
  });

  // Inputs for adding new list items
  const [newObjective, setNewObjective] = useState('');
  const [newInScope, setNewInScope] = useState('');
  const [newOutOfScope, setNewOutOfScope] = useState('');
  const [newAssumption, setNewAssumption] = useState('');
  const [newConstraint, setNewConstraint] = useState('');

  // Stakeholder modal / inline inputs
  const [shForm, setShForm] = useState({
    name: '',
    role: '',
    organization: '',
    email: '',
    responsibility: '',
    interest: 'High',
    influence: 'High',
    influenceLevel: 'High'
  });
  const [showShModal, setShowShModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAddListItem = (field, value, setValue) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], value.trim()]
    }));
    setValue('');
  };

  const handleRemoveListItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleAddStakeholder = (e) => {
    e.preventDefault();
    if (!shForm.name.trim() || !shForm.role.trim()) return;

    setFormData((prev) => ({
      ...prev,
      stakeholders: [
        ...prev.stakeholders,
        {
          ...shForm,
          stakeholderId: `SH-${Date.now().toString().slice(-4)}`
        }
      ]
    }));

    setShForm({
      name: '',
      role: '',
      organization: '',
      email: '',
      responsibility: '',
      influenceLevel: 'Medium'
    });
    setShowShModal(false);
  };

  const handleRemoveStakeholder = (index) => {
    setFormData((prev) => ({
      ...prev,
      stakeholders: prev.stakeholders.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSave({
        ...formData,
        approvedBudget: Number(formData.approvedBudget) || 0,
        changeCost: Number(formData.changeCost) || 0,
        revisedBudget: Number(formData.revisedBudget) || (Number(formData.approvedBudget) + Number(formData.changeCost || 0)),
        originalDeadline: formData.originalDeadline ? new Date(formData.originalDeadline) : undefined,
        revisedDeadline: formData.revisedDeadline ? new Date(formData.revisedDeadline) : undefined,
        deadline: formData.revisedDeadline ? new Date(formData.revisedDeadline) : (formData.deadline ? new Date(formData.deadline) : undefined),
        approvalDate: formData.approvalDate ? new Date(formData.approvalDate) : undefined
      });
    } catch (err) {
      alert(err.message || 'Failed to save charter');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>Edit Project Charter</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Define objectives, stakeholders, scope boundaries, budget and formal approval status.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" icon={X} onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={Save} loading={saving}>
            Save Charter
          </Button>
        </div>
      </div>

      {/* Meta & Approval Status */}
      <div className="section-card glass-panel">
        <h3 className="section-card-title">Authorization & Governance</h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Approval Status</label>
            <select
              className="form-select"
              value={formData.approvalStatus}
              onChange={(e) => setFormData({ ...formData, approvalStatus: e.target.value })}
            >
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Approved By</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dr. Ahmed (Project Sponsor)"
              value={formData.approvedBy}
              onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Approval Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.approvalDate}
              onChange={(e) => setFormData({ ...formData, approvalDate: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Project Type</label>
            <input
              type="text"
              className="form-input"
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              placeholder="e.g. Software Development"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Client / Sponsor</label>
            <input
              type="text"
              className="form-input"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              placeholder="e.g. Network of Five Hospitals"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project Manager</label>
            <input
              type="text"
              className="form-input"
              value={formData.projectManager}
              onChange={(e) => setFormData({ ...formData, projectManager: e.target.value })}
              required
            />
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

        {/* Budget & Change Management Section */}
        <div style={{ marginTop: '0.75rem', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary)' }}>
          💰 Budget & Scope Change Cost (in PKR)
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Approved Base Budget (PKR)</label>
            <input
              type="number"
              className="form-input"
              min="0"
              value={formData.approvedBudget}
              onChange={(e) => {
                const base = Number(e.target.value) || 0;
                const extra = Number(formData.changeCost) || 0;
                setFormData({
                  ...formData,
                  approvedBudget: base,
                  revisedBudget: base + extra
                });
              }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Change Cost / Extra Budget (PKR)</label>
            <input
              type="number"
              className="form-input"
              min="0"
              value={formData.changeCost}
              onChange={(e) => {
                const extra = Number(e.target.value) || 0;
                const base = Number(formData.approvedBudget) || 0;
                setFormData({
                  ...formData,
                  changeCost: extra,
                  revisedBudget: base + extra
                });
              }}
              placeholder="e.g. 800000"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Total Revised Budget (PKR)</label>
            <input
              type="number"
              className="form-input"
              style={{ fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-tint)' }}
              value={formData.revisedBudget}
              onChange={(e) => setFormData({ ...formData, revisedBudget: Number(e.target.value) || 0 })}
            />
          </div>
        </div>

        {/* Timeline & Schedule Baseline Section */}
        <div style={{ marginTop: '0.75rem', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary)' }}>
          ⏱️ Project Duration & Baseline Deadlines
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Original Duration</label>
            <input
              type="text"
              className="form-input"
              value={formData.originalDuration}
              onChange={(e) => setFormData({ ...formData, originalDuration: e.target.value })}
              placeholder="e.g. 16 Weeks"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Change Duration</label>
            <input
              type="text"
              className="form-input"
              value={formData.changeDuration}
              onChange={(e) => setFormData({ ...formData, changeDuration: e.target.value })}
              placeholder="e.g. 3 Weeks"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Revised Duration</label>
            <input
              type="text"
              className="form-input"
              value={formData.revisedDuration}
              onChange={(e) => setFormData({ ...formData, revisedDuration: e.target.value })}
              placeholder="e.g. 19 Weeks"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Original Baseline Deadline</label>
            <input
              type="date"
              className="form-input"
              value={formData.originalDeadline}
              onChange={(e) => setFormData({ ...formData, originalDeadline: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Revised Official Deadline</label>
            <input
              type="date"
              className="form-input"
              style={{ fontWeight: 600, color: 'var(--accent-rose)' }}
              value={formData.revisedDeadline}
              onChange={(e) => setFormData({ ...formData, revisedDeadline: e.target.value, deadline: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      {/* Objectives */}
      <div className="section-card glass-panel">
        <h3 className="section-card-title">
          <Target size={20} color="var(--primary)" />
          Project Objectives
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Document high-level measurable goals for project success.
        </p>

        <div className="list-builder-row">
          <input
            type="text"
            className="form-input"
            placeholder="Enter a project objective..."
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddListItem('objectives', newObjective, setNewObjective);
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            icon={Plus}
            onClick={() => handleAddListItem('objectives', newObjective, setNewObjective)}
          >
            Add
          </Button>
        </div>

        <div className="list-builder">
          {formData.objectives.map((obj, i) => (
            <div key={i} className="list-item-badge">
              <span>
                <strong>{i + 1}.</strong> {obj}
              </span>
              <button
                type="button"
                className="list-item-delete-btn"
                onClick={() => handleRemoveListItem('objectives', i)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Scope Boundaries */}
      <div className="section-card glass-panel">
        <h3 className="section-card-title">
          <Shield size={20} color="var(--accent-emerald)" />
          Scope Boundaries (In-Scope, Out-of-Scope, Assumptions & Constraints)
        </h3>

        <div className="dashboard-full-grid" style={{ marginTop: '1rem' }}>
          {/* In Scope */}
          <div className="form-section-box">
            <div className="form-section-title" style={{ color: '#34d399' }}>
              In Scope Items
            </div>
            <div className="list-builder-row">
              <input
                type="text"
                className="form-input"
                placeholder="Add in-scope feature or deliverable..."
                value={newInScope}
                onChange={(e) => setNewInScope(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddListItem('inScope', newInScope, setNewInScope);
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                icon={Plus}
                onClick={() => handleAddListItem('inScope', newInScope, setNewInScope)}
              >
                Add
              </Button>
            </div>
            <div className="list-builder">
              {formData.inScope.map((item, i) => (
                <div key={i} className="list-item-badge">
                  <span>✓ {item}</span>
                  <button
                    type="button"
                    className="list-item-delete-btn"
                    onClick={() => handleRemoveListItem('inScope', i)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Out of Scope */}
          <div className="form-section-box">
            <div className="form-section-title" style={{ color: '#fb7185' }}>
              Out of Scope (Explicit Exclusions)
            </div>
            <div className="list-builder-row">
              <input
                type="text"
                className="form-input"
                placeholder="Add excluded boundary..."
                value={newOutOfScope}
                onChange={(e) => setNewOutOfScope(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddListItem('outOfScope', newOutOfScope, setNewOutOfScope);
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                icon={Plus}
                onClick={() => handleAddListItem('outOfScope', newOutOfScope, setNewOutOfScope)}
              >
                Add
              </Button>
            </div>
            <div className="list-builder">
              {formData.outOfScope.map((item, i) => (
                <div key={i} className="list-item-badge">
                  <span>✕ {item}</span>
                  <button
                    type="button"
                    className="list-item-delete-btn"
                    onClick={() => handleRemoveListItem('outOfScope', i)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Assumptions */}
          <div className="form-section-box">
            <div className="form-section-title" style={{ color: '#38bdf8' }}>
              Project Assumptions
            </div>
            <div className="list-builder-row">
              <input
                type="text"
                className="form-input"
                placeholder="Add assumption..."
                value={newAssumption}
                onChange={(e) => setNewAssumption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddListItem('assumptions', newAssumption, setNewAssumption);
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                icon={Plus}
                onClick={() => handleAddListItem('assumptions', newAssumption, setNewAssumption)}
              >
                Add
              </Button>
            </div>
            <div className="list-builder">
              {formData.assumptions.map((item, i) => (
                <div key={i} className="list-item-badge">
                  <span>• {item}</span>
                  <button
                    type="button"
                    className="list-item-delete-btn"
                    onClick={() => handleRemoveListItem('assumptions', i)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Constraints */}
          <div className="form-section-box">
            <div className="form-section-title" style={{ color: '#fbbf24' }}>
              Project Constraints
            </div>
            <div className="list-builder-row">
              <input
                type="text"
                className="form-input"
                placeholder="Add constraint (budget, timeline, regulatory)..."
                value={newConstraint}
                onChange={(e) => setNewConstraint(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddListItem('constraints', newConstraint, setNewConstraint);
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                icon={Plus}
                onClick={() => handleAddListItem('constraints', newConstraint, setNewConstraint)}
              >
                Add
              </Button>
            </div>
            <div className="list-builder">
              {formData.constraints.map((item, i) => (
                <div key={i} className="list-item-badge">
                  <span>! {item}</span>
                  <button
                    type="button"
                    className="list-item-delete-btn"
                    onClick={() => handleRemoveListItem('constraints', i)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stakeholders */}
      <div className="section-card glass-panel">
        <div className="section-card-header">
          <h3 className="section-card-title">
            <Users size={20} color="var(--accent-cyan)" />
            Stakeholder Registry
          </h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={UserPlus}
            onClick={() => setShowShModal(true)}
          >
            Add Stakeholder
          </Button>
        </div>

        <StakeholderList
          stakeholders={formData.stakeholders}
          isEditing={true}
          onRemove={handleRemoveStakeholder}
        />
      </div>

      {/* Add Stakeholder Mini Modal / Form */}
      {showShModal && (
        <div className="modal-overlay" onClick={() => setShowShModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Stakeholder to Charter</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowShModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Dr. Ahmed"
                    value={shForm.name}
                    onChange={(e) => setShForm({ ...shForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Role <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Project Sponsor / Lead Doctor"
                    value={shForm.role}
                    onChange={(e) => setShForm({ ...shForm, role: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Organization</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Dental Clinic Board"
                    value={shForm.organization}
                    onChange={(e) => setShForm({ ...shForm, organization: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. ahmed@clinic.com"
                    value={shForm.email}
                    onChange={(e) => setShForm({ ...shForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Interest Level</label>
                  <select
                    className="form-select"
                    value={shForm.interest}
                    onChange={(e) => setShForm({ ...shForm, interest: e.target.value })}
                  >
                    <option value="High">High Interest</option>
                    <option value="Medium">Medium Interest</option>
                    <option value="Low">Low Interest</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Influence Level</label>
                  <select
                    className="form-select"
                    value={shForm.influence}
                    onChange={(e) => setShForm({ ...shForm, influence: e.target.value, influenceLevel: e.target.value })}
                  >
                    <option value="High">High Influence</option>
                    <option value="Medium">Medium Influence</option>
                    <option value="Low">Low Influence</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Key Responsibility</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Final budget authorization & clinical requirements sign-off"
                    value={shForm.responsibility}
                    onChange={(e) => setShForm({ ...shForm, responsibility: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button type="button" variant="secondary" onClick={() => setShowShModal(false)}>
                Cancel
              </Button>
              <Button type="button" variant="primary" onClick={handleAddStakeholder}>
                Add to List
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default CharterForm;
