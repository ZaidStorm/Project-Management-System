import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Edit3, Target, Calendar, DollarSign, Award, ArrowLeft } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { managementPlanService } from '../services/managementPlanService';
import ScopePlan from '../components/managementPlan/ScopePlan';
import SchedulePlan from '../components/managementPlan/SchedulePlan';
import CostPlan from '../components/managementPlan/CostPlan';
import QualityPlan from '../components/managementPlan/QualityPlan';
import ManagementPlanForm from '../components/managementPlan/ManagementPlanForm';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';

const ManagementPlanPage = () => {
  const { currentProject } = useProjects();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('scope');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlan = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      setError(null);
      const res = await managementPlanService.getByProjectId(currentProject.projectId);
      setPlan(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load management plan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
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
    return <Loading message="Loading Project Management Plan..." />;
  }

  if (error) {
    return (
      <div className="page-body">
        <ErrorMessage message={error} onRetry={fetchPlan} />
      </div>
    );
  }

  const handleSave = async (formData) => {
    const res = await managementPlanService.save(currentProject.projectId, formData);
    setPlan(res.data);
    setIsEditing(false);
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Compass color="var(--primary)" size={28} />
            Project Management Plan
          </h1>
          <p>Integration of Scope, Schedule, Cost, and Quality management baselines</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/overview')}>
            Back to Overview
          </Button>
          {!isEditing && (
            <Button variant="primary" icon={Edit3} onClick={() => setIsEditing(true)}>
              Edit Management Plan
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <ManagementPlanForm
          plan={plan}
          approvedBudget={currentProject.approvedBudget}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div>
          <div className="tabs-container">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'scope' ? 'active' : ''}`}
              onClick={() => setActiveTab('scope')}
            >
              <Target size={16} /> Scope Plan
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              <Calendar size={16} /> Schedule Plan
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'cost' ? 'active' : ''}`}
              onClick={() => setActiveTab('cost')}
            >
              <DollarSign size={16} /> Cost Plan
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'quality' ? 'active' : ''}`}
              onClick={() => setActiveTab('quality')}
            >
              <Award size={16} /> Quality Plan
            </button>
          </div>

          <div>
            {activeTab === 'scope' && <ScopePlan data={plan?.scopePlan || {}} isEditing={false} />}
            {activeTab === 'schedule' && (
              <SchedulePlan data={plan?.schedulePlan || {}} isEditing={false} />
            )}
            {activeTab === 'cost' && (
              <CostPlan
                data={plan?.costPlan || {}}
                approvedBudget={currentProject.approvedBudget}
                isEditing={false}
              />
            )}
            {activeTab === 'quality' && (
              <QualityPlan data={plan?.qualityPlan || {}} isEditing={false} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementPlanPage;
