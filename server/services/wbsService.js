const WBSNode = require('../models/WBSNode');
const Requirement = require('../models/Requirement');

const getWBSByProjectId = async (projectId) => {
  return await WBSNode.find({ projectId: projectId.toUpperCase() }).sort({ code: 1 });
};

const getWBSById = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return await WBSNode.findById(id);
  }
  return await WBSNode.findOne({ wbsId: id.toUpperCase() });
};

const createWBSNode = async (projectId, data) => {
  const pid = projectId.toUpperCase();

  // Enforce System Rule: A WBS node linked to a requirement can ONLY be created if requirement is Approved
  if (data.requirementId && data.requirementId.trim()) {
    const reqItem = await Requirement.findOne({
      projectId: pid,
      requirementId: data.requirementId.trim().toUpperCase()
    });

    if (!reqItem) {
      throw new Error(`Requirement ${data.requirementId} not found for this project.`);
    }

    if (reqItem.approvalStatus !== 'Approved') {
      throw new Error(
        `Scope Control Violation: Requirement ${reqItem.requirementId} ("${reqItem.title}") has status "${reqItem.approvalStatus}". Unapproved requirements cannot be added to the WBS or Approved Scope.`
      );
    }
  }

  // Generate WBS ID
  if (!data.wbsId) {
    const count = await WBSNode.countDocuments({ projectId: pid });
    data.wbsId = `WBS-${String(count + 1).padStart(3, '0')}`;
  } else {
    data.wbsId = data.wbsId.toUpperCase();
  }

  // If code is not provided, generate a hierarchical code
  if (!data.code) {
    if (!data.parentId) {
      const topCount = await WBSNode.countDocuments({ projectId: pid, parentId: null });
      data.code = `${topCount + 1}`;
    } else {
      const parent = await WBSNode.findOne({ projectId: pid, wbsId: data.parentId });
      const siblings = await WBSNode.countDocuments({ projectId: pid, parentId: data.parentId });
      data.code = parent ? `${parent.code}.${siblings + 1}` : `${siblings + 1}`;
    }
  }

  return await WBSNode.create({
    ...data,
    projectId: pid
  });
};

const updateWBSNode = async (id, data) => {
  const node = await getWBSById(id);
  if (!node) return null;

  // Enforce rule on update as well
  if (data.requirementId && data.requirementId.trim()) {
    const reqItem = await Requirement.findOne({
      projectId: node.projectId,
      requirementId: data.requirementId.trim().toUpperCase()
    });

    if (!reqItem) {
      throw new Error(`Requirement ${data.requirementId} not found.`);
    }

    if (reqItem.approvalStatus !== 'Approved') {
      throw new Error(
        `Scope Control Violation: Requirement ${reqItem.requirementId} is "${reqItem.approvalStatus}". Only Approved requirements can be part of WBS.`
      );
    }
  }

  Object.assign(node, data);
  return await node.save();
};

const deleteWBSNode = async (id) => {
  const node = await getWBSById(id);
  if (!node) return null;

  // Recursive delete of node and its children
  const deleteSubtree = async (wbsId, projectId) => {
    const children = await WBSNode.find({ projectId, parentId: wbsId });
    for (const child of children) {
      await deleteSubtree(child.wbsId, projectId);
    }
    await WBSNode.deleteOne({ projectId, wbsId });
  };

  await deleteSubtree(node.wbsId, node.projectId);
  return node;
};

module.exports = {
  getWBSByProjectId,
  getWBSById,
  createWBSNode,
  updateWBSNode,
  deleteWBSNode
};
