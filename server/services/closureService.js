const ProjectClosure = require('../models/ProjectClosure');
const Project = require('../models/Project');
const ProjectStatus = require('../models/ProjectStatus');

const getClosureByProjectId = async (projectId) => {
  const pid = projectId.toUpperCase();
  let closure = await ProjectClosure.findOne({ projectId: pid });
  if (!closure) {
    const project = await Project.findOne({ projectId: pid });
    const status = await ProjectStatus.findOne({ projectId: pid });
    if (project) {
      closure = await ProjectClosure.create({
        projectId: pid,
        closureDate: new Date(),
        finalStatus: 'Completed',
        finalProgress: status ? status.progress : 100,
        finalBudget: project.approvedBudget,
        approvalStatus: 'Pending'
      });
    }
  }
  return closure;
};

const upsertClosure = async (projectId, closureData) => {
  const pid = projectId.toUpperCase();

  const closure = await ProjectClosure.findOneAndUpdate(
    { projectId: pid },
    { ...closureData, projectId: pid },
    { new: true, upsert: true, runValidators: true }
  );

  // If closure is approved, update Project and ProjectStatus status to 'Completed'
  if (closure.approvalStatus === 'Approved') {
    await Project.findOneAndUpdate(
      { projectId: pid },
      { status: closure.finalStatus === 'Terminated' ? 'Cancelled' : 'Completed' }
    );
    await ProjectStatus.findOneAndUpdate(
      { projectId: pid },
      {
        overallStatus: closure.finalStatus === 'Terminated' ? 'Cancelled' : 'Completed',
        progress: closure.finalProgress || 100,
        currentPhase: 'Closure'
      }
    );
  }

  return closure;
};

module.exports = {
  getClosureByProjectId,
  upsertClosure
};
