import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Layers,
  CheckCircle2,
  Calendar,
  DollarSign,
  ArrowRight,
  Eye,
  ChevronRight,
  TrendingUp,
  User,
  Building,
  Building2,
  Clock,
  CalendarCheck,
  Zap,
  MessageSquare,
  FileText,
  Sliders,
  AlertTriangle,
  FileCheck2
} from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import Loading from '../components/common/Loading';
import { milestoneService } from '../services/milestoneService';
import { statusService } from '../services/statusService';

const Dashboard = () => {
  const { currentProject, loading: projectLoading } = useProjects();
  const navigate = useNavigate();

  const [milestones, setMilestones] = useState([]);
  const [projectStatus, setProjectStatus] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (!currentProject) return;

    const loadData = async () => {
      try {
        setLoadingDetails(true);
        const [mRes, sRes] = await Promise.allSettled([
          milestoneService.getByProjectId(currentProject.projectId),
          statusService.getByProjectId(currentProject.projectId)
        ]);

        if (mRes.status === 'fulfilled') setMilestones(mRes.value.data || []);
        if (sRes.status === 'fulfilled') setProjectStatus(sRes.value.data);
      } catch (err) {
        console.error('Error fetching dashboard details:', err);
      } finally {
        setLoadingDetails(false);
      }
    };

    loadData();
  }, [currentProject]);

  if (projectLoading) {
    return <Loading message="Loading PMIS Enterprise workspace..." />;
  }

  // Milestones matching case study
  const upcomingMilestones = [
    {
      title: 'Design Phase Complete',
      date: 'Nov 18, 2026',
      status: 'Completed',
      statusClass: 'badge-completed',
      nodeClass: 'node-completed'
    },
    {
      title: 'Development Phase Complete',
      date: 'Dec 2, 2026',
      status: 'In Progress',
      statusClass: 'badge-progress',
      nodeClass: 'node-progress'
    },
    {
      title: 'Testing Phase',
      date: 'Dec 20, 2026',
      status: 'Pending',
      statusClass: 'badge-pending',
      nodeClass: 'node-pending'
    },
    {
      title: 'Go-Live / Deployment',
      date: 'Jan 10, 2027',
      status: 'Pending',
      statusClass: 'badge-pending',
      nodeClass: 'node-pending'
    }
  ];

  // Recent SPM audit activity
  const recentActivities = [
    {
      icon: CheckCircle2,
      iconColor: '#10b981',
      iconBg: '#ecfdf5',
      title: 'Milestone marked as complete',
      subtitle: 'Design Phase approved by Client',
      time: '2h ago'
    },
    {
      icon: Layers,
      iconColor: '#2563eb',
      iconBg: '#eff6ff',
      title: 'Budget updated via CR-001',
      subtitle: 'Baseline: PKR 5,000,000 → Revised: PKR 5,800,000',
      time: '5h ago'
    },
    {
      icon: MessageSquare,
      iconColor: '#8b5cf6',
      iconBg: '#faf5ff',
      title: 'New comment by Hospital Network',
      subtitle: 'Revised 19-week timeline approved',
      time: '1d ago'
    },
    {
      icon: Activity,
      iconColor: '#ea580c',
      iconBg: '#fff7ed',
      title: 'Project status transition',
      subtitle: 'Planning → Execution / Development',
      time: '1d ago'
    }
  ];

  return (
    <div className="pmis-dashboard-page">
      {/* 1. Hero Panoramic Project Banner */}
      <section className="pmis-hero-banner">
        <div className="hero-content-col">
          <div className="hero-top-badge">
            <span className="badge-active-project">Active Project</span>
          </div>

          <h1 className="hero-project-title">Smart Healthcare Project</h1>
          <h2 className="hero-project-subtitle">Management and Monitoring System</h2>
          <p className="hero-project-desc">
            An integrated solution to plan, execute, and monitor healthcare projects efficiently connecting 5 network hospitals.
          </p>

          <div className="hero-meta-badges">
            <div className="hero-meta-pill">
              <Layers size={14} className="pill-icon" />
              <span>Module 1: Project Initiation & Integration</span>
            </div>
            <div className="hero-meta-pill">
              <Calendar size={14} className="pill-icon" />
              <span>Started: Oct 27, 2026</span>
            </div>
          </div>
        </div>

        {/* Hero Actions (Only valid navigation buttons from user data) */}
        <div className="hero-actions-col">
          <button
            type="button"
            className="hero-btn-outline"
            onClick={() => navigate('/overview')}
          >
            <Eye size={16} />
            <span>View Project Overview</span>
          </button>
          <button
            type="button"
            className="hero-btn-primary"
            onClick={() => navigate('/charter')}
          >
            <FileCheck2 size={16} />
            <span>Project Charter</span>
          </button>
        </div>

        {/* Hospital Visual Illustration Graphic */}
        <div className="hero-hospital-visual">
          <img
            src="/hospital-hero.jpg"
            alt="Hospital Medical Center Campus"
            className="hero-hospital-img"
          />
          <div className="hero-pulse-overlay">
            <svg viewBox="0 0 500 100" className="ecg-svg" preserveAspectRatio="none">
              <path
                d="M0,50 L120,50 L135,20 L150,85 L165,35 L175,60 L185,50 L320,50 L335,15 L350,90 L365,30 L375,60 L385,50 L500,50"
                fill="none"
                stroke="rgba(255, 255, 255, 0.7)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* 2. Executive Metric Cards */}
      <section className="pmis-metrics-section">
        {/* Card 1: Overall Status */}
        <div
          className="pmis-kpi-card accent-blue"
          onClick={() => navigate('/status')}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-card-header">
            <div className="kpi-icon-circle blue">
              <Activity size={20} />
            </div>
            <ChevronRight size={18} className="kpi-chevron" />
          </div>
          <div className="kpi-label">Overall Status</div>
          <div className="kpi-value">Planning</div>
          <div className="kpi-subtext">Current Phase: Core Development & Integration</div>
        </div>

        {/* Card 2: Progress Rate */}
        <div
          className="pmis-kpi-card accent-green"
          onClick={() => navigate('/milestones')}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-card-header">
            <div className="kpi-icon-circle green">
              <TrendingUp size={20} />
            </div>
            <ChevronRight size={18} className="kpi-chevron" />
          </div>
          <div className="kpi-label">Progress Rate</div>
          <div className="kpi-value">58%</div>
          <div className="kpi-progress-track">
            <div className="kpi-progress-bar green" style={{ width: '58%' }}></div>
          </div>
          <div className="kpi-subtext">Based on milestone completions</div>
        </div>

        {/* Card 3: Milestones Delivered */}
        <div
          className="pmis-kpi-card accent-orange"
          onClick={() => navigate('/milestones')}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-card-header">
            <div className="kpi-icon-circle orange">
              <Calendar size={20} />
            </div>
            <ChevronRight size={18} className="kpi-chevron" />
          </div>
          <div className="kpi-label">Milestones Delivered</div>
          <div className="kpi-value">3 / 9</div>
          <div className="kpi-progress-track">
            <div className="kpi-progress-bar orange" style={{ width: '33.3%' }}></div>
          </div>
          <div className="kpi-subtext">6 pending or in-flight</div>
        </div>

        {/* Card 4: Approved Budget */}
        <div
          className="pmis-kpi-card accent-purple"
          onClick={() => navigate('/cost')}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-card-header">
            <div className="kpi-icon-circle purple">
              <Layers size={20} />
            </div>
            <ChevronRight size={18} className="kpi-chevron" />
          </div>
          <div className="kpi-label">Approved Budget</div>
          <div className="kpi-value">PKR 5,000,000</div>
          <div className="kpi-subtext">Revised BAC: PKR 5,800,000 (CR-001)</div>
        </div>
      </section>

      {/* 3. Main Two-Column Layout */}
      <div className="pmis-dashboard-columns">
        {/* Left Column: Active Project Details & EVM Monitor */}
        <div className="pmis-main-col">
          <div className="section-title-bar">
            <div className="title-with-icon">
              <div className="section-icon-box">
                <Sliders size={18} />
              </div>
              <div>
                <h3 className="section-heading">Active Project</h3>
                <p className="section-subtext">Case Study: Smart Healthcare Project (SHP-001)</p>
              </div>
            </div>

            <div className="section-actions-row">
              <button
                type="button"
                className="link-btn-text"
                onClick={() => navigate('/overview')}
              >
                View Full Details →
              </button>
            </div>
          </div>

          {/* Dedicated SHP-001 Project Card */}
          <div className="project-cards-stack">
            <div
              className="pmis-project-card"
              onClick={() => navigate('/overview')}
              role="button"
              tabIndex={0}
            >
              {/* Left Icon Badge */}
              <div
                className="project-icon-badge"
                style={{ background: '#eff6ff', color: '#2563eb' }}
              >
                <Building2 size={26} />
              </div>

              {/* Card Main Body */}
              <div className="project-card-body">
                {/* Header Row: ID, Title & Status */}
                <div className="project-card-top-row">
                  <div className="project-id-title-group">
                    <span className="project-code-tag">SHP-001</span>
                    <h4 className="project-card-title">
                      Smart Healthcare Project Management and Monitoring System
                    </h4>
                  </div>
                  <span className="project-status-pill status-at-risk">
                    ● At Risk (EVM Variance)
                  </span>
                </div>

                {/* Description */}
                <p className="project-card-desc">
                  Comprehensive hospital management system connecting a network of 5 hospitals with appointment scheduling, lab reporting, consultations, and centralized monitoring.
                </p>

                {/* 5-Column Metadata Row */}
                <div className="project-meta-grid">
                  {/* PM */}
                  <div className="meta-item">
                    <img
                      src="/pm-avatar.png"
                      alt="Project Manager"
                      style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/user-zaid.jpg';
                      }}
                    />
                    <div className="meta-col">
                      <span className="meta-label">Project Manager</span>
                      <span className="meta-val">Zaid</span>
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="meta-item">
                    <Calendar size={15} className="meta-icon green" />
                    <div className="meta-col">
                      <span className="meta-label">Start Date</span>
                      <span className="meta-val">Oct 27, 2026</span>
                    </div>
                  </div>

                  {/* Client / Sponsor */}
                  <div className="meta-item">
                    <Building size={15} className="meta-icon blue" />
                    <div className="meta-col">
                      <span className="meta-label">Client / Sponsor</span>
                      <span className="meta-val">Network of Five Hospitals</span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="meta-item">
                    <Clock size={15} className="meta-icon orange" />
                    <div className="meta-col">
                      <span className="meta-label">Duration (Original → Revised)</span>
                      <span className="meta-val">
                        16 Weeks → <strong className="val-orange">19 Weeks</strong>
                      </span>
                    </div>
                  </div>

                  {/* Revised Deadline */}
                  <div className="meta-item">
                    <CalendarCheck size={15} className="meta-icon red" />
                    <div className="meta-col">
                      <span className="meta-label">Revised Deadline</span>
                      <span className="meta-val val-deadline">Mar 9, 2027</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Chevron */}
              <div className="project-card-chevron">
                <ChevronRight size={20} />
              </div>
            </div>

            {/* Case Study Change Request (CR-001) & EVM Highlight Card */}
            <div
              className="pmis-project-card"
              style={{
                background: '#fffaf5',
                border: '1px solid #fed7aa',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/earned-value')}
              role="button"
              tabIndex={0}
            >
              <div
                className="project-icon-badge"
                style={{ background: '#ffedd5', color: '#ea580c' }}
              >
                <TrendingUp size={24} />
              </div>

              <div className="project-card-body">
                <div className="project-card-top-row">
                  <div className="project-id-title-group">
                    <span
                      className="project-code-tag"
                      style={{ background: '#ffedd5', color: '#c2410c' }}
                    >
                      CR-001 IMPACT
                    </span>
                    <h4 className="project-card-title">
                      Change Request CR-001 & Earned Value (EVM) Performance
                    </h4>
                  </div>
                  <span className="project-status-pill status-delayed">
                    ● Delayed (SPI: 0.84)
                  </span>
                </div>

                <p className="project-card-desc">
                  Approved scope addition: Mobile Consultation App & Lab Reporting. Cost Impact: +PKR 800,000 | Schedule Impact: +3 Weeks. Current EVM Status: CPI = 0.78 (Over Budget), SPI = 0.84 (Behind Schedule).
                </p>

                <div className="project-meta-grid">
                  <div className="meta-item">
                    <DollarSign size={15} className="meta-icon orange" />
                    <div className="meta-col">
                      <span className="meta-label">Planned Value (PV)</span>
                      <span className="meta-val">PKR 3,000,000</span>
                    </div>
                  </div>

                  <div className="meta-item">
                    <TrendingUp size={15} className="meta-icon blue" />
                    <div className="meta-col">
                      <span className="meta-label">Earned Value (EV)</span>
                      <span className="meta-val">PKR 2,520,000</span>
                    </div>
                  </div>

                  <div className="meta-item">
                    <DollarSign size={15} className="meta-icon red" />
                    <div className="meta-col">
                      <span className="meta-label">Actual Cost (AC)</span>
                      <span className="meta-val">PKR 3,230,000</span>
                    </div>
                  </div>

                  <div className="meta-item">
                    <AlertTriangle size={15} className="meta-icon red" />
                    <div className="meta-col">
                      <span className="meta-label">Cost Variance (CV)</span>
                      <span className="meta-val val-deadline">-PKR 710,000</span>
                    </div>
                  </div>

                  <div className="meta-item">
                    <Clock size={15} className="meta-icon orange" />
                    <div className="meta-col">
                      <span className="meta-label">Schedule Variance (SV)</span>
                      <span className="meta-val val-orange">-PKR 480,000</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="project-card-chevron">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Milestones & Recent Activity */}
        <div className="pmis-side-col">
          {/* Card 1: Upcoming Milestones */}
          <div className="pmis-side-widget">
            <div className="widget-header">
              <div className="widget-title-wrap">
                <div className="widget-icon-box blue">
                  <Calendar size={16} />
                </div>
                <h4 className="widget-title">Upcoming Milestones</h4>
              </div>
              <button
                type="button"
                className="widget-link-btn"
                onClick={() => navigate('/milestones')}
              >
                View All →
              </button>
            </div>

            {/* Vertical Connected Timeline */}
            <div className="milestones-timeline">
              {upcomingMilestones.map((m, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-node-wrap">
                    <div className={`timeline-node ${m.nodeClass}`}></div>
                    {idx < upcomingMilestones.length - 1 && (
                      <div className="timeline-connecting-line"></div>
                    )}
                  </div>

                  <div className="timeline-content">
                    <div className="timeline-text">
                      <span className="timeline-title">{m.title}</span>
                      <span className="timeline-date">{m.date}</span>
                    </div>
                    <span className={`timeline-badge ${m.statusClass}`}>{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Recent Activity */}
          <div className="pmis-side-widget">
            <div className="widget-header">
              <div className="widget-title-wrap">
                <div className="widget-icon-box blue">
                  <Zap size={16} />
                </div>
                <h4 className="widget-title">Recent Activity</h4>
              </div>
              <button
                type="button"
                className="widget-link-btn"
                onClick={() => navigate('/status')}
              >
                View All →
              </button>
            </div>

            {/* Activity List */}
            <div className="activity-list">
              {recentActivities.map((act, idx) => {
                const ActIcon = act.icon;
                return (
                  <div key={idx} className="activity-item">
                    <div
                      className="activity-icon-badge"
                      style={{ background: act.iconBg, color: act.iconColor }}
                    >
                      <ActIcon size={16} />
                    </div>
                    <div className="activity-body">
                      <span className="activity-title">{act.title}</span>
                      <span className="activity-subtitle">{act.subtitle}</span>
                    </div>
                    <span className="activity-timestamp">{act.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
