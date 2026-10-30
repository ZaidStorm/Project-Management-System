import React, { useState, useEffect } from 'react';
import { useProjects } from '../hooks/useProjects';
import { qualityRiskService } from '../services/qualityRiskService';
import RiskForm from '../components/risk/RiskForm';
import RiskMatrix from '../components/risk/RiskMatrix';
import PDPC from '../components/risk/PDPC';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { Plus, ShieldAlert, Grid, GitBranch, Trash2, Edit3 } from 'lucide-react';

const RiskManagement = () => {
  const { currentProject } = useProjects();
  const [activeTab, setActiveTab] = useState('register'); // 'register', 'matrix', 'pdpc'

  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState(null);

  useEffect(() => {
    if (currentProject?._id) {
      loadRisks();
    }
  }, [currentProject]);

  const loadRisks = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await qualityRiskService.getRisks(currentProject._id);
      setRisks(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project risks.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRisk = async (formData) => {
    if (selectedRisk) {
      await qualityRiskService.updateRisk(selectedRisk._id, formData);
    } else {
      await qualityRiskService.createRisk(currentProject._id, formData);
    }
    await loadRisks();
  };

  const handleDeleteRisk = async (id) => {
    if (!window.confirm('Are you sure you want to delete this risk from the register?')) return;
    try {
      await qualityRiskService.deleteRisk(id);
      await loadRisks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete risk.');
    }
  };

  if (!currentProject) {
    return (
      <div className="empty-state-card">
        <h3>No Project Selected</h3>
        <p>Please select an active project to manage Risks.</p>
      </div>
    );
  }

  if (loading) return <Loading text="Loading Risk Management & Mitigation Register..." />;

  // Metrics
  const criticalRisks = risks.filter(r => r.riskLevel === 'Critical' && r.status !== 'Closed').length;
  const highRisks = risks.filter(r => r.riskLevel === 'High' && r.status !== 'Closed').length;
  const mitigatedRisks = risks.filter(r => r.status === 'Mitigated' || r.status === 'Closed').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Module 5: Risk Control & Mitigation</h1>
          <p className="page-subtitle">
            Systematic risk identification, 5×5 Likelihood vs Impact Matrix, and Process Decision Program Chart (PDPC).
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => { setSelectedRisk(null); setIsRiskModalOpen(true); }}
        >
          <Plus size={18} />
          <span>Identify Risk</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadRisks} />}

      {/* Critical Risk Banner */}
      {criticalRisks > 0 && (
        <div className="alert-banner alert-danger" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldAlert size={22} />
          <div>
            <strong>Critical Risk Alert:</strong> {criticalRisks} critical risk(s) identified with score ≥ 17. Immediate mitigation and contingency plans are mandatory.
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-label">Critical Risks</div>
          <div className="stat-value" style={{ color: 'var(--danger-color)' }}>{criticalRisks}</div>
          <div className="stat-hint">Score ≥ 17 (Severe project threat)</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">High Risks</div>
          <div className="stat-value" style={{ color: '#f97316' }}>{highRisks}</div>
          <div className="stat-hint">Score 10–16 (Active tracking)</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Identified</div>
          <div className="stat-value">{risks.length}</div>
          <div className="stat-hint">Across all severity levels</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Mitigated / Closed</div>
          <div className="stat-value" style={{ color: 'var(--success-color)' }}>{mitigatedRisks}</div>
          <div className="stat-hint">Successfully contained</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-nav" style={{ marginBottom: '1.5rem' }}>
        <button
          className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          <ShieldAlert size={16} />
          <span>Risk Register ({risks.length})</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'matrix' ? 'active' : ''}`}
          onClick={() => setActiveTab('matrix')}
        >
          <Grid size={16} />
          <span>5×5 Prioritization Matrix</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'pdpc' ? 'active' : ''}`}
          onClick={() => setActiveTab('pdpc')}
        >
          <GitBranch size={16} />
          <span>Process Decision Program Chart (PDPC)</span>
        </button>
      </div>

      {/* TAB 1: RISK REGISTER */}
      {activeTab === 'register' && (
        <div className="content-card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Project Risk Register</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Documented threats, likelihood, impact ratings, and assigned countermeasures.
              </p>
            </div>
            <button
              className="btn-sm btn-primary"
              onClick={() => { setSelectedRisk(null); setIsRiskModalOpen(true); }}
            >
              <Plus size={14} /> Add Risk
            </button>
          </div>

          {risks.length === 0 ? (
            <div className="empty-state-box" style={{ padding: '2rem', textAlign: 'center' }}>
              <p>No risks identified yet. Click "Identify Risk" to add entries.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="standard-table">
                <thead>
                  <tr>
                    <th>Risk ID</th>
                    <th>Title & Description</th>
                    <th>Likelihood</th>
                    <th>Impact</th>
                    <th>Score</th>
                    <th>Level</th>
                    <th>Strategy</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {risks.map(r => (
                    <tr key={r._id}>
                      <td><strong>{r.riskId}</strong></td>
                      <td>
                        <strong>{r.title}</strong>
                        {r.description && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {r.description}
                          </div>
                        )}
                      </td>
                      <td>{r.likelihood}</td>
                      <td>{r.impact}</td>
                      <td><strong>{r.riskScore}</strong></td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            color: '#fff',
                            background:
                              r.riskLevel === 'Critical'
                                ? 'var(--danger-color)'
                                : r.riskLevel === 'High'
                                ? '#f97316'
                                : r.riskLevel === 'Medium'
                                ? '#eab308'
                                : 'var(--success-color)'
                          }}
                        >
                          {r.riskLevel}
                        </span>
                      </td>
                      <td>{r.responseStrategy}</td>
                      <td>{r.owner}</td>
                      <td>
                        <span className="badge badge-secondary">{r.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn-icon"
                            onClick={() => { setSelectedRisk(r); setIsRiskModalOpen(true); }}
                            title="Edit risk"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            className="btn-icon btn-danger-icon"
                            onClick={() => handleDeleteRisk(r._id)}
                            title="Delete risk"
                          >
                            <Trash2 size={15} />
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
      )}

      {/* TAB 2: 5x5 MATRIX */}
      {activeTab === 'matrix' && (
        <div className="content-card">
          <RiskMatrix
            risks={risks}
            onSelectRisk={(risk) => {
              setSelectedRisk(risk);
              setIsRiskModalOpen(true);
            }}
          />
        </div>
      )}

      {/* TAB 3: PDPC */}
      {activeTab === 'pdpc' && (
        <div className="content-card">
          <PDPC risks={risks} />
        </div>
      )}

      {/* Modal */}
      <RiskForm
        isOpen={isRiskModalOpen}
        onClose={() => setIsRiskModalOpen(false)}
        onSave={handleSaveRisk}
        risk={selectedRisk}
      />
    </div>
  );
};

export default RiskManagement;
