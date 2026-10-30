const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { MONGO_URI } = require('./config/env');
const Project = require('./models/Project');
const ProjectCharter = require('./models/ProjectCharter');
const ManagementPlan = require('./models/ManagementPlan');
const ProjectStatus = require('./models/ProjectStatus');
const Resource = require('./models/Resource');
const Requirement = require('./models/Requirement');
const ChangeRequest = require('./models/ChangeRequest');
const WBSNode = require('./models/WBSNode');
const Activity = require('./models/Activity');
const Dependency = require('./models/Dependency');
const EarnedValue = require('./models/EarnedValue');
const Defect = require('./models/Defect');
const QualityChecklist = require('./models/QualityChecklist');
const Risk = require('./models/Risk');
const Milestone = require('./models/Milestone');

async function seed() {
  try {
    const mongoUri = MONGO_URI || 'mongodb://127.0.0.1:27017/project_management_db';
    console.log(`[Seed] Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB.');

    const PROJECT_ID = 'SHP-001';

    // Clean existing data for this project to ensure fresh, consistent state
    console.log(`[Seed] Cleaning previous records for ${PROJECT_ID}...`);
    await Promise.all([
      Project.deleteMany({ projectId: PROJECT_ID }),
      ProjectCharter.deleteMany({ projectId: PROJECT_ID }),
      ManagementPlan.deleteMany({ projectId: PROJECT_ID }),
      ProjectStatus.deleteMany({ projectId: PROJECT_ID }),
      Resource.deleteMany({ projectId: PROJECT_ID }),
      Requirement.deleteMany({ projectId: PROJECT_ID }),
      ChangeRequest.deleteMany({ projectId: PROJECT_ID }),
      WBSNode.deleteMany({ projectId: PROJECT_ID }),
      Activity.deleteMany({ projectId: PROJECT_ID }),
      Dependency.deleteMany({ projectId: PROJECT_ID }),
      EarnedValue.deleteMany({ projectId: PROJECT_ID }),
      Defect.deleteMany({ projectId: PROJECT_ID }),
      QualityChecklist.deleteMany({ projectId: PROJECT_ID }),
      Risk.deleteMany({ projectId: PROJECT_ID }),
      Milestone.deleteMany({ projectId: PROJECT_ID })
    ]);

    // 1. Project Initiation / Project Charter
    console.log('[Seed] Seeding Project Master Record...');
    const startDate = new Date('2026-10-27');
    const originalDeadline = new Date('2027-02-16');
    const revisedDeadline = new Date('2027-03-09');

    await Project.create({
      projectId: PROJECT_ID,
      projectName: 'Smart Healthcare Project Management and Monitoring System',
      description: 'Comprehensive hospital management system connecting a network of 5 hospitals with appointment scheduling, lab reporting, consultations, and monitoring.',
      projectType: 'Software Development',
      client: 'Network of Five Hospitals',
      projectManager: 'Project Manager',
      startDate: startDate,
      deadline: revisedDeadline,
      originalDeadline: originalDeadline,
      revisedDeadline: revisedDeadline,
      originalDuration: '16 Weeks',
      changeDuration: '3 Weeks',
      revisedDuration: '19 Weeks',
      approvedBudget: 5000000,
      changeCost: 800000,
      revisedBudget: 5800000,
      status: 'At Risk',
      priority: 'High',
      pv: 2500000,
      ev: 2100000,
      ac: 2700000,
      cpi: 0.78,
      spi: 0.84
    });

    console.log('[Seed] Seeding Project Charter...');
    await ProjectCharter.create({
      projectId: PROJECT_ID,
      projectType: 'Software Development',
      client: 'Network of Five Hospitals',
      projectManager: 'Project Manager',
      priority: 'High',
      originalDeadline: originalDeadline,
      deadline: revisedDeadline,
      revisedDeadline: revisedDeadline,
      originalDuration: '16 Weeks',
      changeDuration: '3 Weeks',
      revisedDuration: '19 Weeks',
      approvedBudget: 5000000,
      changeCost: 800000,
      revisedBudget: 5800000,
      approvalStatus: 'Approved',
      approvedBy: 'Hospital Management & Sponsor',
      approvalDate: new Date('2026-10-28'),
      objectives: [
        'Manage patient appointments.',
        'Manage laboratory reports.',
        'Manage doctor schedules.',
        'Provide online consultations.',
        'Manage hospital billing.',
        'Provide centralized project monitoring.',
        'Maintain project cost and schedule information.',
        'Monitor software quality and defects.',
        'Handle approved scope changes.'
      ],
      inScope: [
        'Patient Appointment Management',
        'Laboratory Report Management',
        'Doctor Schedule Management',
        'Online Consultation',
        'Hospital Billing',
        'Database',
        'Web Application',
        'Testing',
        'Project Monitoring',
        'AI Diagnosis (Approved via CR-001)',
        'Mobile Application (Approved via CR-001)'
      ],
      outOfScope: [
        'AI-based preliminary diagnosis (Initially out of scope; added via CR-001)',
        'Mobile application (Initially out of scope; added via CR-001)'
      ],
      assumptions: [
        'Hospital network has stable intranet and internet connectivity',
        'Medical staff receives hands-on user training prior to full rollout'
      ],
      constraints: [
        'Strict HIPAA and healthcare data privacy standards',
        'Budget ceiling of PKR 5,800,000 after approved change request'
      ],
      stakeholders: [
        { name: 'Hospital Management', role: 'Client/Sponsor', organization: 'Network of Five Hospitals', influence: 'High', interest: 'High', influenceLevel: 'High' },
        { name: 'Project Manager', role: 'Project Manager', organization: 'PMO', influence: 'High', interest: 'High', influenceLevel: 'High' },
        { name: 'Doctors', role: 'End Users', organization: 'Hospital Clinical Staff', influence: 'Medium', interest: 'High', influenceLevel: 'Medium' },
        { name: 'Hospital Staff', role: 'End Users', organization: 'Hospital Operations', influence: 'Medium', interest: 'High', influenceLevel: 'Medium' },
        { name: 'Patients', role: 'End Users', organization: 'General Public', influence: 'Medium', interest: 'High', influenceLevel: 'Medium' },
        { name: 'Development Team', role: 'Technical Team', organization: 'Software Engineering', influence: 'High', interest: 'High', influenceLevel: 'High' },
        { name: 'QA Engineer', role: 'Quality Assurance', organization: 'Quality Team', influence: 'Medium', interest: 'High', influenceLevel: 'Medium' }
      ]
    });

    // 2. Project Team (7 Members)
    console.log('[Seed] Seeding 7 Project Team Members...');
    const resources = [
      { resourceId: 'PM-001', name: 'Project Manager', role: 'Project Manager', department: 'Management', hourlyRate: 3500 },
      { resourceId: 'BE-001', name: 'Backend Developer 1', role: 'Backend Developer', department: 'Engineering', hourlyRate: 2500 },
      { resourceId: 'BE-002', name: 'Backend Developer 2', role: 'Backend Developer', department: 'Engineering', hourlyRate: 2500 },
      { resourceId: 'FE-001', name: 'Frontend Developer 1', role: 'Frontend Developer', department: 'Engineering', hourlyRate: 2400 },
      { resourceId: 'FE-002', name: 'Frontend Developer 2', role: 'Frontend Developer', department: 'Engineering', hourlyRate: 2400 },
      { resourceId: 'DB-001', name: 'Database Developer', role: 'Database Developer', department: 'Data Management', hourlyRate: 2600 },
      { resourceId: 'QA-001', name: 'Quality Assurance Engineer', role: 'Quality Assurance Engineer', department: 'Quality Assurance', hourlyRate: 2200 }
    ];

    for (const res of resources) {
      await Resource.create({
        projectId: PROJECT_ID,
        ...res,
        skills: [res.role],
        allocatedActivities: []
      });
    }

    // 3. Requirements (11 items)
    console.log('[Seed] Seeding 11 Requirements...');
    const requirementsData = [
      { requirementId: 'REQ-001', title: 'Patient Appointment Management', description: 'Enable patients to book and reschedule appointments across 5 hospital branches.', priority: 'High', status: 'Approved', approvalStatus: 'Approved' },
      { requirementId: 'REQ-002', title: 'Laboratory Report Management', description: 'Centralized digital test report generation, verification, and patient access.', priority: 'High', status: 'Approved', approvalStatus: 'Approved' },
      { requirementId: 'REQ-003', title: 'Doctor Schedule Management', description: 'Roster and duty hour tracking for specialized hospital doctors.', priority: 'High', status: 'Approved', approvalStatus: 'Approved' },
      { requirementId: 'REQ-004', title: 'Online Consultation', description: 'Video and chat telehealth consultation modules between doctors and patients.', priority: 'High', status: 'Approved', approvalStatus: 'Approved' },
      { requirementId: 'REQ-005', title: 'Hospital Billing', description: 'Integrated invoice, billing breakdown, payment verification, and insurance processing.', priority: 'High', status: 'Approved', approvalStatus: 'Approved' },
      { requirementId: 'REQ-006', title: 'Centralized Project Database', description: 'Secure, high-availability MongoDB cluster storing multi-hospital medical records.', priority: 'High', status: 'Approved', approvalStatus: 'Approved' },
      { requirementId: 'REQ-007', title: 'User Authentication and Authorization', description: 'Role-based access control for doctors, staff, patients, and admins.', priority: 'High', status: 'Approved', approvalStatus: 'Approved' },
      { requirementId: 'REQ-008', title: 'Project Monitoring Dashboard', description: 'Real-time executive dashboard for system health, KPIs, and module usage.', priority: 'Medium', status: 'Approved', approvalStatus: 'Approved' },
      { requirementId: 'REQ-009', title: 'Defect Tracking', description: 'Integrated defect logging and bug tracking mechanism.', priority: 'Medium', status: 'Approved', approvalStatus: 'Approved' },
      { requirementId: 'REQ-010', title: 'AI-based Preliminary Diagnosis', description: 'AI-driven symptom checker providing preliminary diagnosis assistance.', priority: 'High', status: 'Approved', approvalStatus: 'Approved' },
      { requirementId: 'REQ-011', title: 'Mobile Application', description: 'Cross-platform mobile application for Android and iOS patients and clinicians.', priority: 'High', status: 'Approved', approvalStatus: 'Approved' }
    ];

    for (const req of requirementsData) {
      await Requirement.create({
        projectId: PROJECT_ID,
        ...req,
        type: 'Functional',
        requestedBy: 'Hospital Management',
        approvedBy: 'Change Control Board',
        approvedAt: new Date('2026-11-15')
      });
    }

    // 4. Change Request (CR-001)
    console.log('[Seed] Seeding Change Request CR-001...');
    await ChangeRequest.create({
      changeRequestId: 'CR-001',
      projectId: PROJECT_ID,
      title: 'Addition of AI Diagnosis and Mobile Application',
      requestedBy: 'Hospital Management',
      requestedDate: new Date('2026-11-10'),
      reason: 'Additional healthcare functionality requested by hospital management',
      description: 'Add AI-based preliminary diagnosis module and mobile application',
      costImpact: 800000,
      scheduleImpact: 21, // +3 weeks (21 days)
      originalBudget: 5000000,
      revisedBudget: 5800000,
      originalDuration: '16 Weeks',
      revisedDuration: '19 Weeks',
      priority: 'High',
      status: 'Approved',
      approvalStatus: 'Approved',
      approvedBy: 'Hospital Management & CCB',
      approvedAt: new Date('2026-11-15'),
      affectedRequirements: ['REQ-010', 'REQ-011'],
      justification: 'Hospital management requested additional functionality to improve healthcare services through AI-assisted preliminary diagnosis and mobile accessibility.'
    });

    // 5. WBS Hierarchical Structure
    console.log('[Seed] Seeding WBS Structure...');
    const wbsData = [
      { wbsId: '1.0', code: '1.0', name: 'Smart Healthcare System', nodeType: 'Deliverable', parentId: null, order: 1 },
      
      { wbsId: '1.1', code: '1.1', name: 'Project Management', nodeType: 'Deliverable', parentId: '1.0', order: 1 },
      { wbsId: '1.1.1', code: '1.1.1', name: 'Project Charter', nodeType: 'Work Package', parentId: '1.1', order: 1 },
      { wbsId: '1.1.2', code: '1.1.2', name: 'Project Management Plan', nodeType: 'Work Package', parentId: '1.1', order: 2 },
      { wbsId: '1.1.3', code: '1.1.3', name: 'Project Monitoring', nodeType: 'Work Package', parentId: '1.1', order: 3 },

      { wbsId: '1.2', code: '1.2', name: 'Requirements Management', nodeType: 'Deliverable', parentId: '1.0', order: 2 },
      { wbsId: '1.2.1', code: '1.2.1', name: 'Requirements Gathering', nodeType: 'Work Package', parentId: '1.2', order: 1 },
      { wbsId: '1.2.2', code: '1.2.2', name: 'Requirements Analysis', nodeType: 'Work Package', parentId: '1.2', order: 2 },
      { wbsId: '1.2.3', code: '1.2.3', name: 'Requirements Approval', nodeType: 'Work Package', parentId: '1.2', order: 3 },

      { wbsId: '1.3', code: '1.3', name: 'System Design', nodeType: 'Deliverable', parentId: '1.0', order: 3 },
      { wbsId: '1.3.1', code: '1.3.1', name: 'Architecture Design', nodeType: 'Work Package', parentId: '1.3', order: 1 },
      { wbsId: '1.3.2', code: '1.3.2', name: 'Database Design', nodeType: 'Work Package', parentId: '1.3', order: 2 },
      { wbsId: '1.3.3', code: '1.3.3', name: 'UI/UX Design', nodeType: 'Work Package', parentId: '1.3', order: 3 },

      { wbsId: '1.4', code: '1.4', name: 'Core Development', nodeType: 'Deliverable', parentId: '1.0', order: 4 },
      { wbsId: '1.4.1', code: '1.4.1', name: 'Appointment Module', nodeType: 'Work Package', parentId: '1.4', order: 1 },
      { wbsId: '1.4.2', code: '1.4.2', name: 'Laboratory Module', nodeType: 'Work Package', parentId: '1.4', order: 2 },
      { wbsId: '1.4.3', code: '1.4.3', name: 'Doctor Schedule Module', nodeType: 'Work Package', parentId: '1.4', order: 3 },
      { wbsId: '1.4.4', code: '1.4.4', name: 'Online Consultation', nodeType: 'Work Package', parentId: '1.4', order: 4 },
      { wbsId: '1.4.5', code: '1.4.5', name: 'Billing Module', nodeType: 'Work Package', parentId: '1.4', order: 5 },

      { wbsId: '1.5', code: '1.5', name: 'Additional Approved Scope', nodeType: 'Deliverable', parentId: '1.0', order: 5 },
      { wbsId: '1.5.1', code: '1.5.1', name: 'AI Diagnosis', nodeType: 'Work Package', parentId: '1.5', order: 1 },
      { wbsId: '1.5.2', code: '1.5.2', name: 'Mobile Application', nodeType: 'Work Package', parentId: '1.5', order: 2 },

      { wbsId: '1.6', code: '1.6', name: 'Testing', nodeType: 'Deliverable', parentId: '1.0', order: 6 },
      { wbsId: '1.6.1', code: '1.6.1', name: 'Functional Testing', nodeType: 'Work Package', parentId: '1.6', order: 1 },
      { wbsId: '1.6.2', code: '1.6.2', name: 'Integration Testing', nodeType: 'Work Package', parentId: '1.6', order: 2 },
      { wbsId: '1.6.3', code: '1.6.3', name: 'System Testing', nodeType: 'Work Package', parentId: '1.6', order: 3 },

      { wbsId: '1.7', code: '1.7', name: 'Deployment & Closure', nodeType: 'Deliverable', parentId: '1.0', order: 7 },
      { wbsId: '1.7.1', code: '1.7.1', name: 'Deployment', nodeType: 'Work Package', parentId: '1.7', order: 1 },
      { wbsId: '1.7.2', code: '1.7.2', name: 'User Training', nodeType: 'Work Package', parentId: '1.7', order: 2 },
      { wbsId: '1.7.3', code: '1.7.3', name: 'Project Closure', nodeType: 'Work Package', parentId: '1.7', order: 3 }
    ];

    for (const wbs of wbsData) {
      await WBSNode.create({
        projectId: PROJECT_ID,
        ...wbs,
        estimatedCost: 200000,
        status: wbs.wbsId.startsWith('1.1') || wbs.wbsId.startsWith('1.2') || wbs.wbsId.startsWith('1.3') ? 'Completed' : 'In Progress'
      });
    }

    // 6. Activities & Dependencies (18 Activities)
    console.log('[Seed] Seeding 18 Activities and Dependencies...');
    const activitiesData = [
      { activityId: 'ACT-001', wbsId: '1.1.1', name: 'Project Initiation', duration: 3, assignedTo: 'PM-001', status: 'Completed', progress: 100 },
      { activityId: 'ACT-002', wbsId: '1.2.1', name: 'Requirements Gathering', duration: 7, assignedTo: 'PM-001', status: 'Completed', progress: 100 },
      { activityId: 'ACT-003', wbsId: '1.2.2', name: 'Requirements Analysis & Approval', duration: 5, assignedTo: 'PM-001', status: 'Completed', progress: 100 },
      { activityId: 'ACT-004', wbsId: '1.3.1', name: 'System Architecture Design', duration: 5, assignedTo: 'BE-001', status: 'Completed', progress: 100 },
      { activityId: 'ACT-005', wbsId: '1.3.2', name: 'Database Design', duration: 5, assignedTo: 'DB-001', status: 'Completed', progress: 100 },
      { activityId: 'ACT-006', wbsId: '1.3.3', name: 'UI/UX Design', duration: 7, assignedTo: 'FE-001', status: 'Completed', progress: 100 },
      { activityId: 'ACT-007', wbsId: '1.4.1', name: 'Appointment Module', duration: 10, assignedTo: 'BE-001', status: 'In Progress', progress: 85 },
      { activityId: 'ACT-008', wbsId: '1.4.2', name: 'Laboratory Module', duration: 8, assignedTo: 'BE-002', status: 'In Progress', progress: 75 },
      { activityId: 'ACT-009', wbsId: '1.4.3', name: 'Doctor Schedule Module', duration: 7, assignedTo: 'BE-002', status: 'In Progress', progress: 70 },
      { activityId: 'ACT-010', wbsId: '1.4.4', name: 'Online Consultation', duration: 10, assignedTo: 'BE-001', status: 'In Progress', progress: 60 },
      { activityId: 'ACT-011', wbsId: '1.4.5', name: 'Billing Module', duration: 8, assignedTo: 'BE-002', status: 'In Progress', progress: 50 },
      { activityId: 'ACT-012', wbsId: '1.4.1', name: 'Integration', duration: 7, assignedTo: 'BE-001', status: 'In Progress', progress: 15 },
      { activityId: 'ACT-013', wbsId: '1.5.1', name: 'AI Diagnosis Module', duration: 12, assignedTo: 'BE-001', status: 'Not Started', progress: 0 },
      { activityId: 'ACT-014', wbsId: '1.5.2', name: 'Mobile Application', duration: 15, assignedTo: 'FE-001', status: 'Not Started', progress: 0 },
      { activityId: 'ACT-015', wbsId: '1.6.3', name: 'System Testing', duration: 10, assignedTo: 'QA-001', status: 'Not Started', progress: 0 },
      { activityId: 'ACT-016', wbsId: '1.6.1', name: 'Bug Fixing', duration: 7, assignedTo: 'BE-002', status: 'Not Started', progress: 0 },
      { activityId: 'ACT-017', wbsId: '1.7.1', name: 'Deployment', duration: 3, assignedTo: 'PM-001', status: 'Not Started', progress: 0 },
      { activityId: 'ACT-018', wbsId: '1.7.3', name: 'Project Closure', duration: 2, assignedTo: 'PM-001', status: 'Not Started', progress: 0 }
    ];

    let runningDate = new Date('2026-10-27');
    for (const act of activitiesData) {
      const actStart = new Date(runningDate);
      const actEnd = new Date(runningDate);
      actEnd.setDate(actEnd.getDate() + act.duration);
      
      await Activity.create({
        projectId: PROJECT_ID,
        activityId: act.activityId,
        wbsId: act.wbsId,
        name: act.name,
        duration: act.duration,
        assignedResources: [act.assignedTo],
        status: act.status,
        progress: act.progress,
        startDate: actStart,
        endDate: actEnd,
        estimatedCost: act.duration * 50000,
        isCritical: ['ACT-001', 'ACT-002', 'ACT-003', 'ACT-004', 'ACT-007', 'ACT-012', 'ACT-013', 'ACT-014', 'ACT-015', 'ACT-017', 'ACT-018'].includes(act.activityId)
      });
      runningDate.setDate(runningDate.getDate() + 4);
    }

    // Dependencies
    const dependenciesData = [
      { dependencyId: 'DEP-001', predecessorActivity: 'ACT-001', successorActivity: 'ACT-002' },
      { dependencyId: 'DEP-002', predecessorActivity: 'ACT-002', successorActivity: 'ACT-003' },
      { dependencyId: 'DEP-003', predecessorActivity: 'ACT-003', successorActivity: 'ACT-004' },
      { dependencyId: 'DEP-004', predecessorActivity: 'ACT-003', successorActivity: 'ACT-005' },
      { dependencyId: 'DEP-005', predecessorActivity: 'ACT-003', successorActivity: 'ACT-006' },
      { dependencyId: 'DEP-006', predecessorActivity: 'ACT-004', successorActivity: 'ACT-007' },
      { dependencyId: 'DEP-007', predecessorActivity: 'ACT-005', successorActivity: 'ACT-007' },
      { dependencyId: 'DEP-008', predecessorActivity: 'ACT-006', successorActivity: 'ACT-007' },
      { dependencyId: 'DEP-009', predecessorActivity: 'ACT-004', successorActivity: 'ACT-008' },
      { dependencyId: 'DEP-010', predecessorActivity: 'ACT-005', successorActivity: 'ACT-008' },
      { dependencyId: 'DEP-011', predecessorActivity: 'ACT-004', successorActivity: 'ACT-009' },
      { dependencyId: 'DEP-012', predecessorActivity: 'ACT-005', successorActivity: 'ACT-009' },
      { dependencyId: 'DEP-013', predecessorActivity: 'ACT-004', successorActivity: 'ACT-010' },
      { dependencyId: 'DEP-014', predecessorActivity: 'ACT-005', successorActivity: 'ACT-010' },
      { dependencyId: 'DEP-015', predecessorActivity: 'ACT-006', successorActivity: 'ACT-010' },
      { dependencyId: 'DEP-016', predecessorActivity: 'ACT-004', successorActivity: 'ACT-011' },
      { dependencyId: 'DEP-017', predecessorActivity: 'ACT-005', successorActivity: 'ACT-011' },
      { dependencyId: 'DEP-018', predecessorActivity: 'ACT-007', successorActivity: 'ACT-012' },
      { dependencyId: 'DEP-019', predecessorActivity: 'ACT-012', successorActivity: 'ACT-013' },
      { dependencyId: 'DEP-020', predecessorActivity: 'ACT-012', successorActivity: 'ACT-014' },
      { dependencyId: 'DEP-021', predecessorActivity: 'ACT-013', successorActivity: 'ACT-015' },
      { dependencyId: 'DEP-022', predecessorActivity: 'ACT-014', successorActivity: 'ACT-015' },
      { dependencyId: 'DEP-023', predecessorActivity: 'ACT-015', successorActivity: 'ACT-016' },
      { dependencyId: 'DEP-024', predecessorActivity: 'ACT-016', successorActivity: 'ACT-017' },
      { dependencyId: 'DEP-025', predecessorActivity: 'ACT-017', successorActivity: 'ACT-018' }
    ];

    for (const dep of dependenciesData) {
      await Dependency.create({
        projectId: PROJECT_ID,
        dependencyId: dep.dependencyId,
        predecessorActivity: dep.predecessorActivity,
        successorActivity: dep.successorActivity,
        dependencyType: 'FS',
        lag: 0
      });
    }

    // 7. Cost Management & Management Plan
    console.log('[Seed] Seeding Management Plan & Cost Allocations...');
    await ManagementPlan.create({
      projectId: PROJECT_ID,
      scopePlan: {
        wbsDictionarySummary: 'Hierarchical decomposition across 7 major work branches including additional approved scope 1.5.',
        scopeVerificationProcess: 'Formal inspection and acceptance testing against REQ-001 through REQ-011.',
        changeManagementProcess: 'Formal Change Control Board (CCB) evaluation of cost, schedule and scope impacts.'
      },
      schedulePlan: {
        methodology: 'Critical Path Method (CPM)',
        scheduleBaseline: '16 weeks initially; extended to 19 weeks via approved CR-001.',
        updateFrequency: 'Weekly on Mondays'
      },
      costPlan: {
        budgetAllocation: [
          { category: 'Project Management', allocatedAmount: 500000, description: 'PM-001 oversight and governance' },
          { category: 'Requirements & Analysis', allocatedAmount: 450000, description: 'Stakeholder interviews, SRS, traceability' },
          { category: 'System Design', allocatedAmount: 500000, description: 'Architecture, DB schemas, Figma design system' },
          { category: 'Core Development', allocatedAmount: 1800000, description: 'Appointments, labs, doctors, consultations, billing' },
          { category: 'Database', allocatedAmount: 400000, description: 'Cluster setup, encryption, replication' },
          { category: 'Testing & QA', allocatedAmount: 500000, description: 'Test cases, automated tests, defect triage' },
          { category: 'Deployment', allocatedAmount: 250000, description: 'Hospital server environments, CI/CD' },
          { category: 'Documentation & Training', allocatedAmount: 200000, description: 'Staff user manuals, onsite training' },
          { category: 'Contingency', allocatedAmount: 400000, description: 'Risk and unforeseen adjustments' }
        ],
        totalCost: 5000000,
        contingencyReserve: 400000,
        costControlTechnique: 'Earned Value Management (EVM)'
      },
      qualityPlan: {
        qualityStandards: ['ISO/IEC 25010', 'HIPAA Healthcare Security Guidelines'],
        qualityControlActivities: [
          'Code review approvals by senior backend/frontend leads',
          'Automated unit testing with minimum 80% coverage',
          'Defect severity triage within 24 hours of discovery'
        ],
        acceptanceCriteria: [
          'Zero critical severity defects in production',
          'Appointment booking latency under 1.5 seconds',
          '100% data encryption in-transit and at-rest'
        ]
      }
    });

    // 8. EVM Sample Data
    console.log('[Seed] Seeding EVM Metrics Record...');
    await EarnedValue.create({
      projectId: PROJECT_ID,
      pv: 2500000,
      ev: 2100000,
      ac: 2700000,
      cpi: 0.78,
      spi: 0.84,
      costVariance: -600000,
      scheduleVariance: -400000,
      costStatus: 'Over Budget',
      scheduleStatus: 'Behind Schedule',
      warnings: [
        '⚠️ Cost Overrun: CPI = 0.78 (< 1.0 indicates project cost exceeds planned value for work delivered)',
        '⚠️ Behind Schedule: SPI = 0.84 (< 1.0 indicates progress is lagging behind the schedule baseline)'
      ],
      calculatedAt: new Date()
    });

    // 9. Project Status Record
    console.log('[Seed] Seeding Project Status Record...');
    await ProjectStatus.create({
      projectId: PROJECT_ID,
      progress: 58,
      currentPhase: 'Core Development & Integration',
      statusSummary: '⚠️ Project is over budget (CPI 0.78) and behind schedule (SPI 0.84). Approved change request CR-001 increased scope and budget to PKR 5,800,000.',
      updatedBy: 'Project Manager',
      lastUpdated: new Date(),
      responsibilities: [
        { person: 'Project Manager (PM-001)', role: 'Project Manager', responsibility: 'Overall Governance, Schedule Tracking & Stakeholder Alignment', startDate: new Date('2026-10-27'), endDate: revisedDeadline, status: 'In Progress' },
        { person: 'Backend Lead (BE-001)', role: 'Backend Developer', responsibility: 'Architecture, Appointment & Consultation Modules, AI Module', startDate: new Date('2026-11-10'), endDate: revisedDeadline, status: 'In Progress' },
        { person: 'Backend Developer (BE-002)', role: 'Backend Developer', responsibility: 'Laboratory & Billing Modules, Integration', startDate: new Date('2026-11-15'), endDate: revisedDeadline, status: 'In Progress' },
        { person: 'Frontend Lead (FE-001)', role: 'Frontend Developer', responsibility: 'UI/UX Design, Appointment & Doctor Schedule UI, Mobile App', startDate: new Date('2026-11-10'), endDate: revisedDeadline, status: 'In Progress' },
        { person: 'Frontend Developer (FE-002)', role: 'Frontend Developer', responsibility: 'Laboratory & Billing UI, Mobile App Support', startDate: new Date('2026-11-15'), endDate: revisedDeadline, status: 'In Progress' },
        { person: 'Database Developer (DB-001)', role: 'Database Developer', responsibility: 'Schema Design, High Availability Cluster, Backups', startDate: new Date('2026-11-05'), endDate: revisedDeadline, status: 'In Progress' },
        { person: 'QA Engineer (QA-001)', role: 'Quality Assurance', responsibility: 'Defect Tracking, Test Automation, Acceptance Verification', startDate: new Date('2026-11-20'), endDate: revisedDeadline, status: 'In Progress' }
      ]
    });

    // 10. Defects (5 records)
    console.log('[Seed] Seeding 5 Defects...');
    const defectsData = [
      { defectId: 'DEF-001', title: 'Appointment conflicts occur when two patients book the same slot', description: 'Concurrent booking requests bypass validation and create duplicate slots.', severity: 'Critical', priority: 'Critical', assignedTo: 'BE-001', status: 'Open', activityId: 'ACT-007' },
      { defectId: 'DEF-002', title: 'Patient records are not correctly updated', description: 'Laboratory result updates fail to reflect in medical history view.', severity: 'Critical', priority: 'Critical', assignedTo: 'BE-002', status: 'In Progress', activityId: 'ACT-008' },
      { defectId: 'DEF-003', title: 'Incorrect appointment date validation', description: 'System allows dates in past during weekend consultation schedules.', severity: 'High', priority: 'High', assignedTo: 'BE-001', status: 'Open', activityId: 'ACT-007' },
      { defectId: 'DEF-004', title: 'Patient search returns incomplete records', description: 'Special characters in patient national ID cause query truncation.', severity: 'High', priority: 'Medium', assignedTo: 'BE-002', status: 'Resolved', activityId: 'ACT-008' },
      { defectId: 'DEF-005', title: 'Billing amount calculation error', description: 'Tax percentage applied twice on lab + consultation combo packages.', severity: 'Medium', priority: 'Medium', assignedTo: 'BE-002', status: 'Open', activityId: 'ACT-011' }
    ];

    for (const d of defectsData) {
      await Defect.create({
        projectId: PROJECT_ID,
        ...d,
        reportedBy: 'QA-001',
        reportedDate: new Date('2026-11-20')
      });
    }

    // 11. Quality Checklist (10 items)
    console.log('[Seed] Seeding 10 Quality Checklist Items...');
    const checklistItems = [
      { itemText: 'Requirements approved', isChecked: true },
      { itemText: 'Database design reviewed', isChecked: true },
      { itemText: 'UI design reviewed', isChecked: true },
      { itemText: 'Appointment module tested', isChecked: false },
      { itemText: 'Patient record management tested', isChecked: false },
      { itemText: 'Laboratory module tested', isChecked: true },
      { itemText: 'Doctor schedule tested', isChecked: true },
      { itemText: 'Billing tested', isChecked: true },
      { itemText: 'Integration testing completed', isChecked: false },
      { itemText: 'Security testing completed', isChecked: false }
    ];

    await QualityChecklist.create({
      checklistId: 'QC-001',
      projectId: PROJECT_ID,
      deliverable: 'Smart Healthcare System Quality Verification',
      inspector: 'QA-001',
      inspectionDate: new Date('2026-11-25'),
      items: checklistItems,
      result: 'FAIL',
      notes: 'Critical failures identified in appointment scheduling and patient records.'
    });

    // 12. Risks (8 risks)
    console.log('[Seed] Seeding 8 Risks...');
    const risksData = [
      { riskId: 'R-001', title: 'Scope creep', description: 'Uncontrolled scope additions beyond agreed baseline.', likelihood: 5, impact: 5, riskScore: 25, riskLevel: 'Critical', owner: 'Project Manager', responseStrategy: 'Mitigate', mitigationPlan: 'Formal change request and approval process via CCB.' },
      { riskId: 'R-002', title: 'Development delay', description: 'Schedule slip due to complex multi-hospital dependencies.', likelihood: 5, impact: 5, riskScore: 25, riskLevel: 'Critical', owner: 'Project Manager', responseStrategy: 'Mitigate', mitigationPlan: 'Reallocate resources and prioritize critical path activities.' },
      { riskId: 'R-003', title: 'Budget overrun', description: 'Cost exceeds baseline due to delays and scope changes.', likelihood: 3, impact: 5, riskScore: 15, riskLevel: 'High', owner: 'Project Manager', responseStrategy: 'Mitigate', mitigationPlan: 'Monitor CPI weekly and enforce strict approval for contingency use.' },
      { riskId: 'R-004', title: 'Critical software defects', description: 'High-severity bugs disrupting patient scheduling and medical records.', likelihood: 5, impact: 5, riskScore: 25, riskLevel: 'Critical', owner: 'QA-001', responseStrategy: 'Mitigate', mitigationPlan: 'Additional regression testing and dedicated bug-fixing sprints.' },
      { riskId: 'R-005', title: 'Hospital requirement changes', description: 'Hospital branch administrators requesting conflicting features.', likelihood: 5, impact: 3, riskScore: 15, riskLevel: 'High', owner: 'Project Manager', responseStrategy: 'Mitigate', mitigationPlan: 'Route all change proposals to Change Control Board.' },
      { riskId: 'R-006', title: 'Database failure/data loss', description: 'High concurrency queries impacting multi-hospital database performance.', likelihood: 3, impact: 5, riskScore: 15, riskLevel: 'High', owner: 'DB-001', responseStrategy: 'Mitigate', mitigationPlan: 'Automated daily database backups and replica failover.' },
      { riskId: 'R-007', title: 'Integration problems', description: 'Incompatibilities between laboratory API and billing module.', likelihood: 3, impact: 5, riskScore: 15, riskLevel: 'High', owner: 'BE-001', responseStrategy: 'Mitigate', mitigationPlan: 'Continuous integration testing and standardized REST APIs.' },
      { riskId: 'R-008', title: 'AI module development difficulty', description: 'Machine learning preliminary diagnosis accuracy below diagnostic thresholds.', likelihood: 3, impact: 5, riskScore: 15, riskLevel: 'High', owner: 'BE-001', responseStrategy: 'Mitigate', mitigationPlan: 'Allocate experienced developer and additional time for model tuning.' }
    ];

    for (const r of risksData) {
      await Risk.create({
        projectId: PROJECT_ID,
        ...r,
        preventiveAction: r.mitigationPlan,
        correctiveAction: r.mitigationPlan,
        status: 'Identified'
      });
    }

    // 13. Milestones (9 milestones)
    console.log('[Seed] Seeding 9 Milestones...');
    const milestonesData = [
      { milestoneId: 'MS-001', title: 'Project Charter Approved', dueDate: new Date('2026-11-03'), status: 'Completed', progress: 100, description: 'Week 1: Formal charter signed off by Hospital Management.' },
      { milestoneId: 'MS-002', title: 'Requirements Approved', dueDate: new Date('2026-11-17'), status: 'Completed', progress: 100, description: 'Week 3: Baseline requirements approved.' },
      { milestoneId: 'MS-003', title: 'System Design Completed', dueDate: new Date('2026-12-01'), status: 'Completed', progress: 100, description: 'Week 5: UI/UX, DB, and architecture designs reviewed.' },
      { milestoneId: 'MS-004', title: 'Core Development Completed', dueDate: new Date('2027-01-12'), status: 'In Progress', progress: 65, description: 'Week 11: Appointments, Labs, Consultations, and Billing modules coded.' },
      { milestoneId: 'MS-005', title: 'Integration Completed', dueDate: new Date('2027-01-26'), status: 'Pending', progress: 20, description: 'Week 13: End-to-end multi-hospital integration.' },
      { milestoneId: 'MS-006', title: 'AI & Mobile Development Completed', dueDate: new Date('2027-02-16'), status: 'Pending', progress: 0, description: 'Week 16: Additional approved scope CR-001 completed.' },
      { milestoneId: 'MS-007', title: 'System Testing Completed', dueDate: new Date('2027-03-02'), status: 'Pending', progress: 0, description: 'Week 18: Full system and user acceptance testing.' },
      { milestoneId: 'MS-008', title: 'Deployment', dueDate: new Date('2027-03-09'), status: 'Pending', progress: 0, description: 'Week 19: Production deployment across 5 hospitals.' },
      { milestoneId: 'MS-009', title: 'Project Closure', dueDate: new Date('2027-03-09'), status: 'Pending', progress: 0, description: 'Week 19: Lessons learned, financial closure, formal handover.' }
    ];

    for (const m of milestonesData) {
      await Milestone.create({
        projectId: PROJECT_ID,
        ...m,
        responsiblePerson: 'PM-001'
      });
    }

    console.log('[Seed] Successfully seeded all Smart Healthcare Project Management data into MongoDB!');
    console.log('Project ID: SHP-001');
    console.log('Approved Budget: PKR 5,000,000 | Revised Budget: PKR 5,800,000');
    console.log('Original Deadline: 16/02/2027 | Revised Deadline: 09/03/2027');
    console.log('EVM: PV=PKR 2.5M, EV=PKR 2.1M, AC=PKR 2.7M | CPI=0.78 (Over budget), SPI=0.84 (Behind schedule)');
    
    await mongoose.disconnect();
    console.log('[Seed] Database disconnected cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error] Failed to seed healthcare data:', err);
    process.exit(1);
  }
}

seed();
