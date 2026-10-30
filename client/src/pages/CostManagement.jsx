import React, { useState, useEffect } from 'react';
import { useProjects } from '../hooks/useProjects';
import { costService } from '../services/costService';
import { scheduleService } from '../services/scheduleService';
import ExpenseForm from '../components/cost/ExpenseForm';
import CostEstimateForm from '../components/cost/CostEstimateForm';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { Plus, DollarSign, Receipt, AlertTriangle, Trash2, Edit3 } from 'lucide-react';

const CostManagement = () => {
  const { currentProject } = useProjects();
  const [activities, setActivities] = useState([]);
  const [estimates, setEstimates] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedEstimate, setSelectedEstimate] = useState(null);

  useEffect(() => {
    if (currentProject?._id) {
      loadData();
    }
  }, [currentProject]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [actRes, estRes, expRes] = await Promise.all([
        scheduleService.getActivities(currentProject._id),
        costService.getEstimates(currentProject._id),
        costService.getExpenses(currentProject._id)
      ]);
      setActivities(actRes.data.data || []);
      setEstimates(estRes.data.data || []);
      setExpenses(expRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cost data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExpense = async (expenseData) => {
    await costService.createExpense(currentProject._id, expenseData);
    await loadData();
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense record?')) return;
    try {
      await costService.deleteExpense(id);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete expense.');
    }
  };

  const handleOpenEstimate = (activity) => {
    setSelectedActivity(activity);
    const existing = estimates.find(e => e.activityId === activity.activityId || e.activityId === activity._id);
    setSelectedEstimate(existing || null);
    setIsEstimateModalOpen(true);
  };

  const handleSaveEstimate = async (estimateData) => {
    await costService.saveEstimate(currentProject._id, estimateData);
    await loadData();
  };

  if (!currentProject) {
    return (
      <div className="empty-state-card">
        <h3>No Project Selected</h3>
        <p>Please select an active project from the top bar to manage costs.</p>
      </div>
    );
  }

  if (loading) return <Loading text="Loading Cost & Expense Data..." />;

  // Totals Calculation
  const totalPlannedCost = estimates.reduce((sum, est) => sum + (est.totalEstimatedCost || 0), 0);
  const totalActualCost = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const approvedBudget = currentProject.approvedBudget || currentProject.budget || 0;
  const isOverBudget = approvedBudget > 0 && totalActualCost > approvedBudget;
  const isOverPlanned = totalPlannedCost > 0 && totalActualCost > totalPlannedCost;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Module 4: Cost Management</h1>
          <p className="page-subtitle">
            Plan activity costs, record actual expenditures, and manage project budget.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setIsExpenseModalOpen(true)}
        >
          <Plus size={18} />
          <span>Record Expense</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadData} />}

      {/* Warning Banners */}
      {isOverBudget && (
        <div className="alert-banner alert-danger" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertTriangle size={24} />
          <div>
            <strong>Budget Overrun Warning:</strong> Total actual expenditure (Rs. {totalActualCost.toLocaleString()}) has exceeded the approved project charter budget (Rs. {approvedBudget.toLocaleString()})!
          </div>
        </div>
      )}

      {isOverPlanned && !isOverBudget && (
        <div className="alert-banner alert-warning" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertTriangle size={24} />
          <div>
            <strong>Cost Variance Warning:</strong> Actual expenses (Rs. {totalActualCost.toLocaleString()}) have surpassed total planned activity estimates (Rs. {totalPlannedCost.toLocaleString()}).
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-label">Charter Approved Budget</div>
          <div className="stat-value" style={{ color: 'var(--primary-color)' }}>
            Rs. {approvedBudget.toLocaleString()}
          </div>
          <div className="stat-hint">Baseline financial ceiling</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Planned Estimates</div>
          <div className="stat-value" style={{ color: 'var(--info-color, #38bdf8)' }}>
            Rs. {totalPlannedCost.toLocaleString()}
          </div>
          <div className="stat-hint">Across {estimates.length} estimated activities</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Actual Expenditure (AC)</div>
          <div className="stat-value" style={{ color: isOverBudget ? 'var(--danger-color)' : 'var(--success-color)' }}>
            Rs. {totalActualCost.toLocaleString()}
          </div>
          <div className="stat-hint">{expenses.length} expense transactions recorded</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Remaining Budget</div>
          <div className="stat-value" style={{ color: (approvedBudget - totalActualCost) < 0 ? 'var(--danger-color)' : 'var(--text-color)' }}>
            Rs. {(approvedBudget - totalActualCost).toLocaleString()}
          </div>
          <div className="stat-hint">Based on Charter Budget</div>
        </div>
      </div>

      {/* Section 1: Planned Activity Cost Estimates */}
      <div className="content-card" style={{ marginBottom: '2rem' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>Activity Planned Cost Breakdown</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Set planned Labor, Material, Software, and Other costs for each scheduled activity.
            </p>
          </div>
        </div>

        {activities.length === 0 ? (
          <div className="empty-state-box" style={{ padding: '2rem', textAlign: 'center' }}>
            <p>No activities found in Module 3. Create activities first to estimate planned costs.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="standard-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Labor (Rs.)</th>
                  <th>Material (Rs.)</th>
                  <th>Software (Rs.)</th>
                  <th>Other (Rs.)</th>
                  <th>Total Planned</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activities.map(act => {
                  const est = estimates.find(e => e.activityId === act.activityId || e.activityId === act._id);
                  return (
                    <tr key={act._id}>
                      <td>
                        <strong>{act.activityId}</strong> - {act.name}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{act.status}</div>
                      </td>
                      <td>{est ? `Rs. ${Number(est.laborCost || 0).toLocaleString()}` : '-'}</td>
                      <td>{est ? `Rs. ${Number(est.materialCost || 0).toLocaleString()}` : '-'}</td>
                      <td>{est ? `Rs. ${Number(est.softwareCost || 0).toLocaleString()}` : '-'}</td>
                      <td>{est ? `Rs. ${Number(est.otherCost || 0).toLocaleString()}` : '-'}</td>
                      <td>
                        <strong>
                          {est ? `Rs. ${Number(est.totalEstimatedCost || 0).toLocaleString()}` : 'Rs. 0'}
                        </strong>
                      </td>
                      <td>
                        <button
                          className="btn-sm btn-outline"
                          onClick={() => handleOpenEstimate(act)}
                          title="Edit Cost Estimate"
                        >
                          <Edit3 size={14} />
                          <span>Estimate</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Actual Recorded Expenses */}
      <div className="content-card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>Actual Expenditure Log</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              All expenses incurred during project execution.
            </p>
          </div>
          <button
            className="btn-sm btn-primary"
            onClick={() => setIsExpenseModalOpen(true)}
          >
            <Plus size={14} />
            <span>Add Expense</span>
          </button>
        </div>

        {expenses.length === 0 ? (
          <div className="empty-state-box" style={{ padding: '2rem', textAlign: 'center' }}>
            <Receipt size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
            <p>No actual expenses recorded yet. Click "Record Expense" to log costs.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="standard-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Related Activity</th>
                  <th>Recorded By</th>
                  <th>Ref #</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp._id}>
                    <td>{new Date(exp.date).toLocaleDateString()}</td>
                    <td><strong>{exp.description}</strong></td>
                    <td>
                      <span className="badge badge-secondary">{exp.category}</span>
                    </td>
                    <td>
                      {exp.activityId ? `${exp.activityId.activityId || ''} - ${exp.activityId.name || ''}` : 'General Project'}
                    </td>
                    <td>{exp.recordedBy || 'N/A'}</td>
                    <td><code>{exp.reference || '-'}</code></td>
                    <td style={{ fontWeight: 700, color: 'var(--danger-color)' }}>
                      Rs. {Number(exp.amount || 0).toLocaleString()}
                    </td>
                    <td>
                      <button
                        className="btn-icon btn-danger-icon"
                        onClick={() => handleDeleteExpense(exp._id)}
                        title="Delete expense"
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

      {/* Modals */}
      <ExpenseForm
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleSaveExpense}
        activities={activities}
      />

      <CostEstimateForm
        isOpen={isEstimateModalOpen}
        onClose={() => setIsEstimateModalOpen(false)}
        onSave={handleSaveEstimate}
        activity={selectedActivity}
        currentEstimate={selectedEstimate}
      />
    </div>
  );
};

export default CostManagement;
