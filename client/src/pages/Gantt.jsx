import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, PlusCircle, ArrowLeft, Calendar } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { scheduleService } from '../services/scheduleService';
import GanttChart from '../components/schedule/GanttChart';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';

const GanttPage = () => {
  const { currentProject } = useProjects();
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      setError(null);
      const res = await scheduleService.getActivities(currentProject.projectId);
      setActivities(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load Gantt schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
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
    return <Loading message="Rendering interactive Gantt chart timeline..." />;
  }

  if (error) {
    return (
      <div className="page-body">
        <ErrorMessage message={error} onRetry={fetchActivities} />
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <BarChart2 color="var(--primary)" size={28} />
            Gantt Schedule Chart
          </h1>
          <p>Module 3: Visual timeline representation of activity durations, progress, and critical milestones</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" icon={Calendar} onClick={() => navigate('/activities')}>
            Activities List
          </Button>
          <Button variant="primary" icon={PlusCircle} onClick={() => navigate('/activities')}>
            Add Activity
          </Button>
        </div>
      </div>

      <GanttChart activities={activities} />
    </div>
  );
};

export default GanttPage;
