import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, PlusCircle, ArrowLeft, Filter, CheckCircle } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { requirementService } from '../services/requirementService';
import RequirementList from '../components/scope/RequirementList';
import RequirementForm from '../components/scope/RequirementForm';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';

const RequirementsPage = () => {
  const { currentProject } = useProjects();
  const navigate = useNavigate();

  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingReq, setEditingReq] = useState(null);
  const [reqToDelete, setReqToDelete] = useState(null);
  const [filterType, setFilterType] = useState('ALL');

  const fetchRequirements = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      setError(null);
      const res = await requirementService.getAll(currentProject.projectId);
      setRequirements(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load requirements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
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
    return <Loading message="Loading project requirements registry..." />;
  }

  if (error) {
    return (
      <div className="page-body">
        <ErrorMessage message={error} onRetry={fetchRequirements} />
      </div>
    );
  }

  const handleSave = async (formData) => {
    if (editingReq) {
      await requirementService.update(editingReq._id, formData);
    } else {
      await requirementService.create(currentProject.projectId, formData);
    }
    setModalOpen(false);
    setEditingReq(null);
    await fetchRequirements();
  };

  const handleApprove = async (req) => {
    await requirementService.approve(req._id, currentProject.projectManager || 'Project Sponsor');
    await fetchRequirements();
  };

  const handleReject = async (req) => {
    await requirementService.reject(req._id, currentProject.projectManager || 'Project Sponsor');
    await fetchRequirements();
  };

  const handleDelete = async () => {
    if (!reqToDelete) return;
    try {
      await requirementService.delete(reqToDelete._id);
      await fetchRequirements();
    } catch (err) {
      alert(err.message);
    } finally {
      setReqToDelete(null);
    }
  };

  const filtered = requirements.filter((r) => {
    if (filterType === 'ALL') return true;
    return r.type?.toUpperCase() === filterType;
  });

  return (
    <div className="page-body">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <FileText color="var(--primary)" size={28} />
            Requirements Management
          </h1>
          <p>Module 2: Capture, prioritize, review, and formally approve business & technical requirements</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" icon={CheckCircle} onClick={() => navigate('/approved-scope')}>
            View Approved Scope
          </Button>
          <Button
            variant="primary"
            icon={PlusCircle}
            onClick={() => {
              setEditingReq(null);
              setModalOpen(true);
            }}
          >
            New Requirement
          </Button>
        </div>
      </div>

      {/* Filter Chips */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['ALL', 'FUNCTIONAL', 'NON-FUNCTIONAL', 'BUSINESS', 'TECHNICAL', 'REGULATORY'].map((t) => (
            <button
              key={t}
              type="button"
              className={`btn btn-sm ${filterType === t ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType(t)}
            >
              {t === 'ALL' ? `All (${requirements.length})` : t}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Approved: <strong style={{ color: '#34d399' }}>{requirements.filter((r) => r.approvalStatus === 'Approved').length}</strong> | Pending: <strong style={{ color: '#fbbf24' }}>{requirements.filter((r) => r.approvalStatus !== 'Approved').length}</strong>
        </div>
      </div>

      <RequirementList
        requirements={filtered}
        onEdit={(r) => {
          setEditingReq(r);
          setModalOpen(true);
        }}
        onDelete={(r) => setReqToDelete(r)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Requirement Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingReq(null);
        }}
        title={editingReq ? `Edit Requirement: ${editingReq.requirementId}` : 'Add New Requirement'}
      >
        <RequirementForm
          requirement={editingReq}
          onSave={handleSave}
          onCancel={() => {
            setModalOpen(false);
            setEditingReq(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!reqToDelete}
        onClose={() => setReqToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Requirement"
        message={`Are you sure you want to delete requirement "${reqToDelete?.title}" (${reqToDelete?.requirementId})?`}
        confirmText="Delete"
        danger={true}
      />
    </div>
  );
};

export default RequirementsPage;
