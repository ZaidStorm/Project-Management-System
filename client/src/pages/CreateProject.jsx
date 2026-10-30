import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderPlus, ArrowLeft, Save, Sparkles } from 'lucide-react';
import { projectService } from '../services/projectService';
import { useProjects } from '../hooks/useProjects';
import Button from '../components/common/Button';

const CreateProject = () => {
  const navigate = useNavigate();
  const { fetchProjects, selectProject } = useProjects();

  const [formData, setFormData] = useState({
    projectId: '',
    projectName: '',
    description: '',
    projectManager: '',
    startDate: new Date().toISOString().split('T')[0],
    deadline: '',
    approvedBudget: '',
    status: 'Planning'
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.projectName.trim() || !formData.projectManager.trim() || !formData.startDate || !formData.deadline) {
      setError('Please provide all required fields: Project Name, Manager, Start Date, and Deadline.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        projectId: formData.projectId.trim() ? formData.projectId.trim().toUpperCase() : undefined,
        approvedBudget: Number(formData.approvedBudget) || 0,
        startDate: new Date(formData.startDate),
        deadline: new Date(formData.deadline)
      };

      const res = await projectService.create(payload);
      const created = res.data;

      await fetchProjects(created.projectId);
      selectProject(created);
      navigate('/overview');
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <FolderPlus color="var(--primary)" size={28} />
            Create New Project
          </h1>
          <p>Initiate a new project record and automatically initialize its Module 1 governance structure</p>
        </div>

        <Button
          variant="secondary"
          icon={ArrowLeft}
          onClick={() => navigate('/projects')}
        >
          Back to Projects
        </Button>
      </div>

      <div
        className="section-card glass-panel"
        style={{ maxWidth: '820px', margin: '0 auto' }}
      >
        {error && (
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              marginBottom: '1.5rem',
              fontSize: '0.875rem'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Project ID (Optional)
                <span className="form-help">Leave empty to auto-generate (e.g. PRJ-001)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. PRJ-001"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Initial Status
              </label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="At Risk">At Risk</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Project Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Hospital Management System"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project Description</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="Brief summary of the business objectives and target solution..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Project Type</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Software Development"
                value={formData.projectType || 'Software Development'}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Client / Sponsor</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Network of Five Hospitals"
                value={formData.client || 'Network of Five Hospitals'}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={formData.priority || 'High'}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
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
              <label className="form-label">
                Project Manager <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Project Manager"
                value={formData.projectManager}
                onChange={(e) => setFormData({ ...formData, projectManager: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Approved Base Budget (PKR) <span className="required">*</span>
              </label>
              <input
                type="number"
                min="0"
                className="form-input"
                placeholder="e.g. 5000000"
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
                min="0"
                className="form-input"
                placeholder="e.g. 800000"
                value={formData.changeCost || ''}
                onChange={(e) => {
                  const extra = Number(e.target.value) || 0;
                  const base = Number(formData.approvedBudget) || 0;
                  setFormData({
                    ...formData,
                    changeCost: extra,
                    revisedBudget: base + extra
                  });
                }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Estimated Duration</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 16 Weeks"
                value={formData.originalDuration || '16 Weeks'}
                onChange={(e) => setFormData({ ...formData, originalDuration: e.target.value })}
              />
            </div>

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
                Target Deadline <span className="required">*</span>
              </label>
              <input
                type="date"
                className="form-input"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-tint)',
              border: '1px solid rgba(234, 88, 12, 0.2)',
              margin: '1.5rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <Sparkles size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Creating this project will automatically scaffold linked companion records for{' '}
              <strong style={{ color: 'var(--text-main)' }}>Project Charter</strong>,{' '}
              <strong style={{ color: 'var(--text-main)' }}>Management Plan</strong>, and{' '}
              <strong style={{ color: 'var(--text-main)' }}>Project Status</strong> so you can configure them immediately.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/projects')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              loading={saving}
            >
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
