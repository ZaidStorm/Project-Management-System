const ManagementPlan = require('../models/ManagementPlan');
const Project = require('../models/Project');

const getManagementPlanByProjectId = async (projectId) => {
  const pid = projectId.toUpperCase();
  let plan = await ManagementPlan.findOne({ projectId: pid });
  if (!plan) {
    const project = await Project.findOne({ projectId: pid });
    if (project) {
      plan = await ManagementPlan.create({
        projectId: pid,
        scopePlan: {
          projectScopeDefinition: project.description || '',
          deliverables: [],
          inclusions: [],
          exclusions: [],
          scopeApprovalProcess: ''
        },
        schedulePlan: {
          developmentStart: project.startDate,
          developmentEnd: project.deadline
        },
        costPlan: {
          developmentCost: project.approvedBudget,
          totalCost: project.approvedBudget
        }
      });
    }
  }
  return plan;
};

const upsertManagementPlan = async (projectId, planData) => {
  const pid = projectId.toUpperCase();

  // Calculate totalCost if costPlan exists
  if (planData.costPlan) {
    const dev = Number(planData.costPlan.developmentCost) || 0;
    const hw = Number(planData.costPlan.hardwareCost) || 0;
    const sw = Number(planData.costPlan.softwareCost) || 0;
    const other = Number(planData.costPlan.otherCost) || 0;
    const contingency = Number(planData.costPlan.contingency) || 0;
    planData.costPlan.totalCost = dev + hw + sw + other + contingency;
  }

  const plan = await ManagementPlan.findOneAndUpdate(
    { projectId: pid },
    { ...planData, projectId: pid },
    { new: true, upsert: true, runValidators: true }
  );

  return plan;
};

module.exports = {
  getManagementPlanByProjectId,
  upsertManagementPlan
};
