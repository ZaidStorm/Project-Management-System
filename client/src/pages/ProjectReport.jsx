import React, { useState, useEffect } from 'react';
import { useProjects } from '../hooks/useProjects';
import { reportingService } from '../services/reportingService';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { Printer, RefreshCw, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const ProjectReport = () => {
  const { currentProject } = useProjects();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentProject?._id) {
      loadReport();
    }
  }, [currentProject]);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await reportingService.getFullReport(currentProject._id);
      setReport(res.data.data || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate comprehensive project report.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!currentProject) {
    return (
      <div className="empty-state-card">
        <h3>No Project Selected</h3>
        <p>Please select an active project to generate the Project Audit Report.</p>
      </div>
    );
  }

  if (loading) return <Loading text="Compiling Comprehensive PMIS Project Audit Report (Modules 1–6)..." />;

  const p = report?.project || currentProject;
  const charter = report?.charter || {};
  const plan = report?.plan || {};
  const closure = report?.closure || {};
  const reqs = report?.requirements || [];
  const wbs = report?.wbsNodes || [];
  const changes = report?.changeRequests || [];
  const activities = report?.activities || [];
  const resources = report?.resources || [];
  const expenses = report?.expenses || [];
  const defects = report?.defects || [];
  const risks = report?.risks || [];
  const perf = report?.performance || {};
  const evm = perf.evm || {};

  const totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Action Header - hidden when printing */}
      <div className="page-header no-print">
        <div>
          <h1 className="page-title">Comprehensive Project Audit Report</h1>
          <p className="page-subtitle">
            Auditable documentation covering Modules 1 through 6 of the Project Management Information System.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={loadReport}>
            <RefreshCw size={16} />
            <span>Regenerate</span>
          </button>
          <button className="btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadReport} />}

      {/* Printable Report Document */}
      <div
        className="report-document"
        style={{
          background: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        {/* Document Header */}
        <div style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--primary)', fontWeight: 700 }}>
                PROJECT MANAGEMENT INFORMATION SYSTEM (PMIS)
              </div>
              <h1 style={{ fontSize: '1.8rem', margin: '0.5rem 0 0.25rem 0' }}>{p.projectName}</h1>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Project ID: <strong>{p.projectId}</strong> | Category: {p.category || 'General'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${p.status === 'Completed' ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                Status: {p.status || 'Active'}
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Generated: {new Date(report?.generatedAt || Date.now()).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Executive Performance Summary
          </h2>
          <div className="stats-grid">
            <div className="stat-card" style={{ padding: '0.75rem' }}>
              <div className="stat-label">Overall Progress</div>
              <div className="stat-value" style={{ fontSize: '1.4rem', color: 'var(--primary-color)' }}>
                {perf.overallProgress || 0}%
              </div>
            </div>
            <div className="stat-card" style={{ padding: '0.75rem' }}>
              <div className="stat-label">Approved Budget</div>
              <div className="stat-value" style={{ fontSize: '1.4rem' }}>
                Rs. {Number(p.approvedBudget || p.budget || 0).toLocaleString()}
              </div>
            </div>
            <div className="stat-card" style={{ padding: '0.75rem' }}>
              <div className="stat-label">Actual Expenditure</div>
              <div className="stat-value" style={{ fontSize: '1.4rem', color: totalExpense > (p.approvedBudget || 0) ? 'var(--danger-color)' : 'inherit' }}>
                Rs. {totalExpense.toLocaleString()}
              </div>
            </div>
            <div className="stat-card" style={{ padding: '0.75rem' }}>
              <div className="stat-label">CPI / SPI</div>
              <div className="stat-value" style={{ fontSize: '1.4rem' }}>
                {(evm.cpi || 1).toFixed(2)} / {(evm.spi || 1).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: MODULE 1 - INITIATION & CHARTER */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            1. Project Initiation & Charter (Module 1)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <p><strong>Project Manager:</strong> {charter.projectManager || p.projectManager || 'Not assigned'}</p>
              <p><strong>Target Deadline:</strong> {p.deadline ? new Date(p.deadline).toLocaleDateString() : 'None set'}</p>
              <p><strong>Charter Status:</strong> <span className="badge badge-secondary">{charter.charterStatus || 'Draft'}</span></p>
            </div>
            <div>
              <p><strong>Project Objectives:</strong></p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {charter.objectives || p.objectives || p.description || 'None recorded'}
              </p>
            </div>
          </div>

          {charter.stakeholders && charter.stakeholders.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Key Stakeholders</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {charter.stakeholders.map((s, idx) => (
                  <span key={idx} className="badge badge-outline">
                    {s.name} ({s.role}) - {s.influence || 'Medium'} Influence
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: MODULE 2 - SCOPE & WBS */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            2. Scope Management & Work Breakdown Structure (Module 2)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Strict Rule Enforced: Only requirements with <code>approvalStatus: "Approved"</code> form the Approved Scope and can be broken down into WBS nodes.
          </p>

          <div style={{ margin: '1rem 0' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              Approved Project Scope ({reqs.filter(r => r.approvalStatus === 'Approved').length} items approved)
            </h4>
            <table className="standard-table" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th>Req ID</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Approval Status</th>
                </tr>
              </thead>
              <tbody>
                {reqs.filter(r => r.approvalStatus === 'Approved').map(r => (
                  <tr key={r._id}>
                    <td><strong>{r.requirementId}</strong></td>
                    <td>{r.title}</td>
                    <td>{r.type}</td>
                    <td><span className="badge badge-secondary">{r.priority}</span></td>
                    <td><span className="badge badge-success">Approved</span></td>
                  </tr>
                ))}
                {reqs.filter(r => r.approvalStatus === 'Approved').length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      No approved requirements in official scope.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ margin: '1rem 0' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              Work Breakdown Structure Hierarchy ({wbs.length} Nodes)
            </h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.75rem' }}>
              {wbs.map(node => (
                <div key={node._id} style={{ fontSize: '0.85rem', padding: '3px 0' }}>
                  <code>{node.code}</code> — <strong>{node.name}</strong> ({node.nodeType})
                  {node.requirementId && <span style={{ color: 'var(--primary-color)', marginLeft: '8px' }}>[Req: {node.requirementId}]</span>}
                </div>
              ))}
              {wbs.length === 0 && <p style={{ color: 'var(--text-muted)', margin: 0 }}>No WBS nodes defined.</p>}
            </div>
          </div>
        </div>

        {/* SECTION 3: MODULE 3 - SCHEDULE & RESOURCES */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            3. Schedule & Resource Management (Module 3)
          </h2>
          <table className="standard-table" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
            <thead>
              <tr>
                <th>Activity ID</th>
                <th>Name</th>
                <th>Dates</th>
                <th>Duration</th>
                <th>Assigned Resources</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.map(act => (
                <tr key={act._id}>
                  <td><strong>{act.activityId}</strong></td>
                  <td>{act.name}</td>
                  <td>
                    {new Date(act.startDate).toLocaleDateString()} &rarr; {new Date(act.endDate).toLocaleDateString()}
                  </td>
                  <td>{act.duration || 1}d</td>
                  <td>
                    {act.assignedResources?.length > 0 ? act.assignedResources.join(', ') : 'Unassigned'}
                  </td>
                  <td>{act.progress || 0}%</td>
                  <td>
                    <span className={`badge ${act.status === 'Completed' ? 'badge-success' : act.status === 'Delayed' ? 'badge-danger' : 'badge-secondary'}`}>
                      {act.status}
                    </span>
                  </td>
                </tr>
              ))}
              {activities.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No activities created.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* SECTION 4: MODULE 4 - COST & EVM */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            4. Cost Management & Earned Value Analysis (Module 4)
          </h2>
          <div className="stats-grid" style={{ marginBottom: '1rem' }}>
            <div className="stat-card" style={{ padding: '0.75rem' }}>
              <div className="stat-label">Planned Value (PV)</div>
              <div className="stat-value" style={{ fontSize: '1.25rem' }}>Rs. {(evm.pv || 0).toLocaleString()}</div>
            </div>
            <div className="stat-card" style={{ padding: '0.75rem' }}>
              <div className="stat-label">Earned Value (EV)</div>
              <div className="stat-value" style={{ fontSize: '1.25rem' }}>Rs. {(evm.ev || 0).toLocaleString()}</div>
            </div>
            <div className="stat-card" style={{ padding: '0.75rem' }}>
              <div className="stat-label">Actual Cost (AC)</div>
              <div className="stat-value" style={{ fontSize: '1.25rem' }}>Rs. {(evm.ac || 0).toLocaleString()}</div>
            </div>
            <div className="stat-card" style={{ padding: '0.75rem' }}>
              <div className="stat-label">Cost / Sched Performance</div>
              <div className="stat-value" style={{ fontSize: '1.25rem' }}>
                CPI: {(evm.cpi || 1).toFixed(2)} | SPI: {(evm.spi || 1).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: MODULE 5 - QUALITY & RISK */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            5. Quality & Risk Control (Module 5)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>Defects ({defects.length} Total)</h4>
              <ul style={{ fontSize: '0.85rem', paddingLeft: '1.2rem' }}>
                {defects.slice(0, 5).map(d => (
                  <li key={d._id} style={{ marginBottom: '4px' }}>
                    <strong>{d.defectId}:</strong> {d.title} ({d.severity} / {d.status})
                  </li>
                ))}
                {defects.length === 0 && <li style={{ color: 'var(--text-muted)' }}>Zero defects recorded.</li>}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>Key Project Risks ({risks.length} Total)</h4>
              <ul style={{ fontSize: '0.85rem', paddingLeft: '1.2rem' }}>
                {risks.slice(0, 5).map(r => (
                  <li key={r._id} style={{ marginBottom: '4px' }}>
                    <strong>{r.riskId}:</strong> {r.title} ({r.riskLevel} - Score {r.riskScore})
                  </li>
                ))}
                {risks.length === 0 && <li style={{ color: 'var(--text-muted)' }}>Zero risks recorded.</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* SECTION 6: MODULE 1/6 - CLOSURE & SIGN-OFF */}
        <div>
          <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            6. Project Governance & Final Sign-Off
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <p><strong>Closure Approval:</strong> {closure.approved ? 'Approved' : 'Pending Formal Sign-off'}</p>
              <p><strong>Approved By:</strong> {closure.approvedBy || 'Pending'}</p>
              <p><strong>Closure Date:</strong> {closure.closureDate ? new Date(closure.closureDate).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <p><strong>Lessons Learned:</strong></p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {closure.lessonsLearned || 'No closure notes documented yet.'}
              </p>
            </div>
          </div>

          {/* Signature Lines for Print */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px dashed var(--border-color)' }}>
            <div style={{ textAlign: 'center', width: '200px' }}>
              <div style={{ borderBottom: '1px solid var(--text-color)', marginBottom: '0.5rem', height: '30px' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Project Manager Signature</div>
            </div>
            <div style={{ textAlign: 'center', width: '200px' }}>
              <div style={{ borderBottom: '1px solid var(--text-color)', marginBottom: '0.5rem', height: '30px' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Client / Sponsor Sign-off</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectReport;
