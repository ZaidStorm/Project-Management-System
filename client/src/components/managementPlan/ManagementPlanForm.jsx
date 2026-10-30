import React, { useState } from 'react';
import { Save, X, Target, Calendar, DollarSign, Award } from 'lucide-react';
import ScopePlan from './ScopePlan';
import SchedulePlan from './SchedulePlan';
import CostPlan from './CostPlan';
import QualityPlan from './QualityPlan';
import Button from '../common/Button';

const ManagementPlanForm = ({ plan, approvedBudget, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState('scope');
  const [formData, setFormData] = useState({
    scopePlan: plan?.scopePlan || {},
    schedulePlan: plan?.schedulePlan || {},
    costPlan: plan?.costPlan || {},
    qualityPlan: plan?.qualityPlan || {}
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSave(formData);
    } catch (err) {
      alert(err.message || 'Failed to save management plan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>Edit Project Management Plan</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Configure and synchronize Scope, Schedule, Cost, and Quality plans.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" icon={X} onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={Save} loading={saving}>
            Save All Plans
          </Button>
        </div>
      </div>

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
        {activeTab === 'scope' && (
          <ScopePlan
            data={formData.scopePlan}
            onChange={(val) => setFormData({ ...formData, scopePlan: val })}
            isEditing={true}
          />
        )}
        {activeTab === 'schedule' && (
          <SchedulePlan
            data={formData.schedulePlan}
            onChange={(val) => setFormData({ ...formData, schedulePlan: val })}
            isEditing={true}
          />
        )}
        {activeTab === 'cost' && (
          <CostPlan
            data={formData.costPlan}
            onChange={(val) => setFormData({ ...formData, costPlan: val })}
            isEditing={true}
            approvedBudget={approvedBudget}
          />
        )}
        {activeTab === 'quality' && (
          <QualityPlan
            data={formData.qualityPlan}
            onChange={(val) => setFormData({ ...formData, qualityPlan: val })}
            isEditing={true}
          />
        )}
      </div>
    </form>
  );
};

export default ManagementPlanForm;
