const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config/env');
const Project = require('../models/Project');
const ProjectCharter = require('../models/ProjectCharter');
const ManagementPlan = require('../models/ManagementPlan');
const Milestone = require('../models/Milestone');
const ProjectStatus = require('../models/ProjectStatus');
const ProjectClosure = require('../models/ProjectClosure');
const Stakeholder = require('../models/Stakeholder');

const seedHospitalManagementSystem = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await mongoose.connect(MONGODB_URI);

    console.log('[Seed] Cleaning up existing collections...');
    await Promise.all([
      Project.deleteMany({}),
      ProjectCharter.deleteMany({}),
      ManagementPlan.deleteMany({}),
      Milestone.deleteMany({}),
      ProjectStatus.deleteMany({}),
      ProjectClosure.deleteMany({}),
      Stakeholder.deleteMany({})
    ]);

    console.log('[Seed] Inserting PRJ-001: Hospital Management System...');

    // 1. Project
    const project = await Project.create({
      projectId: 'PRJ-001',
      projectName: 'Hospital Management System',
      description: 'Web based integrated hospital management system streamlining patient records, doctor scheduling, and diagnostics workflow.',
      projectManager: 'Muhammad Zaid',
      startDate: new Date('2026-10-01'),
      deadline: new Date('2027-03-30'),
      approvedBudget: 500000,
      status: 'In Progress'
    });

    // 2. Project Charter
    await ProjectCharter.create({
      projectId: 'PRJ-001',
      objectives: [
        'Manage patient registration, admissions, and electronic health records',
        'Manage doctor scheduling, specialties, and on-call assignments',
        'Streamline appointment booking with real-time slot checking',
        'Generate clinical and administrative operational reports'
      ],
      stakeholders: [
        {
          stakeholderId: 'SH-001',
          name: 'Dr. Ahmed',
          role: 'Project Sponsor',
          organization: 'Dental Clinic / Hospital Board',
          email: 'ahmed@hospital.org',
          responsibility: 'Executive sponsor and clinical requirements approval',
          influenceLevel: 'High'
        },
        {
          stakeholderId: 'SH-002',
          name: 'Muhammad Zaid',
          role: 'Project Manager',
          organization: 'Development Team',
          email: 'zaid@project.org',
          responsibility: 'End-to-end project management, delivery & stakeholder communication',
          influenceLevel: 'High'
        },
        {
          stakeholderId: 'SH-003',
          name: 'Development Team',
          role: 'Developer',
          organization: 'Software Solutions Ltd.',
          email: 'devs@solutions.org',
          responsibility: 'Core software design, full-stack development, and test automation',
          influenceLevel: 'Medium'
        },
        {
          stakeholderId: 'SH-004',
          name: 'Sara Khan',
          role: 'UI Designer',
          organization: 'Design Studio',
          email: 'sara@design.org',
          responsibility: 'Patient portal and clinical dashboard design system',
          influenceLevel: 'Medium'
        },
        {
          stakeholderId: 'SH-005',
          name: 'Ali Raza',
          role: 'Lead Tester',
          organization: 'QA Specialists',
          email: 'ali@qa.org',
          responsibility: 'Security testing, HIPAA compliance verification & functional QA',
          influenceLevel: 'Medium'
        }
      ],
      inScope: [
        'Patient management & Electronic Medical Records (EMR)',
        'Doctor management & specialty schedules',
        'Appointment booking & automated SMS reminders',
        'Pharmacy inventory and prescription management',
        'Role-based security & administrative reporting dashboard'
      ],
      outOfScope: [
        'Custom hospital hardware sensor IoT integration (Phase 2)',
        'Third-party international payment gateway integrations',
        'Ambulance GPS fleet dispatch tracking'
      ],
      assumptions: [
        'High-speed internet and modern web browsers available across clinic branches',
        'Medical staff receives 1 week orientation training prior to go-live'
      ],
      constraints: [
        'Budget capped strictly at Rs. 500,000 for Module 1 Initiation and core delivery',
        'Deployment deadline on or before 30 March 2027'
      ],
      approvedBudget: 500000,
      deadline: new Date('2027-03-30'),
      projectManager: 'Muhammad Zaid',
      approvalStatus: 'Approved',
      approvalDate: new Date('2026-10-05'),
      approvedBy: 'Dr. Ahmed (Project Sponsor)'
    });

    // 3. Management Plan
    await ManagementPlan.create({
      projectId: 'PRJ-001',
      scopePlan: {
        projectScopeDefinition: 'Full-stack MERN hospital management web platform supporting role-based staff access and clinical workflows.',
        deliverables: [
          'Requirements Analysis & System Architecture Specification',
          'Interactive UI/UX Design Prototypes',
          'MERN Stack Core Portal & API Suite',
          'Automated Test Suite & HIPAA Security Audit Report',
          'Staff Training Manual & Cloud Deployment Runbook'
        ],
        inclusions: [
          'Full-featured patient portal',
          'Doctor appointment queue management',
          'Clinical consultation summary notes'
        ],
        exclusions: [
          'Direct medical machinery driver development',
          'Multi-country localized taxation engines'
        ],
        scopeApprovalProcess: 'Bi-weekly stakeholder reviews with formal sign-off from Dr. Ahmed and Muhammad Zaid.'
      },
      schedulePlan: {
        developmentStart: new Date('2026-10-10'),
        developmentEnd: new Date('2027-02-15'),
        testingStart: new Date('2027-02-16'),
        testingEnd: new Date('2027-03-15'),
        deploymentDate: new Date('2027-03-30'),
        scheduleNotes: 'Critical path depends on completion of clinical workflow sign-offs by Nov 2026.'
      },
      costPlan: {
        developmentCost: 320000,
        hardwareCost: 45000,
        softwareCost: 55000,
        otherCost: 30000,
        contingency: 50000,
        totalCost: 500000,
        costNotes: 'Contingency reserve of 10% kept for unforeseen third-party API licensing.'
      },
      qualityPlan: {
        qualityStandards: [
          'ISO 9001 Software Quality Guidelines',
          'Clean Architecture & SOLID Design Principles',
          'OWASP Top 10 Web Application Security Safeguards',
          'HIPAA / Patient Data Privacy Compliance'
        ],
        testingStrategy: 'Continuous Integration testing pipeline with Jest unit tests, Supertest API tests, and Playwright end-to-end validation.',
        codeReviewProcess: 'Mandatory peer review on GitHub pull requests with at least 1 approval and passing lint checks before merge.',
        acceptanceCriteria: [
          'Appointment booking latency under 200ms under 500 concurrent users',
          'Zero critical or high security vulnerabilities in static analysis',
          '100% sign-off on user acceptance testing scenarios'
        ],
        qualityMetrics: [
          'Test code coverage >= 85%',
          'Bug resolution turnaround < 48 hours for high-priority defects',
          'Platform uptime SLA >= 99.9%'
        ]
      }
    });

    // 4. Milestones
    await Milestone.insertMany([
      {
        milestoneId: 'M-001',
        projectId: 'PRJ-001',
        title: 'Requirements Completed & Signed Off',
        description: 'Comprehensive business requirement analysis and user story workshops completed.',
        dueDate: new Date('2026-11-10'),
        responsiblePerson: 'Muhammad Zaid',
        status: 'Completed',
        progress: 100,
        completedDate: new Date('2026-11-08')
      },
      {
        milestoneId: 'M-002',
        projectId: 'PRJ-001',
        title: 'System Design & UI Prototyping',
        description: 'Database ERD, high-fidelity Figma design system, and API contract specifications.',
        dueDate: new Date('2026-11-25'),
        responsiblePerson: 'Sara Khan',
        status: 'Completed',
        progress: 100,
        completedDate: new Date('2026-11-24')
      },
      {
        milestoneId: 'M-003',
        projectId: 'PRJ-001',
        title: 'Core MERN Backend & Doctor Module',
        description: 'Express REST API, patient and doctor schemas, authentication, and slot allocation engine.',
        dueDate: new Date('2026-12-30'),
        responsiblePerson: 'Development Team',
        status: 'In Progress',
        progress: 75
      },
      {
        milestoneId: 'M-004',
        projectId: 'PRJ-001',
        title: 'Appointment Management & Patient Portal',
        description: 'Frontend integration with Vite React, calendar views, and booking workflows.',
        dueDate: new Date('2027-01-31'),
        responsiblePerson: 'Development Team',
        status: 'In Progress',
        progress: 55
      },
      {
        milestoneId: 'M-005',
        projectId: 'PRJ-001',
        title: 'Quality Assurance & Security Audit',
        description: 'End-to-end regression testing, penetration testing, and doctor staff UAT.',
        dueDate: new Date('2027-03-10'),
        responsiblePerson: 'Ali Raza',
        status: 'Pending',
        progress: 15
      },
      {
        milestoneId: 'M-006',
        projectId: 'PRJ-001',
        title: 'Production Staging & Hospital Go-Live',
        description: 'Data migration, clinic staff training, and cloud deployment.',
        dueDate: new Date('2027-03-30'),
        responsiblePerson: 'Muhammad Zaid',
        status: 'Pending',
        progress: 0
      }
    ]);

    // 5. Project Status
    await ProjectStatus.create({
      projectId: 'PRJ-001',
      overallStatus: 'In Progress',
      progress: 72,
      currentPhase: 'Execution',
      currentIssues: [
        'SMS gateway provider experiencing verification delays for sandbox testing'
      ],
      achievements: [
        'Charter formally approved by Dr. Ahmed on Oct 5',
        'Requirements and UI prototype phases successfully closed ahead of schedule',
        'Database schemas and integration API scaffolding operational'
      ],
      risks: [
        'Delay in final hardware procurement for clinic reception desktops (mitigated by web browser compatibility)'
      ],
      nextActions: [
        'Finalize appointment booking conflict resolution rules',
        'Conduct mid-sprint review with clinical nursing supervisor'
      ],
      responsibilities: [
        {
          person: 'Muhammad Zaid',
          role: 'Project Manager',
          responsibility: 'Project planning, charter, and stakeholder coordination',
          startDate: new Date('2026-10-01'),
          endDate: new Date('2027-03-30'),
          status: 'In Progress'
        },
        {
          person: 'Development Team',
          role: 'Developer',
          responsibility: 'Full-stack MERN development & database architecture',
          startDate: new Date('2026-10-15'),
          endDate: new Date('2027-02-28'),
          status: 'In Progress'
        },
        {
          person: 'Sara Khan',
          role: 'UI Designer',
          responsibility: 'UI design and clinical workflow user experience',
          startDate: new Date('2026-10-05'),
          endDate: new Date('2026-11-25'),
          status: 'Completed'
        },
        {
          person: 'Ali Raza',
          role: 'Tester',
          responsibility: 'System testing, test cases, and quality validation',
          startDate: new Date('2026-12-01'),
          endDate: new Date('2027-03-20'),
          status: 'Pending'
        }
      ],
      updatedBy: 'Muhammad Zaid'
    });

    // 6. Project Closure (Draft preparation)
    await ProjectClosure.create({
      projectId: 'PRJ-001',
      closureDate: new Date('2027-03-30'),
      finalStatus: 'Completed',
      finalProgress: 72,
      finalBudget: 485000,
      deliverablesCompleted: [
        'Project Charter & Stakeholder Matrix',
        'Comprehensive Project Management Plan',
        'UI Design Prototypes & Design Tokens',
        'Module 1 Initiation Architecture'
      ],
      pendingItems: [
        'Final production deployment on cloud infrastructure',
        'Hospital staff end-user acceptance certificate'
      ],
      lessonsLearned: [
        'Requirements should be finalized earlier with clinical department heads.',
        'Testing should start incrementally alongside feature development.',
        'Client feedback should be collected weekly through rapid interactive demo builds.'
      ],
      closureNotes: 'Project on track for scheduled completion. Ready for smooth handover into Module 2.',
      approvedBy: 'Dr. Ahmed',
      approvalStatus: 'Pending'
    });

    console.log('[Seed] Database successfully seeded with Hospital Management System (PRJ-001)!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedHospitalManagementSystem();
