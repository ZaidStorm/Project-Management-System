import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, PlusCircle, ArrowLeft, Mail, DollarSign, Edit2, Trash2 } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { scheduleService } from '../services/scheduleService';
import ResourceForm from '../components/resources/ResourceForm';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import { formatCurrency } from '../utils/formatCurrency';

const ResourcesPage = () => {
  const { currentProject } = useProjects();
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  const fetchResources = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      setError(null);
      const res = await scheduleService.getResources(currentProject.projectId);
      setResources(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [currentProject]);

  if (!currentProject) {
    return (
      <div className="page-body">
        <div className="section-card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No project selected. Please choose a project or create a new one.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading message="Loading team resources..." />;
  }

  if (error) {
    return (
      <div className="page-body">
        <ErrorMessage message={error} onRetry={fetchResources} />
      </div>
    );
  }

  const handleSave = async (formData) => {
    if (editingResource) {
      await scheduleService.updateResource(editingResource._id, formData);
    } else {
      await scheduleService.createResource(currentProject.projectId, formData);
    }
    setModalOpen(false);
    setEditingResource(null);
    await fetchResources();
  };

  const handleDelete = async () => {
    if (!resourceToDelete) return;
    await scheduleService.deleteResource(resourceToDelete._id);
    setResourceToDelete(null);
    await fetchResources();
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Users color="var(--primary)" size={28} />
            Resource Management
          </h1>
          <p>Module 3: Manage project team members, roles, availability capacity, and hourly cost rates</p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => {
            setEditingResource(null);
            setModalOpen(true);
          }}
        >
          Add Team Member
        </Button>
      </div>

      <div className="section-card glass-panel">
        {resources.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No team members added yet. Click "+ Add Team Member" to configure your project resources.
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Resource ID & Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Availability</th>
                  <th>Hourly Rate</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((res) => (
                  <tr key={res._id || res.resourceId}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'rgba(99, 102, 241, 0.15)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.8rem'
                          }}
                        >
                          {res.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{res.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                            {res.resourceId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--accent-teal)', fontWeight: 600 }}>{res.role}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{res.email || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="progress-container" style={{ width: '60px', height: '6px' }}>
                          <div className="progress-bar-fill" style={{ width: `${res.availability || 100}%` }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600 }}>{res.availability || 100}%</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>
                      {formatCurrency(res.hourlyRate)}/hr
                    </td>
                    <td>
                      <span className={`badge badge-${res.status === 'Active' ? 'completed' : 'draft'}`}>
                        {res.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          type="button"
                          className="list-item-delete-btn"
                          onClick={() => {
                            setEditingResource(res);
                            setModalOpen(true);
                          }}
                          title="Edit Resource"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          className="list-item-delete-btn"
                          onClick={() => setResourceToDelete(res)}
                          title="Delete Resource"
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

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingResource(null);
        }}
        title={editingResource ? `Edit Team Member: ${editingResource.name}` : 'Add Project Resource'}
      >
        <ResourceForm
          resource={editingResource}
          onSave={handleSave}
          onCancel={() => {
            setModalOpen(false);
            setEditingResource(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!resourceToDelete}
        onClose={() => setResourceToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Team Member"
        message={`Are you sure you want to remove ${resourceToDelete?.name} from project resources?`}
        confirmText="Remove Resource"
        danger={true}
      />
    </div>
  );
};

export default ResourcesPage;
