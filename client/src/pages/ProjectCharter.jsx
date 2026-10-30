import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCheck2, ArrowLeft, Edit3 } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useCharter } from '../hooks/useCharter';
import CharterDetails from '../components/charter/CharterDetails';
import CharterForm from '../components/charter/CharterForm';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';

const ProjectCharterPage = () => {
  const { currentProject } = useProjects();
  const navigate = useNavigate();

  const { charter, loading, error, refresh, saveCharter } = useCharter(
    currentProject?.projectId
  );
  const [isEditing, setIsEditing] = useState(false);

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
    return <Loading message="Loading Project Charter authorization records..." />;
  }

  if (error) {
    return (
      <div className="page-body">
        <ErrorMessage message={error} onRetry={refresh} />
      </div>
    );
  }

  const handleSave = async (formData) => {
    await saveCharter(formData);
    setIsEditing(false);
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <FileCheck2 color="var(--primary)" size={28} />
            Project Charter
          </h1>
          <p>
            Official project authorization, objectives, stakeholder registry, scope boundaries, budget and formal sign-off
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/overview')}>
            Back to Overview
          </Button>
          {!isEditing && (
            <Button variant="primary" icon={Edit3} onClick={() => setIsEditing(true)}>
              Edit Charter
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <CharterForm
          charter={charter}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <CharterDetails
          charter={charter}
          onEdit={() => setIsEditing(true)}
        />
      )}
    </div>
  );
};

export default ProjectCharterPage;
