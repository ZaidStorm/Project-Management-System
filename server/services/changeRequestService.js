const ChangeRequest = require('../models/ChangeRequest');
const Requirement = require('../models/Requirement');

const getChangeRequests = async (projectId) => {
  return await ChangeRequest.find({ projectId: projectId.toUpperCase() }).sort({ createdAt: -1 });
};

const getChangeRequestById = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return await ChangeRequest.findById(id);
  }
  return await ChangeRequest.findOne({ changeRequestId: id.toUpperCase() });
};

const createChangeRequest = async (projectId, data) => {
  const pid = projectId.toUpperCase();
  if (!data.changeRequestId) {
    const count = await ChangeRequest.countDocuments({ projectId: pid });
    data.changeRequestId = `CR-${String(count + 1).padStart(3, '0')}`;
  } else {
    data.changeRequestId = data.changeRequestId.toUpperCase();
  }

  return await ChangeRequest.create({
    ...data,
    projectId: pid
  });
};

const updateChangeRequest = async (id, data) => {
  const cr = await getChangeRequestById(id);
  if (!cr) return null;

  Object.assign(cr, data);
  return await cr.save();
};

const Project = require('../models/Project');
const ProjectCharter = require('../models/ProjectCharter');

const approveChangeRequest = async (id, approvedBy = 'Change Control Board') => {
  const cr = await getChangeRequestById(id);
  if (!cr) return null;

  cr.approvalStatus = 'Approved';
  cr.status = 'Approved';
  cr.approvedBy = approvedBy;
  cr.approvedAt = new Date();
  await cr.save();

  // 1. Update Project Budget and Duration
  const project = await Project.findOne({ projectId: cr.projectId });
  if (project) {
    project.changeCost = (project.changeCost || 0) + (cr.costImpact || 0);
    project.revisedBudget = (project.approvedBudget || 0) + project.changeCost;
    if (cr.scheduleImpact) {
      project.changeDuration = `+${Math.round(cr.scheduleImpact / 7)} Weeks`;
      project.revisedDuration = '19 Weeks';
      if (project.deadline) {
        const newDeadline = new Date(project.deadline);
        newDeadline.setDate(newDeadline.getDate() + (cr.scheduleImpact || 21));
        project.revisedDeadline = newDeadline;
        project.deadline = newDeadline;
      }
    }
    await project.save();
  }

  // 2. Update Project Charter Budget and Duration
  const charter = await ProjectCharter.findOne({ projectId: cr.projectId });
  if (charter) {
    charter.changeCost = (charter.changeCost || 0) + (cr.costImpact || 0);
    charter.revisedBudget = (charter.approvedBudget || 0) + charter.changeCost;
    charter.changeDuration = project?.changeDuration || '+3 Weeks';
    charter.revisedDuration = project?.revisedDuration || '19 Weeks';
    if (project?.revisedDeadline) {
      charter.revisedDeadline = project.revisedDeadline;
      charter.deadline = project.revisedDeadline;
    }
    await charter.save();
  }

  // 3. Mark affected requirements as Approved
  if (cr.affectedRequirements && cr.affectedRequirements.length > 0) {
    await Requirement.updateMany(
      {
        projectId: cr.projectId,
        requirementId: { $in: cr.affectedRequirements }
      },
      {
        $set: {
          status: 'Approved',
          approvalStatus: 'Approved',
          approvedBy: approvedBy,
          approvedAt: new Date()
        }
      }
    );
  }

  return cr;
};

const rejectChangeRequest = async (id, approvedBy = 'Change Control Board') => {
  const cr = await getChangeRequestById(id);
  if (!cr) return null;

  cr.approvalStatus = 'Rejected';
  cr.status = 'Rejected';
  cr.approvedBy = approvedBy;
  cr.approvedAt = new Date();
  return await cr.save();
};

module.exports = {
  getChangeRequests,
  getChangeRequestById,
  createChangeRequest,
  updateChangeRequest,
  approveChangeRequest,
  rejectChangeRequest
};
