import React, { useState } from 'react';
import { Save, X, Plus, Trash2, BookOpen, CheckCircle, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import { toInputDateFormat } from '../../utils/formatDate';

const ClosureForm = ({ closure, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    closureDate: toInputDateFormat(closure?.closureDate || new Date()),
    finalStatus: closure?.finalStatus || 'Completed',
    finalProgress: closure?.finalProgress ?? 100,
    finalBudget: closure?.finalBudget || 0,
    approvedBy: closure?.approvedBy || '',
    approvalStatus: closure?.approvalStatus || 'Pending',
    closureNotes: closure?.closureNotes || '',
    deliverablesCompleted: closure?.deliverablesCompleted || [],
    pendingItems: closure?.pendingItems || [],
    lessonsLearned: closure?.lessonsLearned || []
  });

  const [newDeliverable, setNewDeliverable] = useState('');
  const [newPending, setNewPending] = useState('');
  const [newLesson, setNewLesson] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = (field, val, setter) => {
    if (!val.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], val.trim()]
    }));
    setter('');
  };

  const handleRemove = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSave({
        ...formData,
        closureDate: formData.closureDate ? new Date(formData.closureDate) : new Date(),
        finalProgress: Number(formData.finalProgress) || 0,
        finalBudget: Number(formData.finalBudget) || 0
      });
    } catch (err) {
      alert(err.message || 'Failed to save project closure');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>Edit Project Closure</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Document project completion, realized budget, lessons learned, and obtain closure sign-off.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" icon={X} onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={Save} loading={saving}>
            Save Closure
          </Button>
        </div>
      </div>

      {/* Meta & Sign-Off Section */}
      <div className="section-card glass-panel">
        <h3 className="section-card-title">Sign-off & Closure Metadata</h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Closure Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.closureDate}
              onChange={(e) => setFormData({ ...formData, closureDate: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Final Outcome Classification</label>
            <select
              className="form-select"
              value={formData.finalStatus}
              onChange={(e) => setFormData({ ...formData, finalStatus: e.target.value })}
            >
              <option value="Completed">Completed (Successful)</option>
              <option value="Terminated">Terminated / Cancelled Early</option>
              <option value="Archived">Archived / Legacy</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Final Progress Achieved (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="form-input"
              value={formData.finalProgress}
              onChange={(e) => setFormData({ ...formData, finalProgress: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Final Realized Budget ($)</label>
            <input
              type="number"
              min="0"
              className="form-input"
              value={formData.finalBudget}
              onChange={(e) => setFormData({ ...formData, finalBudget: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Approval Authority (Sign-Off By)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dr. Ahmed (Project Sponsor)"
              value={formData.approvedBy}
              onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Closure Approval Status</label>
            <select
              className="form-select"
              value={formData.approvalStatus}
              onChange={(e) => setFormData({ ...formData, approvalStatus: e.target.value })}
            >
              <option value="Pending">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lessons Learned */}
      <div className="section-card glass-panel">
        <h3 className="section-card-title" style={{ color: 'var(--accent-amber)' }}>
          <BookOpen size={20} />
          Lessons Learned
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Document challenges faced, best practices, and insights to inform future modules and teams.
        </p>

        <div className="list-builder-row">
          <input
            type="text"
            className="form-input"
            placeholder="Document a lesson learned..."
            value={newLesson}
            onChange={(e) => setNewLesson(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd('lessonsLearned', newLesson, setNewLesson);
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            icon={Plus}
            onClick={() => handleAdd('lessonsLearned', newLesson, setNewLesson)}
          >
            Add
          </Button>
        </div>

        <div className="list-builder">
          {formData.lessonsLearned.map((lesson, i) => (
            <div key={i} className="list-item-badge">
              <span><strong>#{i + 1}</strong> {lesson}</span>
              <button
                type="button"
                className="list-item-delete-btn"
                onClick={() => handleRemove('lessonsLearned', i)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverables & Pending */}
      <div className="dashboard-full-grid">
        <div className="section-card glass-panel">
          <h3 className="section-card-title" style={{ color: 'var(--accent-emerald)' }}>
            <CheckCircle size={18} /> Deliverables Completed
          </h3>
          <div className="list-builder-row">
            <input
              type="text"
              className="form-input"
              placeholder="Add completed deliverable..."
              value={newDeliverable}
              onChange={(e) => setNewDeliverable(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd('deliverablesCompleted', newDeliverable, setNewDeliverable);
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              icon={Plus}
              onClick={() => handleAdd('deliverablesCompleted', newDeliverable, setNewDeliverable)}
            >
              Add
            </Button>
          </div>
          <div className="list-builder">
            {formData.deliverablesCompleted.map((del, i) => (
              <div key={i} className="list-item-badge">
                <span>✓ {del}</span>
                <button
                  type="button"
                  className="list-item-delete-btn"
                  onClick={() => handleRemove('deliverablesCompleted', i)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card glass-panel">
          <h3 className="section-card-title" style={{ color: 'var(--accent-rose)' }}>
            <AlertTriangle size={18} /> Pending Handover Items
          </h3>
          <div className="list-builder-row">
            <input
              type="text"
              className="form-input"
              placeholder="Add post-closure or handover task..."
              value={newPending}
              onChange={(e) => setNewPending(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd('pendingItems', newPending, setNewPending);
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              icon={Plus}
              onClick={() => handleAdd('pendingItems', newPending, setNewPending)}
            >
              Add
            </Button>
          </div>
          <div className="list-builder">
            {formData.pendingItems.map((item, i) => (
              <div key={i} className="list-item-badge">
                <span>! {item}</span>
                <button
                  type="button"
                  className="list-item-delete-btn"
                  onClick={() => handleRemove('pendingItems', i)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Closure Notes */}
      <div className="section-card glass-panel">
        <h3 className="section-card-title">Project Closure Summary & Handover Notes</h3>
        <textarea
          className="form-textarea"
          rows="3"
          placeholder="Summary of client satisfaction, maintenance handover, operational transition..."
          value={formData.closureNotes}
          onChange={(e) => setFormData({ ...formData, closureNotes: e.target.value })}
        />
      </div>
    </form>
  );
};

export default ClosureForm;
