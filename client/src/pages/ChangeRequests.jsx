import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitPullRequest, PlusCircle, ArrowLeft, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { changeRequestService } from '../services/changeRequestService';
import ChangeRequestList from '../components/changeRequests/ChangeRequestList';
import ChangeRequestForm from '../components/changeRequests/ChangeRequestForm';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import { formatCurrency } from '../utils/formatCurrency';

const ChangeRequestsPage = () => {
  const { currentProject } = useProjects();
  const navigate = useNavigate();

  const [changeRequests, setChangeRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCR, setEditingCR] = useState(null);

  const fetchChangeRequests = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      setError(null);
      const res = await changeRequestService.getAll(currentProject.projectId);
      setChangeRequests(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load change requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChangeRequests();
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
    return <Loading message="Loading change requests and impact evaluations..." />;
  }

  if (error) {
    return (
      <div className="page-body">
        <ErrorMessage message={error} onRetry={fetchChangeRequests} />
      </div>
    );
  }

  const handleSave = async (formData) => {
    if (editingCR) {
      await changeRequestService.update(editingCR._id, formData);
    } else {
      await changeRequestService.create(currentProject.projectId, formData);
    }
    setModalOpen(false);
    setEditingCR(null);
    await fetchChangeRequests();
  };

  const handleApprove = async (cr) => {
    await changeRequestService.approve(cr._id, currentProject.projectManager || 'Change Control Board');
    await fetchChangeRequests();
  };

  const handleReject = async (cr) => {
    await changeRequestService.reject(cr._id, currentProject.projectManager || 'Change Control Board');
    await fetchChangeRequests();
  };

  const totalCostImpact = changeRequests
    .filter((cr) => cr.approvalStatus === 'Approved')
    .reduce((sum, cr) => sum + (cr.costImpact || 0), 0);

  const totalScheduleImpact = changeRequests
    .filter((cr) => cr.approvalStatus === 'Approved')
    .reduce((sum, cr) => sum + (cr.scheduleImpact || 0), 0);

  return (
    <div className="page-body">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <GitPullRequest color="var(--primary)" size={28} />
            Change Request Management (CCB)
          </h1>
          <p>Module 2: Log client modifications, conduct impact evaluations, and authorize scope baselines</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="primary"
            icon={PlusCircle}
            onClick={() => {
              setEditingCR(null);
              setModalOpen(true);
            }}
          >
            New Change Request
          </Button>
        </div>
      </div>

      {/* Impact KPI Summary */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.75rem',
          marginBottom: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Total Change Requests
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            {changeRequests.length}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Approved Changes Impact (Cost)
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-amber)', marginTop: '0.25rem' }}>
            +{formatCurrency(totalCostImpact)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Approved Changes Impact (Schedule)
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>
            +{totalScheduleImpact} Days
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Awaiting Review
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fb7185', marginTop: '0.25rem' }}>
            {changeRequests.filter((c) => c.approvalStatus === 'Pending').length} Pending
          </div>
        </div>
      </div>

      <ChangeRequestList
        changeRequests={changeRequests}
        onEdit={(cr) => {
          setEditingCR(cr);
          setModalOpen(true);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCR(null);
        }}
        title={editingCR ? `Edit Change Request: ${editingCR.changeRequestId}` : 'Log New Change Request'}
      >
        <ChangeRequestForm
          changeRequest={editingCR}
          onSave={handleSave}
          onCancel={() => {
            setModalOpen(false);
            setEditingCR(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default ChangeRequestsPage;
