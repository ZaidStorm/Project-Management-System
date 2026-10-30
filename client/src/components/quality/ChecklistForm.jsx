import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Plus, Trash2 } from 'lucide-react';

const ChecklistForm = ({ isOpen, onClose, onSave, wbsNodes = [] }) => {
  const [formData, setFormData] = useState({
    deliverable: '',
    wbsId: '',
    inspector: 'QA Lead',
    inspectionDate: new Date().toISOString().split('T')[0],
    result: 'PENDING',
    notes: '',
    items: [
      { itemText: 'Requirements reviewed and approved', isChecked: true },
      { itemText: 'Code reviewed according to style standards', isChecked: true },
      { itemText: 'Unit tests passed with >80% coverage', isChecked: true },
      { itemText: 'Integration tests passed without critical defects', isChecked: false },
      { itemText: 'Security & vulnerability inspection completed', isChecked: false },
      { itemText: 'Client acceptance / sign-off criteria fulfilled', isChecked: false }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemToggle = (index) => {
    setFormData(prev => {
      const updated = [...prev.items];
      updated[index].isChecked = !updated[index].isChecked;
      return { ...prev, items: updated };
    });
  };

  const handleItemTextChange = (index, text) => {
    setFormData(prev => {
      const updated = [...prev.items];
      updated[index].itemText = text;
      return { ...prev, items: updated };
    });
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { itemText: '', isChecked: false }]
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.deliverable) {
      setError('Deliverable name is required.');
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quality checklist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Quality Checklist">
      <form onSubmit={handleSubmit} className="standard-form">
        {error && <div className="error-banner">{error}</div>}

        <div className="form-group">
          <label>Deliverable Name *</label>
          <input
            type="text"
            name="deliverable"
            value={formData.deliverable}
            onChange={handleChange}
            placeholder="e.g. Patient Registration Module"
            className="form-control"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Linked WBS Deliverable / Node</label>
            <select
              name="wbsId"
              value={formData.wbsId}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">-- Select WBS Node --</option>
              {wbsNodes.map(node => (
                <option key={node._id} value={node.code || node.wbsId || node._id}>
                  {node.code} - {node.name} ({node.nodeType})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Inspector Name</label>
            <input
              type="text"
              name="inspector"
              value={formData.inspector}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Inspection Date</label>
            <input
              type="date"
              name="inspectionDate"
              value={formData.inspectionDate}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Overall Result</label>
            <select
              name="result"
              value={formData.result}
              onChange={handleChange}
              className="form-control"
            >
              <option value="PENDING">PENDING</option>
              <option value="PASS">PASS</option>
              <option value="FAIL">FAIL</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ margin: 0 }}>Checklist Items</label>
            <button
              type="button"
              className="btn-sm btn-outline"
              onClick={handleAddItem}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <Plus size={14} /> Add Item
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '220px', overflowY: 'auto' }}>
            {formData.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={item.isChecked}
                  onChange={() => handleItemToggle(idx)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={item.itemText}
                  onChange={(e) => handleItemTextChange(idx, e.target.value)}
                  placeholder="Checklist item description..."
                  className="form-control"
                  style={{ flex: 1 }}
                  required
                />
                <button
                  type="button"
                  className="btn-icon btn-danger-icon"
                  onClick={() => handleRemoveItem(idx)}
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Quality Notes</label>
          <textarea
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Observations or follow-up items..."
            className="form-control"
          />
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Checklist'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChecklistForm;
