import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div
      style={{
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(244, 63, 94, 0.1)',
        border: '1px solid rgba(244, 63, 94, 0.3)',
        color: '#fb7185',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '1rem 0',
        gap: '1rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertCircle size={20} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.875rem' }}>{message || 'An unexpected error occurred.'}</span>
      </div>
      {onRetry && (
        <Button size="sm" variant="secondary" onClick={onRetry} icon={RefreshCw}>
          Retry
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
