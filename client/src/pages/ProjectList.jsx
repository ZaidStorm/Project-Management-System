import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderGit2, PlusCircle, Trash2, ArrowUpRight, Calendar, DollarSign, User } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { projectService } from '../services/projectService';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { formatDate } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';

const ProjectList = () => {
  const { projects, selectProject, fetchProjects } = useProjects();
  const navigate = useNavigate();

  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!projectToDelete) return;
    try {
      setDeleting(true);
      await projectService.delete(projectToDelete.projectId);
      await fetchProjects();
    } catch (err) {
      alert(err.message || 'Failed to delete project');
    } finally {
      setDeleting(false);
      setProjectToDelete(null);
    }
  };

  const handleSelect = (project) => {
    selectProject(project);
    navigate('/overview');
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase().replace(' ', '-');
    return <span className={`badge badge-${s}`}>● {status || 'Planning'}</span>;
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <FolderGit2 color="var(--primary)" size={28} />
            Projects Registry
          </h1>
          <p>All active, planning, and completed projects managed under PMS Core</p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => navigate('/projects/new')}
        >
          Create Project
        </Button>
      </div>

      <div className="section-card glass-panel">
        {projects.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700 }}>No Projects Registered Yet</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.35rem' }}>
              Create your first project to unlock the Project Charter, Management Plan, and Milestone tracker.
            </p>
            <div style={{ marginTop: '1.5rem' }}>
              <Button
                variant="primary"
                icon={PlusCircle}
                onClick={() => navigate('/projects/new')}
              >
                Create New Project
              </Button>
            </div>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project ID & Name</th>
                  <th>Manager</th>
                  <th>Timeline</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.projectId}>
                    <td>
                      <div>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            color: 'var(--primary)',
                            background: 'var(--primary-tint)',
                            padding: '0.15rem 0.4rem',
                            borderRadius: '4px',
                            fontWeight: 700,
                            display: 'inline-block',
                            marginBottom: '0.25rem',
                            border: '1px solid #ffedd5'
                          }}
                        >
                          {p.projectId}
                        </span>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                          {p.projectName}
                        </div>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '300px'
                          }}
                        >
                          {p.description}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <User size={14} color="var(--text-dim)" />
                        <span>{p.projectManager}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <div>Start: {formatDate(p.startDate)}</div>
                        <div>End: {formatDate(p.deadline)}</div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>
                      {formatCurrency(p.approvedBudget)}
                    </td>
                    <td>{getStatusBadge(p.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={ArrowUpRight}
                          onClick={() => handleSelect(p)}
                        >
                          Open
                        </Button>
                        <button
                          type="button"
                          className="list-item-delete-btn"
                          title="Delete Project"
                          onClick={() => setProjectToDelete(p)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Project & Associated Data"
        message={`Are you sure you want to permanently delete "${projectToDelete?.projectName}" (${projectToDelete?.projectId})? This action will cascade delete its Charter, Management Plan, Milestones, and Closure records.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Permanently'}
        danger={true}
      />
    </div>
  );
};

export default ProjectList;
