const Project = require('../models/Project');
const ProjectCharter = require('../models/ProjectCharter');
const ManagementPlan = require('../models/ManagementPlan');
const Requirement = require('../models/Requirement');
const WBSNode = require('../models/WBSNode');
const ChangeRequest = require('../models/ChangeRequest');
const Activity = require('../models/Activity');
const Resource = require('../models/Resource');
const Dependency = require('../models/Dependency');
const Expense = require('../models/Expense');
const Defect = require('../models/Defect');
const Risk = require('../models/Risk');
const ProjectStatus = require('../models/ProjectStatus');
const ProjectClosure = require('../models/ProjectClosure');
const { calculateEVM } = require('./costService');
const { detectDelays } = require('./scheduleService');

const getIntegratedPerformance = async (projectId) => {
  const pid = projectId.toUpperCase();

  const [
    project,
    statusDoc,
    evm,
    scheduleData,
    requirements,
    wbsNodes,
    changeRequests,
    defects,
    risks
  ] = await Promise.all([
    Project.findOne({ projectId: pid }).lean(),
    ProjectStatus.findOne({ projectId: pid }).lean(),
    calculateEVM(pid),
    detectDelays(pid),
    Requirement.find({ projectId: pid }).lean(),
    WBSNode.find({ projectId: pid }).lean(),
    ChangeRequest.find({ projectId: pid }).lean(),
    Defect.find({ projectId: pid }).lean(),
    Risk.find({ projectId: pid }).lean()
  ]);

  const approvedRequirements = requirements.filter((r) => r.approvalStatus === 'Approved');
  const pendingRequirements = requirements.filter((r) => r.approvalStatus !== 'Approved');

  const criticalDefects = defects.filter((d) => d.severity === 'Critical' && d.status !== 'Closed').length;
  const criticalRisks = risks.filter((r) => r.riskLevel === 'Critical' && r.status !== 'Closed').length;
  const pendingChanges = changeRequests.filter((c) => c.approvalStatus === 'Pending').length;
  const delayedActivitiesCount = scheduleData?.delays?.length || 0;

  // Compile critical issues list
  const criticalIssues = [];
  if (criticalDefects > 0) criticalIssues.push(`🔴 ${criticalDefects} Critical Defect(s) active`);
  if (criticalRisks > 0) criticalIssues.push(`🔴 ${criticalRisks} Critical Risk(s) unmitigated`);
  if (pendingChanges > 0) criticalIssues.push(`🟡 ${pendingChanges} Pending Change Request(s) awaiting CCB review`);
  if (delayedActivitiesCount > 0) criticalIssues.push(`🟡 ${delayedActivitiesCount} Delayed / Overdue Activity(ies)`);
  if (evm?.cpi < 0.9) criticalIssues.push(`⚠ Significant Cost Overrun (CPI: ${evm.cpi})`);
  if (evm?.spi < 0.9) criticalIssues.push(`⚠ Significant Schedule Delay (SPI: ${evm.spi})`);

  return {
    project,
    overallProgress: statusDoc?.progress || 0,
    scheduleStatus: evm?.scheduleStatus || 'On Schedule',
    budgetStatus: evm?.costStatus || 'On Budget',
    metrics: {
      activitiesCount: scheduleData?.totalActivities || 0,
      delayedActivities: delayedActivitiesCount,
      changeRequestsCount: changeRequests.length,
      pendingChanges,
      defectsCount: defects.length,
      criticalDefects,
      requirementsCount: requirements.length,
      approvedRequirementsCount: approvedRequirements.length,
      pendingRequirementsCount: pendingRequirements.length,
      wbsNodesCount: wbsNodes.length,
      risksCount: risks.length,
      criticalRisks
    },
    evm: evm || {
      pv: 0,
      ev: 0,
      ac: 0,
      cpi: 1.0,
      spi: 1.0,
      costStatus: 'On Budget',
      scheduleStatus: 'On Schedule'
    },
    criticalIssues
  };
};

const getCompleteProjectReport = async (projectId) => {
  const pid = projectId.toUpperCase();

  const [
    project,
    charter,
    plan,
    statusDoc,
    closure,
    requirements,
    wbsNodes,
    changeRequests,
    activities,
    resources,
    expenses,
    defects,
    risks,
    performance
  ] = await Promise.all([
    Project.findOne({ projectId: pid }).lean(),
    ProjectCharter.findOne({ projectId: pid }).lean(),
    ManagementPlan.findOne({ projectId: pid }).lean(),
    ProjectStatus.findOne({ projectId: pid }).lean(),
    ProjectClosure.findOne({ projectId: pid }).lean(),
    Requirement.find({ projectId: pid }).lean(),
    WBSNode.find({ projectId: pid }).lean(),
    ChangeRequest.find({ projectId: pid }).lean(),
    Activity.find({ projectId: pid }).lean(),
    Resource.find({ projectId: pid }).lean(),
    Expense.find({ projectId: pid }).lean(),
    Defect.find({ projectId: pid }).lean(),
    Risk.find({ projectId: pid }).lean(),
    getIntegratedPerformance(pid)
  ]);

  return {
    generatedAt: new Date(),
    project,
    charter,
    plan,
    statusDoc,
    closure,
    requirements,
    wbsNodes,
    changeRequests,
    activities,
    resources,
    expenses,
    defects,
    risks,
    performance
  };
};

module.exports = {
  getIntegratedPerformance,
  getCompleteProjectReport
};
