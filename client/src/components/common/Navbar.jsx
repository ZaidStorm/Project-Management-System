import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  Search,
  Bell,
  Moon,
  Home,
  Compass,
  FileCheck2,
  ListTodo,
  CalendarDays,
  DollarSign,
  ShieldAlert,
  BarChart3,
  ChevronDown
} from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';

const Navbar = () => {
  const { currentProject } = useProjects();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isOutsideNav = navRef.current && !navRef.current.contains(e.target);
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(e.target);

      if (isOutsideNav && isOutsideDropdown) {
        setActiveDropdown(null);
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Close dropdown on window resize or page scroll to avoid floating out of place
  useEffect(() => {
    const handleScrollOrResize = () => {
      if (activeDropdown) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener('resize', handleScrollOrResize);
    return () => window.removeEventListener('resize', handleScrollOrResize);
  }, [activeDropdown]);

  // Exactly matching the 6 Modules from the user's case study data
  const websiteMenuItems = [
    {
      id: 'initiation',
      label: 'Initiation',
      moduleNum: 'Module 1: Project Initiation & Governance',
      icon: FileCheck2,
      subItems: [
        { label: 'Project Charter', path: '/charter', desc: 'Objectives, Scope, Stakeholders & Baselines' },
        { label: 'Management Plan', path: '/management-plan', desc: 'Subsidiary plans & governance framework' },
        { label: 'Milestone Schedule', path: '/milestones', desc: 'Key project deliverables & deadlines' },
        { label: 'Status Tracking', path: '/status', desc: 'Active phase & progress monitoring' },
        { label: 'Project Closure', path: '/closure', desc: 'Acceptance, signoffs & lessons learned' }
      ]
    },
    {
      id: 'scope',
      label: 'Scope & WBS',
      moduleNum: 'Module 2: Scope Management & WBS',
      icon: ListTodo,
      subItems: [
        { label: 'Requirements Traceability', path: '/requirements', desc: '11 system requirements (R-01 to R-11)' },
        { label: 'Approved Scope', path: '/approved-scope', desc: 'In-scope vs out-of-scope & deliverables' },
        { label: 'WBS Hierarchy', path: '/wbs', desc: 'Work breakdown structure dictionary & codes' },
        { label: 'Change Requests (CR-001)', path: '/change-requests', desc: 'Scope, cost & schedule change control' }
      ]
    },
    {
      id: 'schedule',
      label: 'Schedule & Team',
      moduleNum: 'Module 3: Schedule & Resource Management',
      icon: CalendarDays,
      subItems: [
        { label: 'Activity Schedule', path: '/activities', desc: '18 activities with durations & sequences' },
        { label: 'Gantt Timeline', path: '/gantt', desc: 'Visual timeline & critical path analysis' },
        { label: 'Resource Allocation', path: '/resources', desc: '7 project team members & roles' },
        { label: 'Dependencies & Delays', path: '/dependencies', desc: 'Predecessor network & delay analysis' }
      ]
    },
    {
      id: 'cost',
      label: 'Cost & EVM',
      moduleNum: 'Module 4: Cost Management & EVM',
      icon: DollarSign,
      subItems: [
        { label: 'Cost Baseline & Expenses', path: '/cost', desc: 'Approved PKR 5.0M & Revised PKR 5.8M budget' },
        { label: 'Earned Value (EVM)', path: '/earned-value', desc: 'CPI 0.78, SPI 0.84, variance & forecasts' }
      ]
    },
    {
      id: 'quality',
      label: 'Quality & Risk',
      moduleNum: 'Module 5: Quality & Risk Management',
      icon: ShieldAlert,
      subItems: [
        { label: 'Quality & Testing', path: '/quality', desc: 'Quality checklist & 5 logged defects' },
        { label: 'Risk Register & PDPC', path: '/risks', desc: '8 project risks & mitigation action plans' }
      ]
    },
    {
      id: 'reports',
      label: 'Performance & Reports',
      moduleNum: 'Module 6: Monitoring & Evaluation',
      icon: BarChart3,
      subItems: [
        { label: 'Integrated Dashboard', path: '/performance-dashboard', desc: 'Cross-module SPM performance monitor' },
        { label: 'Comprehensive Audit Report', path: '/project-report', desc: 'Complete executive project audit' }
      ]
    }
  ];

  const handleDropdownToggle = (id, event) => {
    event.stopPropagation();
    if (activeDropdown === id) {
      setActiveDropdown(null);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const dropdownWidth = 320;
    // Calculate optimal left position so it doesn't bleed offscreen
    let calculatedLeft = rect.left;
    if (calculatedLeft + dropdownWidth > window.innerWidth - 16) {
      calculatedLeft = window.innerWidth - dropdownWidth - 16;
    }
    if (calculatedLeft < 16) {
      calculatedLeft = 16;
    }

    setDropdownPos({
      top: rect.bottom + 6,
      left: calculatedLeft
    });
    setActiveDropdown(id);
  };

  const activeModuleData = websiteMenuItems.find((m) => m.id === activeDropdown);

  return (
    <header className="pmis-global-header" ref={navRef}>
      {/* Row 1: Brand, Search, User Info */}
      <div className="pmis-topbar">
        {/* Brand Logo & Title */}
        <div className="topbar-left">
          <NavLink to="/" className="topbar-brand">
            <div className="topbar-logo-box">
              <Activity size={24} className="logo-pulse-icon" />
            </div>
            <div className="brand-text-col">
              <span className="brand-heading">PMIS Enterprise</span>
              <span className="brand-subtext">Smart Healthcare Project Management</span>
            </div>
          </NavLink>
        </div>

        {/* Search */}
        <div className="topbar-center">
          <div className="topbar-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requirements, WBS, EVM, risks..."
              className="topbar-search-input"
            />
          </div>
        </div>

        {/* Right Tools: Notification, Theme Toggle & Zaid Avatar */}
        <div className="topbar-right">
          {/* Notifications */}
          <div className="topbar-action-wrap">
            <button
              className="topbar-icon-button"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <Bell size={18} />
              <span className="notif-badge-dot"></span>
            </button>

            {showNotifications && (
              <div className="header-dropdown-menu notif-dropdown">
                <div className="notif-dropdown-header">
                  <strong>System Alerts</strong>
                  <span className="badge-new">Active</span>
                </div>
                <div className="notif-item">
                  <div className="notif-indicator green"></div>
                  <div>
                    <div className="notif-title">CR-001 Approved</div>
                    <div className="notif-time">+PKR 800,000 | +3 Weeks (Deadline: Mar 9, 2027)</div>
                  </div>
                </div>
                <div className="notif-item">
                  <div className="notif-indicator orange"></div>
                  <div>
                    <div className="notif-title">EVM Variance Alert</div>
                    <div className="notif-time">CPI 0.78 (Over Budget) | SPI 0.84 (Behind Schedule)</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            className="topbar-icon-button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle Theme"
          >
            <Moon size={18} />
          </button>

          {/* User Profile */}
          <div className="topbar-user-card" onClick={() => navigate('/overview')}>
            <img
              src="/pm-avatar.png"
              alt={currentProject?.projectManager || 'Project Manager'}
              className="topbar-user-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/user-zaid.jpg';
              }}
            />
            <div className="topbar-user-info">
              <span className="topbar-user-name">{currentProject?.projectManager || 'Zaid'}</span>
              <span className="topbar-user-role">Project Manager</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Website Menu Navigation Bar (All Modules with Horizontal Scroll) */}
      <nav className="pmis-subnav website-nav-bar">
        {/* Dashboard */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `website-nav-link ${isActive && location.pathname === '/' ? 'active-nav-item' : ''}`
          }
          onClick={() => setActiveDropdown(null)}
        >
          <Home size={16} />
          <span>Dashboard</span>
        </NavLink>

        {/* Project Overview */}
        <NavLink
          to="/overview"
          className={({ isActive }) =>
            `website-nav-link ${isActive && location.pathname === '/overview' ? 'active-nav-item' : ''}`
          }
          onClick={() => setActiveDropdown(null)}
        >
          <Compass size={16} />
          <span>Overview</span>
        </NavLink>

        {/* 6 Case Study Modules */}
        {websiteMenuItems.map((mod) => {
          const Icon = mod.icon;
          const isOpen = activeDropdown === mod.id;
          const isCurrentModuleActive = mod.subItems.some((item) => location.pathname === item.path);

          return (
            <div key={mod.id} className="website-dropdown-container">
              <button
                type="button"
                className={`website-nav-link dropdown-toggle ${
                  isCurrentModuleActive ? 'active-nav-item' : ''
                } ${isOpen ? 'menu-open' : ''}`}
                onClick={(e) => handleDropdownToggle(mod.id, e)}
              >
                <Icon size={16} />
                <span>{mod.label}</span>
                <ChevronDown size={14} className={`menu-chevron ${isOpen ? 'rotated' : ''}`} />
              </button>
            </div>
          );
        })}
      </nav>

      {/* Floating Split Options Dropdown Menu (Position Fixed so it NEVER gets clipped by scrollbar!) */}
      {activeDropdown && activeModuleData && (
        <div
          ref={dropdownRef}
          className="website-megamenu-dropdown fixed-dropdown"
          style={{
            position: 'fixed',
            top: `${dropdownPos.top}px`,
            left: `${dropdownPos.left}px`,
            zIndex: 9999
          }}
        >
          <div className="dropdown-category-title">{activeModuleData.moduleNum}</div>
          <div className="dropdown-links-list">
            {activeModuleData.subItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `website-dropdown-link ${isActive ? 'current-active-link' : ''}`
                }
                onClick={() => setActiveDropdown(null)}
              >
                <div className="link-title-text">{item.label}</div>
                <div className="link-desc-text">{item.desc}</div>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
