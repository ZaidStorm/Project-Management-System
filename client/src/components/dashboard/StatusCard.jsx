import React from 'react';

const StatusCard = ({ title, value, subtext, icon: Icon, color = 'var(--primary)', onClick }) => {
  return (
    <div
      className="metric-card glass-panel"
      style={{ '--card-accent': color, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        {Icon && (
          <div className="metric-icon-wrap" style={{ color }}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div>
        <div className="metric-value">{value}</div>
        {subtext && <div className="metric-subtext">{subtext}</div>}
      </div>
    </div>
  );
};

export default StatusCard;
