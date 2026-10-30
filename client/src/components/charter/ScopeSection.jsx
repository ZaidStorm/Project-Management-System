import React from 'react';
import { CheckCircle, XCircle, HelpCircle, ShieldAlert } from 'lucide-react';

const ScopeSection = ({ inScope = [], outOfScope = [], assumptions = [], constraints = [] }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {/* In Scope */}
      <div
        style={{
          background: 'rgba(16, 185, 129, 0.03)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#34d399', fontWeight: 700 }}>
          <CheckCircle size={18} />
          <span>In Scope (Approved Boundaries)</span>
        </div>
        {inScope.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No in-scope items defined yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {inScope.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ color: '#34d399', marginTop: '2px' }}>✓</span>
                <span style={{ color: 'var(--text-main)' }}>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Out of Scope */}
      <div
        style={{
          background: 'rgba(244, 63, 94, 0.03)',
          border: '1px solid rgba(244, 63, 94, 0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#fb7185', fontWeight: 700 }}>
          <XCircle size={18} />
          <span>Out of Scope (Exclusions)</span>
        </div>
        {outOfScope.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No out-of-scope boundaries defined yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {outOfScope.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ color: '#fb7185', marginTop: '2px' }}>✕</span>
                <span style={{ color: 'var(--text-muted)' }}>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Assumptions */}
      <div
        style={{
          background: 'rgba(6, 182, 212, 0.03)',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#38bdf8', fontWeight: 700 }}>
          <HelpCircle size={18} />
          <span>Project Assumptions</span>
        </div>
        {assumptions.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No assumptions documented.</p>
        ) : (
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {assumptions.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ color: '#38bdf8', marginTop: '2px' }}>•</span>
                <span style={{ color: 'var(--text-main)' }}>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Constraints */}
      <div
        style={{
          background: 'rgba(245, 158, 11, 0.03)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#fbbf24', fontWeight: 700 }}>
          <ShieldAlert size={18} />
          <span>Project Constraints</span>
        </div>
        {constraints.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No constraints documented.</p>
        ) : (
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {constraints.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ color: '#fbbf24', marginTop: '2px' }}>!</span>
                <span style={{ color: 'var(--text-main)' }}>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ScopeSection;
