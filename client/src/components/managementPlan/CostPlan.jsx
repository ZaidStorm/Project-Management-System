import React from 'react';
import { DollarSign, AlertCircle, PieChart } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const CostPlan = ({ data = {}, onChange, isEditing = false, approvedBudget = 0 }) => {
  const devCost = Number(data.developmentCost) || 0;
  const hwCost = Number(data.hardwareCost) || 0;
  const swCost = Number(data.softwareCost) || 0;
  const otherCost = Number(data.otherCost) || 0;
  const contingency = Number(data.contingency) || 0;
  const totalCost = devCost + hwCost + swCost + otherCost + contingency;
  const variance = approvedBudget - totalCost;

  const costBreakdown = [
    { label: 'Development Cost', value: devCost, color: '#6366f1' },
    { label: 'Hardware Cost', value: hwCost, color: '#06b6d4' },
    { label: 'Software Licenses & Subscriptions', value: swCost, color: '#10b981' },
    { label: 'Contingency Reserve', value: contingency, color: '#f59e0b' },
    { label: 'Other Operational Expenses', value: otherCost, color: '#a855f7' }
  ];

  if (!isEditing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* KPI Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem'
          }}
        >
          <div className="section-card glass-panel" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Approved Project Budget
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-emerald)', marginTop: '0.35rem' }}>
              {formatCurrency(approvedBudget)}
            </div>
          </div>

          <div className="section-card glass-panel" style={{ borderLeft: '4px solid var(--primary)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Total Planned Expenditure
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.35rem' }}>
              {formatCurrency(totalCost)}
            </div>
          </div>

          <div
            className="section-card glass-panel"
            style={{ borderLeft: `4px solid ${variance < 0 ? 'var(--accent-rose)' : 'var(--accent-cyan)'}` }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Budget Variance
            </div>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: variance < 0 ? 'var(--accent-rose)' : 'var(--accent-cyan)',
                marginTop: '0.35rem'
              }}
            >
              {variance < 0 ? `-${formatCurrency(Math.abs(variance))}` : `+${formatCurrency(variance)}`}
            </div>
          </div>
        </div>

        {/* Cost Table Breakdown */}
        <div className="section-card glass-panel">
          <h4 className="section-card-title">Cost Category Breakdown</h4>
          <table className="data-table" style={{ marginTop: '0.75rem' }}>
            <thead>
              <tr>
                <th>Expense Category</th>
                <th>Planned Amount</th>
                <th>Share of Budget</th>
              </tr>
            </thead>
            <tbody>
              {costBreakdown.map((item) => {
                const pct = totalCost > 0 ? ((item.value / totalCost) * 100).toFixed(1) : 0;
                return (
                  <tr key={item.label}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: item.color
                          }}
                        />
                        <span style={{ fontWeight: 500 }}>{item.label}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatCurrency(item.value)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="progress-container" style={{ width: '100px', height: '6px' }}>
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${pct}%`, background: item.color }}
                          />
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {data.costNotes && (
          <div className="section-card glass-panel">
            <h4 className="section-card-title">Cost Estimating Assumptions & Notes</h4>
            <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {data.costNotes}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="section-card glass-panel">
      <h4 className="section-card-title">Edit Cost & Budget Plan</h4>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Development Cost ($)</label>
          <input
            type="number"
            className="form-input"
            min="0"
            value={data.developmentCost || 0}
            onChange={(e) => onChange({ ...data, developmentCost: Number(e.target.value) || 0 })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Hardware Cost ($)</label>
          <input
            type="number"
            className="form-input"
            min="0"
            value={data.hardwareCost || 0}
            onChange={(e) => onChange({ ...data, hardwareCost: Number(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Software & Licensing Cost ($)</label>
          <input
            type="number"
            className="form-input"
            min="0"
            value={data.softwareCost || 0}
            onChange={(e) => onChange({ ...data, softwareCost: Number(e.target.value) || 0 })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Contingency Reserve ($)</label>
          <input
            type="number"
            className="form-input"
            min="0"
            value={data.contingency || 0}
            onChange={(e) => onChange({ ...data, contingency: Number(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Other Miscellaneous Expenses ($)</label>
          <input
            type="number"
            className="form-input"
            min="0"
            value={data.otherCost || 0}
            onChange={(e) => onChange({ ...data, otherCost: Number(e.target.value) || 0 })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Computed Total Cost (Auto)</label>
          <input
            type="text"
            className="form-input"
            value={formatCurrency(totalCost)}
            disabled
            style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Cost Estimating Assumptions & Reserve Justification</label>
        <textarea
          className="form-textarea"
          rows="3"
          placeholder="Details on vendor quotes, licensing duration, contingency calculation logic..."
          value={data.costNotes || ''}
          onChange={(e) => onChange({ ...data, costNotes: e.target.value })}
        />
      </div>
    </div>
  );
};

export default CostPlan;
