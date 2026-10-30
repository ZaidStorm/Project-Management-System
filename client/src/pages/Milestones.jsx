import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Milestone as MilestoneIcon, PlusCircle, CheckCircle2, Clock, PlayCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useMilestones } from '../hooks/useMilestones';
import MilestoneList from '../components/milestones/MilestoneList';
import MilestoneForm from '../components/milestones/MilestoneForm';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';

const MilestonesPage = () => {
  const { currentProject } = useProjects();
  const navigate = useNavigate();

  const {
    milestones,
    loading,
    error,
    refresh,
    addMilestone,
    updateMilestone,
    deleteMilestone
  } = useMilestones(currentProject?.projectId);

  const [filter, setFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [milestoneToDelete, setMilestoneToDelete] = useState(null);

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
    return <Loading message="Loading milestones and progress trackers..." />;
  }

  if (error) {
    return (
      <div className="page-body">
        <ErrorMessage message={error} onRetry={refresh} />
      </div>
    );
  }

  const handleOpenCreate = () => {
    setEditingMilestone(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (m) => {
    setEditingMilestone(m);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    if (editingMilestone) {
      await updateMilestone(editingMilestone._id, formData);
    } else {
      await addMilestone(formData);
    }
    setModalOpen(false);
    setEditingMilestone(null);
  };

  const handleDelete = async () => {
    if (!milestoneToDelete) return;
    await deleteMilestone(milestoneToDelete._id);
    setMilestoneToDelete(null);
  };

  const filteredMilestones = milestones.filter((m) => {
    if (filter === 'ALL') return true;
    return m.status?.toUpperCase() === filter;
  });

  const totalCount = milestones.length;
  const completedCount = milestones.filter((m) => m.status === 'Completed').length;
  const inProgressCount = milestones.filter((m) => m.status === 'In Progress').length;
  const pendingCount = milestones.filter((m) => m.status === 'Pending').length;

  return (
    <div className="page-body">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <MilestoneIcon color="var(--primary)" size={28} />
            Milestones Management
          </h1>
          <p>Schedule deliverables, assign leads, track dates and progress percentages</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/overview')}>
            Back to Overview
          </Button>
          <Button variant="primary" icon={PlusCircle} onClick={handleOpenCreate}>
            Add Milestone
          </Button>
        </div>
      </div>

      {/* Milestone Filters & Quick Counter */}
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
          <button
            type="button"
            className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('ALL')}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filter === 'COMPLETED' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('COMPLETED')}
          >
            Completed ({completedCount})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filter === 'IN PROGRESS' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('IN PROGRESS')}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filter === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('PENDING')}
          >
            Pending ({pendingCount})
          </button>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Tracking for Project: <strong style={{ color: 'var(--text-main)' }}>[{currentProject.projectId}] {currentProject.projectName}</strong>
        </div>
      </div>

      {/* Milestone List */}
      <MilestoneList
        milestones={filteredMilestones}
        onEdit={handleOpenEdit}
        onDelete={(m) => setMilestoneToDelete(m)}
      />

      {/* Create / Edit Milestone Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingMilestone(null);
        }}
        title={editingMilestone ? `Edit Milestone: ${editingMilestone.milestoneId}` : 'Add New Milestone'}
      >
        <MilestoneForm
          milestone={editingMilestone}
          onSave={handleSave}
          onCancel={() => {
            setModalOpen(false);
            setEditingMilestone(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!milestoneToDelete}
        onClose={() => setMilestoneToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Milestone"
        message={`Are you sure you want to delete milestone "${milestoneToDelete?.title}" (${milestoneToDelete?.milestoneId})?`}
        confirmText="Delete"
        danger={true}
      />
    </div>
  );
};

export default MilestonesPage;
