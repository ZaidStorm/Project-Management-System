import React, { useState, useEffect } from 'react';
import { useProjects } from '../hooks/useProjects';
import { costService } from '../services/costService';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { TrendingUp, AlertTriangle, CheckCircle, RefreshCw, BarChart2, DollarSign } from 'lucide-react';

const EarnedValue = () => {
  const { currentProject } = useProjects();
  const [evmData, setEvmData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentProject?._id) {
      loadEVM();
    }
  }, [currentProject]);

  const loadEVM = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await costService.getEVM(currentProject._id);
      setEvmData(res.data.data || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate Earned Value metrics.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentProject) {
    return (
      <div className="empty-state-card">
        <h3>No Project Selected</h3>
        <p>Please select an active project to view Earned Value Analysis.</p>
      </div>
    );
  }

  if (loading) return <Loading text="Computing Earned Value Management (EVM) Indices..." />;

  const pv = evmData?.pv || 0;
  const ev = evmData?.ev || 0;
  const ac = evmData?.ac || 0;
  const cpi = evmData?.cpi !== undefined ? evmData.cpi : 1.0;
  const spi = evmData?.spi !== undefined ? evmData.spi : 1.0;
  const costStatus = evmData?.costStatus || 'On Budget';
  const scheduleStatus = evmData?.scheduleStatus || 'On Schedule';
  const warnings = evmData?.warnings || [];

  const getCpiBadgeClass = (val) => {
    if (val < 0.9) return 'badge-danger';
    if (val < 1.0) return 'badge-warning';
    return 'badge-success';
  };

  const getSpiBadgeClass = (val) => {
    if (val < 0.9) return 'badge-danger';
    if (val < 1.0) return 'badge-warning';
    return 'badge-success';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Earned Value Analysis (EVM)</h1>
          <p className="page-subtitle">
            Quantitative assessment of project scope, schedule, and cost performance using ANSI/PMI EVM indicators.
          </p>
        </div>
        <button className="btn-secondary" onClick={loadEVM} title="Recalculate EVM">
          <RefreshCw size={16} />
          <span>Recalculate EVM</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadEVM} />}

      {/* Warnings List */}
      {warnings.length > 0 && (
        <div className="alert-banner alert-warning" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>
            <AlertTriangle size={20} />
            <span>Automatic Performance Warnings Detected</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.6' }}>
            {warnings.map((w, idx) => (
              <li key={idx}><strong>{w}</strong></li>
            ))}
          </ul>
        </div>
      )}

      {/* Wireframe 4.5 EVM Dashboard Box */}
      <div className="content-card" style={{ marginBottom: '2rem', border: '2px solid var(--border-color)' }}>
        <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>EARNED VALUE ANALYSIS (EVM)</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Last Calculated: {evmData?.calculatedAt ? new Date(evmData.calculatedAt).toLocaleString() : 'Just now'}
            </span>
          </div>
        </div>

        <div style={{ padding: '1.5rem 0' }}>
          {/* Key Metrics Row */}
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card">
              <div className="stat-label">Planned Value (PV)</div>
              <div className="stat-value" style={{ color: 'var(--primary-color)' }}>
                Rs. {pv.toLocaleString()}
              </div>
              <div className="stat-hint">PV = Planned Budget × Planned Completion %</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Earned Value (EV)</div>
              <div className="stat-value" style={{ color: 'var(--info-color, #38bdf8)' }}>
                Rs. {ev.toLocaleString()}
              </div>
              <div className="stat-hint">EV = Planned Budget × Actual Completion %</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Actual Cost (AC)</div>
              <div className="stat-value" style={{ color: ac > ev ? 'var(--danger-color)' : 'var(--text-color)' }}>
                Rs. {ac.toLocaleString()}
              </div>
              <div className="stat-hint">AC = Total Actual Expenditure Recorded</div>
            </div>
          </div>

          {/* Indices Row */}
          <div className="stats-grid">
            <div className="stat-card" style={{ background: cpi < 0.9 ? 'rgba(239, 68, 68, 0.08)' : 'transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="stat-label">Cost Performance Index (CPI)</span>
                <span className={`badge ${getCpiBadgeClass(cpi)}`}>
                  {cpi < 1 ? '⚠ Over Budget' : cpi === 1 ? 'On Budget' : '✓ Under Budget'}
                </span>
              </div>
              <div className="stat-value" style={{ fontSize: '2.2rem', margin: '0.5rem 0' }}>
                {cpi.toFixed(2)}
              </div>
              <div className="stat-hint">
                CPI = EV / AC ({cpi < 1 ? 'Spending more than planned' : 'Under or on budget'})
              </div>
            </div>

            <div className="stat-card" style={{ background: spi < 0.9 ? 'rgba(239, 68, 68, 0.08)' : 'transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="stat-label">Schedule Performance Index (SPI)</span>
                <span className={`badge ${getSpiBadgeClass(spi)}`}>
                  {spi < 1 ? '⚠ Behind Schedule' : spi === 1 ? 'On Schedule' : '✓ Ahead'}
                </span>
              </div>
              <div className="stat-value" style={{ fontSize: '2.2rem', margin: '0.5rem 0' }}>
                {spi.toFixed(2)}
              </div>
              <div className="stat-hint">
                SPI = EV / PV ({spi < 1 ? 'Progressing slower than scheduled' : 'On or ahead of schedule'})
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Overall Project Status</div>
              <div style={{ margin: '0.5rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span>Cost Status:</span>
                  <strong style={{ color: cpi < 1 ? 'var(--danger-color)' : 'var(--success-color)' }}>
                    {costStatus.toUpperCase()}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Schedule Status:</span>
                  <strong style={{ color: spi < 1 ? 'var(--warning-color)' : 'var(--success-color)' }}>
                    {scheduleStatus.toUpperCase()}
                  </strong>
                </div>
              </div>
              <div className="stat-hint">
                Cost Variance: Rs. {(ev - ac).toLocaleString()} | Sched Variance: Rs. {(ev - pv).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EVM Interpretation Reference Table */}
      <div className="content-card">
        <h3>EVM Interpretation Reference Guide</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Standard interpretation matrix prescribed by Project Management Information Systems:
        </p>
        <div className="table-responsive">
          <table className="standard-table">
            <thead>
              <tr>
                <th>Indicator</th>
                <th>Formula</th>
                <th>Result &gt; 1.0</th>
                <th>Result = 1.0</th>
                <th>Result &lt; 1.0</th>
                <th>Current Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>CPI</strong> (Cost Performance Index)</td>
                <td><code>EV / AC</code></td>
                <td><span className="badge badge-success">Under Budget</span></td>
                <td><span className="badge badge-secondary">On Budget</span></td>
                <td><span className="badge badge-danger">Over Budget</span></td>
                <td>
                  <strong style={{ color: cpi < 1 ? 'var(--danger-color)' : 'var(--success-color)' }}>
                    {cpi.toFixed(2)} ({costStatus})
                  </strong>
                </td>
              </tr>
              <tr>
                <td><strong>SPI</strong> (Schedule Performance Index)</td>
                <td><code>EV / PV</code></td>
                <td><span className="badge badge-success">Ahead of Schedule</span></td>
                <td><span className="badge badge-secondary">On Schedule</span></td>
                <td><span className="badge badge-danger">Behind Schedule</span></td>
                <td>
                  <strong style={{ color: spi < 1 ? 'var(--warning-color)' : 'var(--success-color)' }}>
                    {spi.toFixed(2)} ({scheduleStatus})
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EarnedValue;
