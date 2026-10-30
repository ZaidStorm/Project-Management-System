import React from 'react';

const RiskMatrix = ({ risks = [], onSelectRisk }) => {
  // Classification helper
  const getCellMeta = (likelihood, impact) => {
    const score = likelihood * impact;
    if (score >= 17) return { level: 'Critical', bg: '#ef4444', text: '#fff' };
    if (score >= 10) return { level: 'High', bg: '#f97316', text: '#fff' };
    if (score >= 5) return { level: 'Medium', bg: '#eab308', text: '#000' };
    return { level: 'Low', bg: '#22c55e', text: '#fff' };
  };

  // Group risks by [likelihood][impact]
  const matrixData = {};
  for (let l = 1; l <= 5; l++) {
    matrixData[l] = {};
    for (let i = 1; i <= 5; i++) {
      matrixData[l][i] = [];
    }
  }

  risks.forEach(r => {
    const l = Math.min(5, Math.max(1, r.likelihood || 1));
    const i = Math.min(5, Math.max(1, r.impact || 1));
    matrixData[l][i].push(r);
  });

  const likelihoodLabels = {
    5: '5 - Almost Certain',
    4: '4 - Likely',
    3: '3 - Possible',
    2: '2 - Unlikely',
    1: '1 - Rare'
  };

  const impactLabels = {
    1: '1 (Insignificant)',
    2: '2 (Minor)',
    3: '3 (Moderate)',
    4: '4 (Major)',
    5: '5 (Catastrophic)'
  };

  return (
    <div className="risk-matrix-container" style={{ padding: '1rem', overflowX: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h4>5 × 5 Risk Prioritization Heatmap</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Risk Score = Likelihood × Impact (Low: 1–4, Medium: 5–9, High: 10–16, Critical: 17–25)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 12, height: 12, background: '#22c55e', borderRadius: 3 }} /> Low (1–4)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 12, height: 12, background: '#eab308', borderRadius: 3 }} /> Medium (5–9)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 12, height: 12, background: '#f97316', borderRadius: 3 }} /> High (10–16)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 12, height: 12, background: '#ef4444', borderRadius: 3 }} /> Critical (17–25)
          </span>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '6px' }}>
        <thead>
          <tr>
            <th style={{ width: '150px', padding: '8px', textAlign: 'left', fontSize: '0.85rem' }}>
              Likelihood ↓ / Impact →
            </th>
            {[1, 2, 3, 4, 5].map(i => (
              <th key={i} style={{ padding: '8px', textAlign: 'center', fontSize: '0.85rem' }}>
                {impactLabels[i]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[5, 4, 3, 2, 1].map(l => (
            <tr key={l}>
              <td style={{ fontWeight: 600, fontSize: '0.85rem', padding: '6px' }}>
                {likelihoodLabels[l]}
              </td>
              {[1, 2, 3, 4, 5].map(i => {
                const cellRisks = matrixData[l][i] || [];
                const cellMeta = getCellMeta(l, i);
                const score = l * i;

                return (
                  <td
                    key={i}
                    style={{
                      background: cellMeta.bg,
                      color: cellMeta.text,
                      borderRadius: '8px',
                      padding: '8px',
                      height: '75px',
                      minWidth: '100px',
                      verticalAlign: 'top',
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.85 }}>
                      <span>Score: {score}</span>
                      <span>{cellRisks.length > 0 ? `(${cellRisks.length})` : ''}</span>
                    </div>

                    <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {cellRisks.map(r => (
                        <div
                          key={r._id}
                          onClick={() => onSelectRisk && onSelectRisk(r)}
                          style={{
                            background: 'rgba(0, 0, 0, 0.45)',
                            color: '#fff',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          title={`${r.riskId}: ${r.title}`}
                        >
                          <strong>{r.riskId}</strong>: {r.title}
                        </div>
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RiskMatrix;
