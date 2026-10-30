import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, PlusCircle, AlertCircle, Clock, CheckCircle2, PlayCircle, BarChart2, Edit2, Trash2 } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { scheduleService } from '../services/scheduleService';
import { wbsService } from '../services/wbsService';
import ActivityForm from '../components/schedule/ActivityForm';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import { formatDate } from '../utils/formatDate';

const ActivitiesPage = () => {
  const { currentProject } = useProjects();
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [wbsNodes, setWbsNodes] = useState([]);
  const [resources, setResources] = useState([]);
  const [delayData, setDelayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [activityToDelete, setActivityToDelete] = useState(null);

  const fetchData = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      setError(null);
      const [actRes, wbsRes, resRes, delayRes] = await Promise.all([
        scheduleService.getActivities(currentProject.projectId),
        wbsService.getAll(currentProject.projectId),
        scheduleService.getResources(currentProject.projectId),
        scheduleService.getDelays(currentProject.projectId)
      ]);
      setActivities(actRes.data || []);
      setWbsNodes(wbsRes.data || []);
      setResources(resRes.data || []);
      setDelayData(delayRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load activities');
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
    return <Loading message="Loading schedule activities & delay detection analysis..." />;
  }

  if (error) {
    return (
      <div className="page-body">
        <ErrorMessage message={error} onRetry={fetchData} />
      </div>
    );
  }

  const handleSave = async (formData) => {
    if (editingActivity) {
      await scheduleService.updateActivity(editingActivity._id, formData);
    } else {
      await scheduleService.createActivity(currentProject.projectId, formData);
    }
    setModalOpen(false);
    setEditingActivity(null);
    await fetchData();
  };

  const handleDelete = async () => {
    if (!activityToDelete) return;
    await scheduleService.deleteActivity(activityToDelete._id);
    setActivityToDelete(null);
    await fetchData();
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Calendar color="var(--primary)" size={28} />
            Schedule Activities Management
          </h1>
          <p>Module 3: Schedule WBS work packages into discrete activities, monitor durations, and detect delays</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" icon={BarChart2} onClick={() => navigate('/gantt')}>
            Gantt Chart View
          </Button>
          <Button
            variant="primary"
            icon={PlusCircle}
            onClick={() => {
              setEditingActivity(null);
              setModalOpen(true);
            }}
          >
            New Activity
          </Button>
        </div>
      </div>

      {/* Delay Warnings Banner if any delays detected */}
      {delayData && delayData.delays && delayData.delays.length > 0 && (
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            borderLeft: '4px solid var(--accent-rose)',
            background: 'rgba(244, 63, 94, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#fb7185', fontWeight: 700 }}>
            <AlertCircle size={20} />
            <span>Schedule Delay Alert: {delayData.delays.length} activity delay(s) detected!</span>
          </div>
          <ul style={{ listStyle: 'none', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
            {delayData.delays.map((d, i) => (
              <li key={i} style={{ color: 'var(--text-main)' }}>
                • {d.type === 'Overdue Activity' ? (
                  <span>
                    Activity <strong>[{d.activityId}] {d.name}</strong> is overdue by <strong>{d.daysDelayed} day(s)</strong>.
                  </span>
                ) : (
                  <span>
                    Cascading Delay: Predecessor <strong>[{d.predecessor}]</strong> finish delays successor <strong>[{d.successor}]</strong> by <strong>{d.impactDays} day(s)</strong>.
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Schedule Health Summary Card matching Wireframe 3.7 */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.75rem',
          marginBottom: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.5rem'
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Total Activities
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
            {activities.length}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Completed
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-emerald)', marginTop: '0.2rem' }}>
            {activities.filter((a) => a.status === 'Completed').length}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            In Progress
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
            {activities.filter((a) => a.status === 'In Progress').length}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Delayed / At Risk
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fb7185', marginTop: '0.2rem' }}>
            {delayData?.delays?.length || 0}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Schedule Health
          </div>
          <div style={{ marginTop: '0.35rem' }}>
            <span className={`badge ${delayData?.delays?.length > 0 ? 'badge-at-risk' : 'badge-completed'}`}>
              ● {delayData?.delays?.length > 0 ? '⚠ At Risk' : 'Healthy / On Schedule'}
            </span>
          </div>
        </div>
      </div>

      {/* Activities Table */}
      <div className="section-card glass-panel">
        {activities.length === 0 ? (
          <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No activities scheduled yet. Click "+ New Activity" to link tasks to your WBS work packages.
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Activity ID & Title</th>
                  <th>WBS Ref</th>
                  <th>Timeline</th>
                  <th>Assigned Team</th>
                  <th>Hours (Est/Act)</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((act) => (
                  <tr key={act._id || act.activityId}>
                    <td>
                      <div>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            color: 'var(--primary)',
                            background: 'rgba(99, 102, 241, 0.1)',
                            padding: '0.15rem 0.4rem',
                            borderRadius: '4px',
                            fontWeight: 600,
                            display: 'inline-block',
                            marginBottom: '0.2rem'
                          }}
                        >
                          {act.activityId}
                        </span>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                          {act.name}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-planning" style={{ fontSize: '0.75rem' }}>
                        {act.wbsId}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <div>{formatDate(act.startDate)}</div>
                        <div>to {formatDate(act.endDate)} ({act.duration || 1}d)</div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {(!act.assignedResources || act.assignedResources.length === 0) ? (
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Unassigned</span>
                        ) : (
                          act.assignedResources.map((res, i) => (
                            <span key={i} className="badge badge-draft" style={{ fontSize: '0.7rem' }}>
                              {res}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{act.estimatedHours}h</span>
                      <span style={{ color: 'var(--text-dim)' }}> / {act.actualHours}h</span>
                    </td>
                    <td>
                      <div style={{ width: '80px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.15rem' }}>
                          {act.progress || 0}%
                        </div>
                        <div className="progress-container" style={{ height: '4px' }}>
                          <div
                            className={`progress-bar-fill ${act.status === 'Completed' ? 'success' : ''}`}
                            style={{ width: `${act.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${(act.status || 'not-started').toLowerCase().replace(' ', '-')}`}>
                        {act.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          type="button"
                          className="list-item-delete-btn"
                          onClick={() => {
                            setEditingActivity(act);
                            setModalOpen(true);
                          }}
                          title="Edit Activity"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          className="list-item-delete-btn"
                          onClick={() => setActivityToDelete(act)}
                          title="Delete Activity"
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
          setEditingActivity(null);
        }}
        title={editingActivity ? `Edit Activity: ${editingActivity.activityId}` : 'Schedule New Activity'}
      >
        <ActivityForm
          activity={editingActivity}
          wbsNodes={wbsNodes}
          resources={resources}
          onSave={handleSave}
          onCancel={() => {
            setModalOpen(false);
            setEditingActivity(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!activityToDelete}
        onClose={() => setActivityToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Activity"
        message={`Are you sure you want to delete activity "${activityToDelete?.name}" (${activityToDelete?.activityId})?`}
        confirmText="Delete"
        danger={true}
      />
    </div>
  );
};

export default ActivitiesPage;
