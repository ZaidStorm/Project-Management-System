import React from 'react';
import { DollarSign, PieChart, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const BudgetSummary = ({ approvedBudget = 0, costPlan = {} }) => {
  const totalCost = costPlan.totalCost || 0;
  const variance = approvedBudget - totalCost;
  const isOverBudget = variance < 0;

  const costItems = [
    { label: 'Development Cost', value: costPlan.developmentCost || 0, color: '#6366f1' },
    { label: 'Hardware Cost', value: costPlan.hardwareCost || 0, color: '#06b6d4' },
    { label: 'Software Licenses', value: costPlan.softwareCost || 0, color: '#10b981' },
    { label: 'Contingency Reserve', value: costPlan.contingency || 0, color: '#f59e0b' },
    { label: 'Other Expenses', value: costPlan.otherCost || 0, color: '#a855f7' }
  ];

  return (
    <div className="section-card glass-panel">
      <div className="section-card-header">
        <h3 className="section-card-title">Cost Plan & Budget Allocation</h3>
        <span
          style={{
            fontSize: '0.8rem',
            color: isOverBudget ? 'var(--accent-rose)' : 'var(--accent-emerald)',
            fontWeight: 600
          }}
        >
          {isOverBudget
            ? `Over Budget by ${formatCurrency(Math.abs(variance))}`
            : `Under Budget (${formatCurrency(variance)} remaining)`}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {costItems.map((item) => {
          const pct = totalCost > 0 ? Math.round((item.value / totalCost) * 100) : 0;
          return (
            <div key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  {formatCurrency(item.value)} <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>({pct}%)</span>
                </span>
              </div>
              <div className="progress-container" style={{ height: '6px' }}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${pct}%`, background: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>TOTAL PLANNED COST</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {formatCurrency(totalCost)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>APPROVED BUDGET</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
            {formatCurrency(approvedBudget)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;
