import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Edit2, Trash2, Layers, CheckCircle2, Link2, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const WBSNodeItem = ({ node, childrenNodes, allNodes, onAddChild, onEdit, onDelete, level = 0 }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = childrenNodes && childrenNodes.length > 0;

  const getNodeTypeBadge = (type) => {
    switch (type) {
      case 'Project':
        return <span className="badge badge-planning">Project</span>;
      case 'Deliverable':
        return <span className="badge badge-in-progress">Deliverable</span>;
      case 'Work Package':
        return <span className="badge badge-completed">Work Package</span>;
      default:
        return <span className="badge badge-draft">Task</span>;
    }
  };

  return (
    <div style={{ marginLeft: level > 0 ? `${Math.min(level * 24, 72)}px` : 0, marginTop: '0.65rem' }}>
      <div
        className="glass-panel"
        style={{
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          borderLeft: `4px solid ${
            node.nodeType === 'Project'
              ? 'var(--primary)'
              : node.nodeType === 'Deliverable'
              ? 'var(--accent-cyan)'
              : node.nodeType === 'Work Package'
              ? 'var(--accent-emerald)'
              : 'var(--accent-amber)'
          }`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: '260px' }}>
          {hasChildren ? (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
          ) : (
            <div style={{ width: 18 }} />
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--text-main)'
                }}
              >
                {node.code}
              </span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                {node.name}
              </span>
              {getNodeTypeBadge(node.nodeType)}
              {node.requirementId && (
                <span
                  className="badge badge-approved"
                  style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', gap: '0.25rem' }}
                  title="Linked to Approved Scope Requirement"
                >
                  <Link2 size={10} /> {node.requirementId}
                </span>
              )}
            </div>
            {node.description && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {node.description}
              </div>
            )}
          </div>
        </div>

        {/* Metadata & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {node.estimatedCost > 0 && (
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
              {formatCurrency(node.estimatedCost)}
            </div>
          )}

          <div style={{ width: '90px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.15rem' }}>
              <span>{node.status}</span>
              <span>{node.progress || 0}%</span>
            </div>
            <div className="progress-container" style={{ height: '4px' }}>
              <div
                className={`progress-bar-fill ${node.progress === 100 ? 'success' : ''}`}
                style={{ width: `${node.progress || 0}%` }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <button
              type="button"
              className="list-item-delete-btn"
              title="Add Child Sub-node"
              onClick={() => onAddChild(node.wbsId)}
              style={{ color: 'var(--accent-cyan)' }}
            >
              <Plus size={16} />
            </button>
            <button
              type="button"
              className="list-item-delete-btn"
              title="Edit Node"
              onClick={() => onEdit(node)}
              style={{ color: 'var(--text-muted)' }}
            >
              <Edit2 size={16} />
            </button>
            <button
              type="button"
              className="list-item-delete-btn"
              title="Delete Node & Subtree"
              onClick={() => onDelete(node)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Render Children Recursively */}
      {hasChildren && expanded && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {childrenNodes.map((child) => {
            const grandChildren = allNodes.filter((n) => n.parentId === child.wbsId);
            return (
              <WBSNodeItem
                key={child.wbsId}
                node={child}
                childrenNodes={grandChildren}
                allNodes={allNodes}
                onAddChild={onAddChild}
                onEdit={onEdit}
                onDelete={onDelete}
                level={level + 1}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const WBSBuilder = ({ nodes = [], onAddChild, onEdit, onDelete }) => {
  if (nodes.length === 0) {
    return (
      <div className="section-card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>No Work Breakdown Structure defined yet.</p>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
          Click "+ Add WBS Node" above to create the top-level Project Deliverables and decompose your approved scope.
        </p>
      </div>
    );
  }

  // Top level nodes: parentId is null, empty string, or undefined
  const rootNodes = nodes.filter((n) => !n.parentId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {rootNodes.map((root) => {
        const children = nodes.filter((n) => n.parentId === root.wbsId);
        return (
          <WBSNodeItem
            key={root.wbsId}
            node={root}
            childrenNodes={children}
            allNodes={nodes}
            onAddChild={onAddChild}
            onEdit={onEdit}
            onDelete={onDelete}
            level={0}
          />
        );
      })}
    </div>
  );
};

export default WBSBuilder;
