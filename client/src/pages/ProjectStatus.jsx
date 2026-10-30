import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  Award,
  ShieldAlert,
  ArrowRightCircle,
  Users,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Calendar,
  UserCheck,
  ArrowLeft
} from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { statusService } from '../services/statusService';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import { formatDate, toInputDateFormat } from '../utils/formatDate';

const ProjectStatusPage = () => {
  const { currentProject } = useProjects();
  const navigate = useNavigate();

  const [statusData, setStatusData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Dynamic input states for editing
  const [newIssue, setNewIssue] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newRisk, setNewRisk] = useState('');
  const [newNextAction, setNewNextAction] = useState('');

  // Responsibility item input state
  const [respForm, setRespForm] = useState({
    person: '',
    role: '',
    responsibility: '',
    startDate: '',
    endDate: '',
    status: 'Pending'
  });
  const [showRespModal, setShowRespModal] = useState(false);

  const fetchStatus = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      setError(null);
      const res = await statusService.getByProjectId(currentProject.projectId);
      setStatusData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load project status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [currentProject]);

  if (!currentProject) {
    return (
      <div className="page-body">
        <div className="section-card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No project selected. Please choose a project or create a new one.</p>
          <div style={{ marginTop: '1rem' }}>
            <Button variant="primary" onClick={() => navigate('/projects/new')}>
              Create Project
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading message="Loading project status & responsibilities tracking..." />;
  }

  if (error) {
    return (
      <div className="page-body">
        <ErrorMessage message={error} onRetry={fetchStatus} />
      </div>
    );
  }

  const handleAddListItem = (field, value, setValue) => {
    if (!value.trim()) return;
    setStatusData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()]
    }));
    setValue('');
  };

  const handleRemoveListItem = (field, index) => {
    setStatusData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleAddResponsibility = (e) => {
    e.preventDefault();
    if (!respForm.person.trim() || !respForm.role.trim() || !respForm.responsibility.trim()) return;

    setStatusData((prev) => ({
      ...prev,
      responsibilities: [
        ...(prev.responsibilities || []),
        {
          ...respForm,
          startDate: respForm.startDate ? new Date(respForm.startDate) : undefined,
          endDate: respForm.endDate ? new Date(respForm.endDate) : undefined
        }
      ]
    }));

    setRespForm({
      person: '',
      role: '',
      responsibility: '',
      startDate: '',
      endDate: '',
      status: 'Pending'
    });
    setShowRespModal(false);
  };

  const handleRemoveResponsibility = (index) => {
    setStatusData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const res = await statusService.update(currentProject.projectId, statusData);
      setStatusData(res.data);
      setIsEditing(false);
    } catch (err) {
      alert(err.message || 'Failed to update project status');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Activity color="var(--primary)" size={28} />
            Project Status & Responsibilities
          </h1>
          <p>Real-time execution status, issues, achievements, risks, next actions, and role responsibilities</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/overview')}>
            Back to Overview
          </Button>
          {isEditing ? (
            <>
              <Button variant="secondary" icon={X} onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button variant="primary" icon={Save} loading={saving} onClick={handleSave}>
                Save Status
              </Button>
            </>
          ) : (
            <Button variant="primary" icon={Edit3} onClick={() => setIsEditing(true)}>
              Update Status
            </Button>
          )}
        </div>
      </div>

      {/* Main Status Strip */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          marginBottom: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Overall Status
          </div>
          {isEditing ? (
            <select
              className="form-select"
              style={{ marginTop: '0.4rem' }}
              value={statusData.overallStatus}
              onChange={(e) => setStatusData({ ...statusData, overallStatus: e.target.value })}
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="At Risk">At Risk</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          ) : (
            <div style={{ marginTop: '0.4rem' }}>
              <span className={`badge badge-${(statusData.overallStatus || 'planning').toLowerCase().replace(' ', '-')}`}>
                ● {statusData.overallStatus}
              </span>
            </div>
          )}
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Execution Progress
          </div>
          {isEditing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem' }}>
              <input
                type="number"
                min="0"
                max="100"
                className="form-input"
                style={{ width: '80px' }}
                value={statusData.progress}
                onChange={(e) => setStatusData({ ...statusData, progress: Number(e.target.value) || 0 })}
              />
              <span style={{ color: 'var(--text-main)' }}>%</span>
            </div>
          ) : (
            <div style={{ marginTop: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{statusData.progress}%</span>
              </div>
              <div className="progress-container" style={{ height: '6px' }}>
                <div className="progress-bar-fill" style={{ width: `${statusData.progress}%` }} />
              </div>
            </div>
          )}
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Current Lifecycle Phase
          </div>
          {isEditing ? (
            <input
              type="text"
              className="form-input"
              style={{ marginTop: '0.4rem' }}
              value={statusData.currentPhase}
              onChange={(e) => setStatusData({ ...statusData, currentPhase: e.target.value })}
            />
          ) : (
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1.1rem', marginTop: '0.4rem' }}>
              {statusData.currentPhase || 'Initiation'}
            </div>
          )}
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Updated By
          </div>
          {isEditing ? (
            <input
              type="text"
              className="form-input"
              style={{ marginTop: '0.4rem' }}
              value={statusData.updatedBy}
              onChange={(e) => setStatusData({ ...statusData, updatedBy: e.target.value })}
            />
          ) : (
            <div style={{ fontWeight: 500, color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
              {statusData.updatedBy || 'Project Manager'}
            </div>
          )}
        </div>
      </div>

      {/* Grid: Current Issues, Achievements, Risks, Next Actions */}
      <div className="dashboard-full-grid" style={{ marginBottom: '2rem' }}>
        {/* Achievements */}
        <div className="section-card glass-panel">
          <div className="section-card-header">
            <h3 className="section-card-title" style={{ color: '#34d399' }}>
              <Award size={18} />
              Recent Achievements
            </h3>
          </div>
          {isEditing && (
            <div className="list-builder-row" style={{ marginBottom: '0.75rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add recent achievement..."
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddListItem('achievements', newAchievement, setNewAchievement);
                  }
                }}
              />
              <Button
                size="sm"
                variant="secondary"
                icon={Plus}
                onClick={() => handleAddListItem('achievements', newAchievement, setNewAchievement)}
              >
                Add
              </Button>
            </div>
          )}
          {(!statusData.achievements || statusData.achievements.length === 0) ? (
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No achievements recorded.</p>
          ) : (
            <div className="list-builder">
              {statusData.achievements.map((item, i) => (
                <div key={i} className="list-item-badge">
                  <span>✓ {item}</span>
                  {isEditing && (
                    <button
                      type="button"
                      className="list-item-delete-btn"
                      onClick={() => handleRemoveListItem('achievements', i)}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Issues */}
        <div className="section-card glass-panel">
          <div className="section-card-header">
            <h3 className="section-card-title" style={{ color: '#fb7185' }}>
              <AlertTriangle size={18} />
              Current Issues & Blockers
            </h3>
          </div>
          {isEditing && (
            <div className="list-builder-row" style={{ marginBottom: '0.75rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add current issue or blocker..."
                value={newIssue}
                onChange={(e) => setNewIssue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddListItem('currentIssues', newIssue, setNewIssue);
                  }
                }}
              />
              <Button
                size="sm"
                variant="secondary"
                icon={Plus}
                onClick={() => handleAddListItem('currentIssues', newIssue, setNewIssue)}
              >
                Add
              </Button>
            </div>
          )}
          {(!statusData.currentIssues || statusData.currentIssues.length === 0) ? (
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No critical issues reported.</p>
          ) : (
            <div className="list-builder">
              {statusData.currentIssues.map((item, i) => (
                <div key={i} className="list-item-badge">
                  <span>⚠ {item}</span>
                  {isEditing && (
                    <button
                      type="button"
                      className="list-item-delete-btn"
                      onClick={() => handleRemoveListItem('currentIssues', i)}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Project Risks */}
        <div className="section-card glass-panel">
          <div className="section-card-header">
            <h3 className="section-card-title" style={{ color: '#fbbf24' }}>
              <ShieldAlert size={18} />
              Identified Risks
            </h3>
          </div>
          {isEditing && (
            <div className="list-builder-row" style={{ marginBottom: '0.75rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add risk..."
                value={newRisk}
                onChange={(e) => setNewRisk(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddListItem('risks', newRisk, setNewRisk);
                  }
                }}
              />
              <Button
                size="sm"
                variant="secondary"
                icon={Plus}
                onClick={() => handleAddListItem('risks', newRisk, setNewRisk)}
              >
                Add
              </Button>
            </div>
          )}
          {(!statusData.risks || statusData.risks.length === 0) ? (
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No active risks tracked.</p>
          ) : (
            <div className="list-builder">
              {statusData.risks.map((item, i) => (
                <div key={i} className="list-item-badge">
                  <span>! {item}</span>
                  {isEditing && (
                    <button
                      type="button"
                      className="list-item-delete-btn"
                      onClick={() => handleRemoveListItem('risks', i)}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Next Actions */}
        <div className="section-card glass-panel">
          <div className="section-card-header">
            <h3 className="section-card-title" style={{ color: '#38bdf8' }}>
              <ArrowRightCircle size={18} />
              Next Scheduled Actions
            </h3>
          </div>
          {isEditing && (
            <div className="list-builder-row" style={{ marginBottom: '0.75rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add immediate next action..."
                value={newNextAction}
                onChange={(e) => setNewNextAction(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddListItem('nextActions', newNextAction, setNewNextAction);
                  }
                }}
              />
              <Button
                size="sm"
                variant="secondary"
                icon={Plus}
                onClick={() => handleAddListItem('nextActions', newNextAction, setNewNextAction)}
              >
                Add
              </Button>
            </div>
          )}
          {(!statusData.nextActions || statusData.nextActions.length === 0) ? (
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No next actions scheduled.</p>
          ) : (
            <div className="list-builder">
              {statusData.nextActions.map((item, i) => (
                <div key={i} className="list-item-badge">
                  <span>➔ {item}</span>
                  {isEditing && (
                    <button
                      type="button"
                      className="list-item-delete-btn"
                      onClick={() => handleRemoveListItem('nextActions', i)}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section 10: Responsibilities Table */}
      <div className="section-card glass-panel">
        <div className="section-card-header">
          <h3 className="section-card-title">
            <Users size={20} color="var(--primary)" />
            Team Responsibilities Matrix
          </h3>
          {isEditing && (
            <Button
              size="sm"
              variant="secondary"
              icon={Plus}
              onClick={() => setShowRespModal(true)}
            >
              Add Responsibility Assignment
            </Button>
          )}
        </div>

        {(!statusData.responsibilities || statusData.responsibilities.length === 0) ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-dim)' }}>
            No team responsibilities defined yet. Click "Update Status" to assign project roles and tasks.
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Role</th>
                  <th>Responsibility</th>
                  <th>Timeline</th>
                  <th>Status</th>
                  {isEditing && <th style={{ textAlign: 'right' }}>Action</th>}
                </tr>
              </thead>
              <tbody>
                {statusData.responsibilities.map((r, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{r.person}</td>
                    <td style={{ color: 'var(--primary)', fontWeight: 500 }}>{r.role}</td>
                    <td>{r.responsibility}</td>
                    <td>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {formatDate(r.startDate)} — {formatDate(r.endDate)}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${(r.status || 'pending').toLowerCase().replace(' ', '-')}`}>
                        {r.status}
                      </span>
                    </td>
                    {isEditing && (
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="list-item-delete-btn"
                          onClick={() => handleRemoveResponsibility(idx)}
                          title="Remove Assignment"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Responsibility Modal */}
      {showRespModal && (
        <div className="modal-overlay" onClick={() => setShowRespModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Role Responsibility</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowRespModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Person Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sara Khan"
                    value={respForm.person}
                    onChange={(e) => setRespForm({ ...respForm, person: e.target.value })}
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
                    placeholder="e.g. UI Designer / Backend Dev"
                    value={respForm.role}
                    onChange={(e) => setRespForm({ ...respForm, role: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Specific Responsibility <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Design user interface and conduct clinic staff usability trials"
                  value={respForm.responsibility}
                  onChange={(e) => setRespForm({ ...respForm, responsibility: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={respForm.startDate}
                    onChange={(e) => setRespForm({ ...respForm, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={respForm.endDate}
                    onChange={(e) => setRespForm({ ...respForm, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Assignment Status</label>
                <select
                  className="form-select"
                  value={respForm.status}
                  onChange={(e) => setRespForm({ ...respForm, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <Button type="button" variant="secondary" onClick={() => setShowRespModal(false)}>
                Cancel
              </Button>
              <Button type="button" variant="primary" onClick={handleAddResponsibility}>
                Assign Responsibility
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectStatusPage;
