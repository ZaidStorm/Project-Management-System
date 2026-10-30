import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Edit3 } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { closureService } from '../services/closureService';
import ClosureDetails from '../components/closure/ClosureDetails';
import ClosureForm from '../components/closure/ClosureForm';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';

const ProjectClosurePage = () => {
  const { currentProject, fetchProjects } = useProjects();
  const navigate = useNavigate();

  const [closure, setClosure] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClosure = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      setError(null);
      const res = await closureService.getByProjectId(currentProject.projectId);
      setClosure(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load project closure records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClosure();
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
    return <Loading message="Loading project closure and sign-off records..." />;
  }

  if (error) {
    return (
      <div className="page-body">
        <ErrorMessage message={error} onRetry={fetchClosure} />
      </div>
    );
  }

  const handleSave = async (formData) => {
    const res = await closureService.save(currentProject.projectId, formData);
    setClosure(res.data);
    setIsEditing(false);
    await fetchProjects(currentProject.projectId);
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <CheckCircle2 color="var(--primary)" size={28} />
            Project Closure
          </h1>
          <p>Phase completion, deliverables acceptance, lessons learned, and formal executive sign-off</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/overview')}>
            Back to Overview
          </Button>
          {!isEditing && (
            <Button variant="primary" icon={Edit3} onClick={() => setIsEditing(true)}>
              Edit Closure
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <ClosureForm
          closure={closure}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <ClosureDetails
          closure={closure}
          onEdit={() => setIsEditing(true)}
        />
      )}
    </div>
  );
};

export default ProjectClosurePage;
