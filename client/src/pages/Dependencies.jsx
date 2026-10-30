import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, PlusCircle, ArrowRight, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { scheduleService } from '../services/scheduleService';
import DependencyForm from '../components/schedule/DependencyForm';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';

const DependenciesPage = () => {
  const { currentProject } = useProjects();
  const navigate = useNavigate();

  const [dependencies, setDependencies] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      setError(null);
      const [depRes, actRes] = await Promise.all([
        scheduleService.getDependencies(currentProject.projectId),
        scheduleService.getActivities(currentProject.projectId)
      ]);
      setDependencies(depRes.data || []);
      setActivities(actRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load dependencies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
    return <Loading message="Loading activity dependency linkages..." />;
  }

  if (error) {
    return (
      <div className="page-body">
        <ErrorMessage message={error} onRetry={fetchData} />
      </div>
    );
  }

  const handleSave = async (formData) => {
    await scheduleService.createDependency(currentProject.projectId, formData);
    setModalOpen(false);
    await fetchData();
  };

  const handleDelete = async (id) => {
    await scheduleService.deleteDependency(id);
    await fetchData();
  };

  const actMap = {};
  activities.forEach((a) => (actMap[a.activityId] = a.name));

  return (
    <div className="page-body">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Network color="var(--primary)" size={28} />
            Activity Dependencies & Network
          </h1>
          <p>Module 3: Predecessor and successor linkages for critical path analysis and delay propagation</p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => setModalOpen(true)}
          disabled={activities.length < 2}
        >
          Add Dependency Link
        </Button>
      </div>

      {activities.length < 2 && (
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            borderLeft: '4px solid var(--accent-amber)',
            background: 'rgba(245, 158, 11, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#fbbf24', fontWeight: 600 }}>
            <AlertTriangle size={20} />
            <span>At least 2 activities are required to create dependency relationships.</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Go to Schedule &gt; Activities to add your work packages and scheduled tasks first.
          </p>
        </div>
      )}

      <div className="section-card glass-panel">
        {dependencies.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No dependency links created yet. Connect activities to establish the project critical path sequence.
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Dependency ID</th>
                  <th>Predecessor Activity</th>
                  <th>Relationship</th>
                  <th>Successor Activity</th>
                  <th>Lag (Days)</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {dependencies.map((dep) => (
                  <tr key={dep._id || dep.dependencyId}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 600 }}>
                      {dep.dependencyId}
                    </td>
                    <td>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>[{dep.predecessorActivity}]</span>{' '}
                        <span>{actMap[dep.predecessorActivity] || ''}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-planning" style={{ gap: '0.35rem' }}>
                        {dep.dependencyType} <ArrowRight size={12} />
                      </span>
                    </td>
                    <td>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>[{dep.successorActivity}]</span>{' '}
                        <span>{actMap[dep.successorActivity] || ''}</span>
                      </div>
                    </td>
                    <td>
                      {dep.lag > 0 ? `+${dep.lag} days` : '0 days'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="list-item-delete-btn"
                        onClick={() => handleDelete(dep._id)}
                        title="Delete Dependency"
                      >
                        <Trash2 size={16} />
                      </button>
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
        onClose={() => setModalOpen(false)}
        title="Add Activity Dependency Link"
      >
        <DependencyForm
          activities={activities}
          onSave={handleSave}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default DependenciesPage;
