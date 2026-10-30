const Project = require('../models/Project');
const ProjectCharter = require('../models/ProjectCharter');
const ManagementPlan = require('../models/ManagementPlan');
const ProjectStatus = require('../models/ProjectStatus');
const Milestone = require('../models/Milestone');
const ProjectClosure = require('../models/ProjectClosure');
const generateProjectId = require('../utils/generateProjectId');

const getAllProjects = async () => {
  return await Project.find().sort({ createdAt: -1 });
};

const getProjectById = async (idOrProjectId) => {
  let project = await Project.findOne({ projectId: idOrProjectId.toUpperCase() });
  if (!project && idOrProjectId.match(/^[0-9a-fA-F]{24}$/)) {
    project = await Project.findById(idOrProjectId);
  }
  return project;
};

const createProject = async (projectData) => {
  if (!projectData.projectId) {
    projectData.projectId = await generateProjectId();
  } else {
    projectData.projectId = projectData.projectId.toUpperCase();
  }

  const project = await Project.create(projectData);

  // Initialize companion documents for Module 1 Initiation
  await ProjectCharter.create({
    projectId: project.projectId,
    approvedBudget: project.approvedBudget,
    deadline: project.deadline,
    projectManager: project.projectManager,
    approvalStatus: 'Draft'
  });

  await ManagementPlan.create({
    projectId: project.projectId,
    scopePlan: {
      projectScopeDefinition: project.description || '',
      deliverables: [],
      inclusions: [],
      exclusions: [],
      scopeApprovalProcess: 'Review and sign-off by Project Sponsor and Manager'
    },
    schedulePlan: {
      developmentStart: project.startDate,
      developmentEnd: project.deadline
    },
    costPlan: {
      developmentCost: project.approvedBudget,
      hardwareCost: 0,
      softwareCost: 0,
      otherCost: 0,
      contingency: 0,
      totalCost: project.approvedBudget
    },
    qualityPlan: {
      qualityStandards: ['ISO 9001', 'Clean Code Principles'],
      testingStrategy: 'Unit, Integration, and User Acceptance Testing'
    }
  });

  await ProjectStatus.create({
    projectId: project.projectId,
    overallStatus: project.status || 'Planning',
    progress: 0,
    currentPhase: 'Initiation',
    currentIssues: [],
    achievements: ['Project Created and Initiated'],
    risks: [],
    nextActions: ['Finalize and approve Project Charter'],
    responsibilities: [
      {
        person: project.projectManager,
        role: 'Project Manager',
        responsibility: 'Project initiation, planning, and stakeholder alignment',
        startDate: project.startDate,
        endDate: project.deadline,
        status: 'In Progress'
      }
    ],
    updatedBy: project.projectManager
  });

  return project;
};

const updateProject = async (idOrProjectId, updateData) => {
  let project = await getProjectById(idOrProjectId);
  if (!project) return null;

  Object.assign(project, updateData);
  await project.save();

  // If status changed, synchronize with ProjectStatus
  if (updateData.status) {
    await ProjectStatus.findOneAndUpdate(
      { projectId: project.projectId },
      { overallStatus: updateData.status }
    );
  }

  return project;
};

const deleteProject = async (idOrProjectId) => {
  const project = await getProjectById(idOrProjectId);
  if (!project) return null;

  const { projectId } = project;
  // Cascading cleanup across all collections
  await Promise.all([
    Project.deleteOne({ projectId }),
    ProjectCharter.deleteMany({ projectId }),
    ManagementPlan.deleteMany({ projectId }),
    Milestone.deleteMany({ projectId }),
    ProjectStatus.deleteMany({ projectId }),
    ProjectClosure.deleteMany({ projectId })
  ]);

  return project;
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
