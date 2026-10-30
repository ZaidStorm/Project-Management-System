import React, { useState, useEffect } from 'react';
import { useProjects } from '../hooks/useProjects';
import { qualityRiskService } from '../services/qualityRiskService';
import { scheduleService } from '../services/scheduleService';
import { wbsService } from '../services/wbsService';
import DefectForm from '../components/quality/DefectForm';
import ChecklistForm from '../components/quality/ChecklistForm';
import InspectionForm from '../components/quality/InspectionForm';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { Plus, CheckSquare, AlertCircle, FileCheck, Trash2, Edit3 } from 'lucide-react';

const QualityManagement = () => {
  const { currentProject } = useProjects();
  const [activeTab, setActiveTab] = useState('defects'); // 'defects', 'checklists', 'inspections'

  const [defects, setDefects] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [activities, setActivities] = useState([]);
  const [wbsNodes, setWbsNodes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isDefectModalOpen, setIsDefectModalOpen] = useState(false);
  const [selectedDefect, setSelectedDefect] = useState(null);

  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);

  useEffect(() => {
    if (currentProject?._id) {
      loadData();
    }
  }, [currentProject]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [defRes, chkRes, inspRes, actRes, wbsRes] = await Promise.all([
        qualityRiskService.getDefects(currentProject._id),
        qualityRiskService.getChecklists(currentProject._id),
        qualityRiskService.getInspections(currentProject._id),
        scheduleService.getActivities(currentProject._id),
        wbsService.getWBS(currentProject._id)
      ]);
      setDefects(defRes.data.data || []);
      setChecklists(chkRes.data.data || []);
      setInspections(inspRes.data.data || []);
      setActivities(actRes.data.data || []);
      setWbsNodes(wbsRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load quality management data.');
    } finally {
      setLoading(false);
    }
  };

  // Defect Handlers
  const handleSaveDefect = async (formData) => {
    if (selectedDefect) {
      await qualityRiskService.updateDefect(selectedDefect._id, formData);
    } else {
      await qualityRiskService.createDefect(currentProject._id, formData);
    }
    await loadData();
  };

  const handleDeleteDefect = async (id) => {
    if (!window.confirm('Are you sure you want to delete this defect record?')) return;
    try {
      await qualityRiskService.deleteDefect(id);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete defect.');
    }
  };

  // Checklist Handlers
  const handleSaveChecklist = async (formData) => {
    await qualityRiskService.createChecklist(currentProject._id, formData);
    await loadData();
  };

  const handleToggleChecklistItem = async (checklist, itemIndex) => {
    const updatedItems = [...checklist.items];
    updatedItems[itemIndex].isChecked = !updatedItems[itemIndex].isChecked;
    const allChecked = updatedItems.every(i => i.isChecked);

    try {
      await qualityRiskService.updateChecklist(checklist._id, {
        items: updatedItems,
        result: allChecked ? 'PASS' : 'PENDING'
      });
      await loadData();
    } catch (err) {
      alert('Failed to update checklist item status.');
    }
  };

  // Inspection Handlers
  const handleSaveInspection = async (formData) => {
    await qualityRiskService.createInspection(currentProject._id, formData);
    await loadData();
  };

  if (!currentProject) {
    return (
      <div className="empty-state-card">
        <h3>No Project Selected</h3>
        <p>Please select an active project to manage Quality.</p>
      </div>
    );
  }

  if (loading) return <Loading text="Loading Quality Assurance & Testing Data..." />;

  // Summary Metrics
  const criticalDefects = defects.filter(d => d.severity === 'Critical' && d.status !== 'Closed' && d.status !== 'Resolved').length;
  const openDefects = defects.filter(d => d.status !== 'Closed' && d.status !== 'Resolved').length;
  const passedInspections = inspections.filter(i => i.result === 'PASS').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Module 5: Quality Management</h1>
          <p className="page-subtitle">
            Defect tracking, deliverable quality checklists, and testing inspection records.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {activeTab === 'defects' && (
            <button
              className="btn-primary"
              onClick={() => { setSelectedDefect(null); setIsDefectModalOpen(true); }}
            >
              <Plus size={18} />
              <span>Report Defect</span>
            </button>
          )}
          {activeTab === 'checklists' && (
            <button
              className="btn-primary"
              onClick={() => setIsChecklistModalOpen(true)}
            >
              <Plus size={18} />
              <span>New Checklist</span>
            </button>
          )}
          {activeTab === 'inspections' && (
            <button
              className="btn-primary"
              onClick={() => setIsInspectionModalOpen(true)}
            >
              <Plus size={18} />
              <span>Record Inspection</span>
            </button>
          )}
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadData} />}

      {/* Critical Defect Warning */}
      {criticalDefects > 0 && (
        <div className="alert-banner alert-danger" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={22} />
          <div>
            <strong>Quality Alert:</strong> {criticalDefects} critical severity defect(s) are currently unresolved and require immediate engineering remediation.
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-label">Active Defects</div>
          <div className="stat-value" style={{ color: openDefects > 0 ? 'var(--danger-color)' : 'var(--success-color)' }}>
            {openDefects}
          </div>
          <div className="stat-hint">{criticalDefects} Critical Severity</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Defects Logged</div>
          <div className="stat-value">{defects.length}</div>
          <div className="stat-hint">{defects.filter(d => d.status === 'Resolved' || d.status === 'Closed').length} resolved</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Quality Checklists</div>
          <div className="stat-value">{checklists.length}</div>
          <div className="stat-hint">{checklists.filter(c => c.result === 'PASS').length} verified PASS</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Inspections Executed</div>
          <div className="stat-value" style={{ color: 'var(--primary-color)' }}>
            {inspections.length}
          </div>
          <div className="stat-hint">{passedInspections} passed ({inspections.length > 0 ? Math.round((passedInspections/inspections.length)*100) : 0}%)</div>
        </div>
      </div>

      {/* Module Sub-tabs */}
      <div className="tabs-nav" style={{ marginBottom: '1.5rem' }}>
        <button
          className={`tab-btn ${activeTab === 'defects' ? 'active' : ''}`}
          onClick={() => setActiveTab('defects')}
        >
          <AlertCircle size={16} />
          <span>Defect Tracking ({defects.length})</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'checklists' ? 'active' : ''}`}
          onClick={() => setActiveTab('checklists')}
        >
          <CheckSquare size={16} />
          <span>Quality Checklists ({checklists.length})</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'inspections' ? 'active' : ''}`}
          onClick={() => setActiveTab('inspections')}
        >
          <FileCheck size={16} />
          <span>Inspections & Tests ({inspections.length})</span>
        </button>
      </div>

      {/* TAB 1: DEFECTS */}
      {activeTab === 'defects' && (
        <div className="content-card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Defect Register</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Track issues found during verification and quality testing.
              </p>
            </div>
            <button
              className="btn-sm btn-primary"
              onClick={() => { setSelectedDefect(null); setIsDefectModalOpen(true); }}
            >
              <Plus size={14} /> Log Defect
            </button>
          </div>

          {defects.length === 0 ? (
            <div className="empty-state-box" style={{ padding: '2rem', textAlign: 'center' }}>
              <p>No defects recorded. The project currently has zero logged defects.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="standard-table">
                <thead>
                  <tr>
                    <th>Defect ID</th>
                    <th>Title & Description</th>
                    <th>Severity</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Reported Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {defects.map(d => (
                    <tr key={d._id}>
                      <td><strong>{d.defectId}</strong></td>
                      <td>
                        <strong>{d.title}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {d.description}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${d.severity === 'Critical' ? 'badge-danger' : d.severity === 'High' ? 'badge-warning' : 'badge-secondary'}`}>
                          {d.severity}
                        </span>
                      </td>
                      <td>{d.priority}</td>
                      <td>
                        <span className="badge badge-secondary">{d.status}</span>
                      </td>
                      <td>{d.assignedTo || 'Unassigned'}</td>
                      <td>{new Date(d.reportedDate).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn-icon"
                            onClick={() => { setSelectedDefect(d); setIsDefectModalOpen(true); }}
                            title="Edit defect"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            className="btn-icon btn-danger-icon"
                            onClick={() => handleDeleteDefect(d._id)}
                            title="Delete defect"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CHECKLISTS */}
      {activeTab === 'checklists' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {checklists.length === 0 ? (
            <div className="content-card empty-state-box" style={{ padding: '3rem', textAlign: 'center' }}>
              <p>No deliverable quality checklists created yet. Click "New Checklist" to add one.</p>
            </div>
          ) : (
            checklists.map(chk => (
              <div key={chk._id} className="content-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-secondary">{chk.checklistId}</span>
                      <h3 style={{ margin: 0 }}>{chk.deliverable}</h3>
                      {chk.wbsId && <span className="badge badge-outline">WBS: {chk.wbsId}</span>}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Inspector: <strong>{chk.inspector}</strong> | Date: {new Date(chk.inspectionDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span className={`badge ${chk.result === 'PASS' ? 'badge-success' : chk.result === 'FAIL' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.9rem', padding: '6px 12px' }}>
                      {chk.result}
                    </span>
                  </div>
                </div>

                {/* Items checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                  {chk.items.map((item, idx) => (
                    <label
                      key={item._id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem 0.75rem',
                        background: item.isChecked ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={item.isChecked}
                        onChange={() => handleToggleChecklistItem(chk, idx)}
                        style={{ width: 18, height: 18 }}
                      />
                      <span style={{ textDecoration: item.isChecked ? 'line-through' : 'none', color: item.isChecked ? 'var(--text-muted)' : 'inherit' }}>
                        {item.itemText}
                      </span>
                    </label>
                  ))}
                </div>

                {chk.notes && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
                    Notes: {chk.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: INSPECTIONS */}
      {activeTab === 'inspections' && (
        <div className="content-card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Inspection & Test Execution Records</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Documented testing batches, pass/fail results, and defect counts.
              </p>
            </div>
            <button className="btn-sm btn-primary" onClick={() => setIsInspectionModalOpen(true)}>
              <Plus size={14} /> Record Inspection
            </button>
          </div>

          {inspections.length === 0 ? (
            <div className="empty-state-box" style={{ padding: '2rem', textAlign: 'center' }}>
              <p>No inspections recorded yet. Record formal testing results using the button above.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="standard-table">
                <thead>
                  <tr>
                    <th>Inspection ID</th>
                    <th>Deliverable</th>
                    <th>Date</th>
                    <th>Inspector</th>
                    <th>Total Cases</th>
                    <th>Passed</th>
                    <th>Failed</th>
                    <th>Critical Defects</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {inspections.map(insp => (
                    <tr key={insp._id}>
                      <td><strong>{insp.inspectionId}</strong></td>
                      <td><strong>{insp.deliverable}</strong></td>
                      <td>{new Date(insp.inspectionDate).toLocaleDateString()}</td>
                      <td>{insp.inspector}</td>
                      <td>{insp.totalTestCases}</td>
                      <td style={{ color: 'var(--success-color)', fontWeight: 600 }}>{insp.passedCases}</td>
                      <td style={{ color: insp.failedCases > 0 ? 'var(--danger-color)' : 'inherit', fontWeight: 600 }}>
                        {insp.failedCases}
                      </td>
                      <td>
                        {insp.criticalDefectsCount > 0 ? (
                          <span className="badge badge-danger">{insp.criticalDefectsCount}</span>
                        ) : (
                          '0'
                        )}
                      </td>
                      <td>
                        <span className={`badge ${insp.result === 'PASS' ? 'badge-success' : 'badge-danger'}`}>
                          {insp.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <DefectForm
        isOpen={isDefectModalOpen}
        onClose={() => setIsDefectModalOpen(false)}
        onSave={handleSaveDefect}
        defect={selectedDefect}
        activities={activities}
      />

      <ChecklistForm
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
        onSave={handleSaveChecklist}
        wbsNodes={wbsNodes}
      />

      <InspectionForm
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        onSave={handleSaveInspection}
      />
    </div>
  );
};

export default QualityManagement;
