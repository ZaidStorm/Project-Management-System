const Milestone = require('../models/Milestone');
const ProjectStatus = require('../models/ProjectStatus');

const getMilestonesByProjectId = async (projectId) => {
  const pid = projectId.toUpperCase();
  return await Milestone.find({ projectId: pid }).sort({ dueDate: 1 });
};

const createMilestone = async (projectId, milestoneData) => {
  const pid = projectId.toUpperCase();

  // Generate milestone ID if not provided
  if (!milestoneData.milestoneId) {
    const count = await Milestone.countDocuments({ projectId: pid });
    milestoneData.milestoneId = `M-${String(count + 1).padStart(3, '0')}`;
  }

  const milestone = await Milestone.create({
    ...milestoneData,
    projectId: pid
  });

  // Update progress in ProjectStatus if needed
  await recalculateProjectProgress(pid);

  return milestone;
};

const updateMilestone = async (id, updateData) => {
  const milestone = await Milestone.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });

  if (milestone) {
    await recalculateProjectProgress(milestone.projectId);
  }

  return milestone;
};

const deleteMilestone = async (id) => {
  const milestone = await Milestone.findByIdAndDelete(id);
  if (milestone) {
    await recalculateProjectProgress(milestone.projectId);
  }
  return milestone;
};

const recalculateProjectProgress = async (projectId) => {
  const milestones = await Milestone.find({ projectId });
  if (milestones.length === 0) return;

  const totalProgress = milestones.reduce((sum, m) => sum + (m.progress || 0), 0);
  const avgProgress = Math.round(totalProgress / milestones.length);

  await ProjectStatus.findOneAndUpdate(
    { projectId },
    { progress: avgProgress }
  );
};

module.exports = {
  getMilestonesByProjectId,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  recalculateProjectProgress
};
