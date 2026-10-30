import React from 'react';
import { ShieldCheck, AlertCircle, ArrowRight, UserCheck, Wrench } from 'lucide-react';

const PDPC = ({ risks = [] }) => {
  return (
    <div className="pdpc-container" style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h4>Process Decision Program Chart (PDPC)</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Systematic decision mapping: Identifies potential process failures, proactive preventive measures, contingency actions, and assigned personnel.
        </p>
      </div>

      {risks.length === 0 ? (
        <div className="empty-state-box" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No risks identified yet. Add project risks with preventive and corrective actions to view the PDPC diagram.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {risks.map(r => (
            <div
              key={r._id}
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                background: 'var(--card-bg, rgba(255,255,255,0.03))'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-secondary">{r.riskId}</span>
                  <strong style={{ fontSize: '1rem' }}>{r.title}</strong>
                </div>
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
                  {r.riskLevel} Risk (Score: {r.riskScore})
                </span>
              </div>

              {/* PDPC Chain */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  alignItems: 'stretch'
                }}
              >
                {/* 1. Potential Problem */}
                <div
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(239, 68, 68, 0.08)',
                    borderRadius: '6px',
                    borderLeft: '3px solid var(--danger-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--danger-color)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <AlertCircle size={14} /> Potential Problem
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>{r.description || r.title}</div>
                </div>

                {/* 2. Preventive Action */}
                <div
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(34, 197, 94, 0.08)',
                    borderRadius: '6px',
                    borderLeft: '3px solid var(--success-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success-color)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <ShieldCheck size={14} /> Preventive Action
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>
                    {r.preventiveAction || <em style={{ color: 'var(--text-muted)' }}>None specified</em>}
                  </div>
                </div>

                {/* 3. Corrective Action */}
                <div
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(56, 189, 248, 0.08)',
                    borderRadius: '6px',
                    borderLeft: '3px solid var(--info-color, #38bdf8)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--info-color, #38bdf8)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <Wrench size={14} /> Corrective Action
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>
                    {r.correctiveAction || <em style={{ color: 'var(--text-muted)' }}>None specified</em>}
                  </div>
                </div>

                {/* 4. Responsible Person */}
                <div
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(168, 85, 247, 0.08)',
                    borderRadius: '6px',
                    borderLeft: '3px solid #a855f7'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a855f7', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <UserCheck size={14} /> Responsible Person
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{r.owner || 'Project Manager'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Strategy: {r.responseStrategy}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PDPC;
