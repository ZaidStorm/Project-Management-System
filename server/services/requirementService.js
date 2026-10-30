const Requirement = require('../models/Requirement');
const WBSNode = require('../models/WBSNode');

const getRequirementsByProjectId = async (projectId, filter = {}) => {
  const query = { projectId: projectId.toUpperCase() };
  if (filter.status) query.status = filter.status;
  if (filter.priority) query.priority = filter.priority;
  if (filter.approvalStatus) query.approvalStatus = filter.approvalStatus;
  return await Requirement.find(query).sort({ createdAt: -1 });
};

const getRequirementById = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return await Requirement.findById(id);
  }
  return await Requirement.findOne({ requirementId: id.toUpperCase() });
};

const createRequirement = async (projectId, data) => {
  const pid = projectId.toUpperCase();
  if (!data.requirementId) {
    const count = await Requirement.countDocuments({ projectId: pid });
    data.requirementId = `REQ-${String(count + 1).padStart(3, '0')}`;
  } else {
    data.requirementId = data.requirementId.toUpperCase();
  }

  return await Requirement.create({
    ...data,
    projectId: pid
  });
};

const updateRequirement = async (id, data) => {
  const reqItem = await getRequirementById(id);
  if (!reqItem) return null;

  Object.assign(reqItem, data);
  return await reqItem.save();
};

const approveRequirement = async (id, approvedBy = 'Project Sponsor') => {
  const reqItem = await getRequirementById(id);
  if (!reqItem) return null;

  reqItem.approvalStatus = 'Approved';
  reqItem.status = 'Approved';
  reqItem.approvedBy = approvedBy;
  reqItem.approvedAt = new Date();
  return await reqItem.save();
};

const rejectRequirement = async (id, approvedBy = 'Project Sponsor') => {
  const reqItem = await getRequirementById(id);
  if (!reqItem) return null;

  reqItem.approvalStatus = 'Rejected';
  reqItem.status = 'Rejected';
  reqItem.approvedBy = approvedBy;
  reqItem.approvedAt = new Date();
  return await reqItem.save();
};

const deleteRequirement = async (id) => {
  const reqItem = await getRequirementById(id);
  if (!reqItem) return null;

  // Ensure requirement isn't already assigned to a WBS node
  const linkedWBS = await WBSNode.findOne({ requirementId: reqItem.requirementId });
  if (linkedWBS) {
    throw new Error(`Cannot delete requirement ${reqItem.requirementId} because it is referenced in WBS node: ${linkedWBS.name} (${linkedWBS.wbsId})`);
  }

  await Requirement.deleteOne({ _id: reqItem._id });
  return reqItem;
};

// Returns strictly Approved scope as requested
const getApprovedScope = async (projectId) => {
  return await Requirement.find({
    projectId: projectId.toUpperCase(),
    approvalStatus: 'Approved'
  }).sort({ priority: 1, requirementId: 1 });
};

module.exports = {
  getRequirementsByProjectId,
  getRequirementById,
  createRequirement,
  updateRequirement,
  approveRequirement,
  rejectRequirement,
  deleteRequirement,
  getApprovedScope
};
