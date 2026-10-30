import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, PlusCircle, ArrowLeft, ShieldCheck, CheckSquare } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { wbsService } from '../services/wbsService';
import { requirementService } from '../services/requirementService';
import WBSBuilder from '../components/wbs/WBSBuilder';
import WBSNodeForm from '../components/wbs/WBSNodeForm';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';

const WBSPage = () => {
  const { currentProject } = useProjects();
  const navigate = useNavigate();

  const [nodes, setNodes] = useState([]);
  const [approvedRequirements, setApprovedRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [targetParentId, setTargetParentId] = useState(null);
  const [nodeToDelete, setNodeToDelete] = useState(null);

  const fetchData = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      setError(null);
      const [wbsRes, scopeRes] = await Promise.all([
        wbsService.getAll(currentProject.projectId),
        requirementService.getApprovedScope(currentProject.projectId)
      ]);
      setNodes(wbsRes.data || []);
      setApprovedRequirements(scopeRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load WBS hierarchy');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentProject]);

  if (!currentProject) {
    return (
      <div className="page-body">
        <div className="section-card glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No project selected. Please choose a project or create a new one.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading message="Loading Work Breakdown Structure tree..." />;
  }

  if (error) {
    return (
      <div className="page-body">
        <ErrorMessage message={error} onRetry={fetchData} />
      </div>
    );
  }

  const handleOpenAdd = (parentId = null) => {
    setEditingNode(null);
    setTargetParentId(parentId);
    setModalOpen(true);
  };

  const handleOpenEdit = (node) => {
    setEditingNode(node);
    setTargetParentId(node.parentId);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    if (editingNode) {
      await wbsService.update(editingNode._id, formData);
    } else {
      await wbsService.create(currentProject.projectId, formData);
    }
    setModalOpen(false);
    setEditingNode(null);
    await fetchData();
  };

  const handleDelete = async () => {
    if (!nodeToDelete) return;
    await wbsService.delete(nodeToDelete._id);
    setNodeToDelete(null);
    await fetchData();
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Layers color="var(--primary)" size={28} />
            Work Breakdown Structure (WBS)
          </h1>
          <p>Module 2: Visual hierarchical decomposition of approved project deliverables and work packages</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" icon={ShieldCheck} onClick={() => navigate('/approved-scope')}>
            Approved Scope ({approvedRequirements.length})
          </Button>
          <Button variant="primary" icon={PlusCircle} onClick={() => handleOpenAdd(null)}>
            Add WBS Node
          </Button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
          <div>
            Total WBS Elements: <strong style={{ color: 'var(--text-main)' }}>{nodes.length}</strong>
          </div>
          <div>
            Deliverables: <strong style={{ color: 'var(--accent-cyan)' }}>{nodes.filter((n) => n.nodeType === 'Deliverable').length}</strong>
          </div>
          <div>
            Work Packages: <strong style={{ color: 'var(--accent-emerald)' }}>{nodes.filter((n) => n.nodeType === 'Work Package').length}</strong>
          </div>
          <div>
            Tasks: <strong style={{ color: 'var(--accent-amber)' }}>{nodes.filter((n) => n.nodeType === 'Task').length}</strong>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          Click <strong style={{ color: 'var(--accent-cyan)' }}>+</strong> to add child work packages.
        </div>
      </div>

      {/* WBS Tree */}
      <WBSBuilder
        nodes={nodes}
        onAddChild={(parentId) => handleOpenAdd(parentId)}
        onEdit={handleOpenEdit}
        onDelete={(node) => setNodeToDelete(node)}
      />

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingNode(null);
        }}
        title={editingNode ? `Edit WBS Node: [${editingNode.code}] ${editingNode.name}` : 'Create WBS Node'}
      >
        <WBSNodeForm
          node={editingNode}
          parentId={targetParentId}
          existingNodes={nodes}
          approvedRequirements={approvedRequirements}
          onSave={handleSave}
          onCancel={() => {
            setModalOpen(false);
            setEditingNode(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!nodeToDelete}
        onClose={() => setNodeToDelete(null)}
        onConfirm={handleDelete}
        title="Delete WBS Node"
        message={`Are you sure you want to delete "${nodeToDelete?.name}" (${nodeToDelete?.code})? Warning: This will also permanently delete all sub-nodes and work packages underneath it.`}
        confirmText="Delete Node & Children"
        danger={true}
      />
    </div>
  );
};

export default WBSPage;
