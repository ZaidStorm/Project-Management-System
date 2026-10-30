const milestoneService = require('../services/milestoneService');
const { successResponse, errorResponse } = require('../utils/response');

const getMilestones = async (req, res, next) => {
  try {
    const milestones = await milestoneService.getMilestonesByProjectId(req.params.projectId);
    return successResponse(res, milestones, 'Milestones retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const createMilestone = async (req, res, next) => {
  try {
    const milestone = await milestoneService.createMilestone(req.params.projectId, req.body);
    return successResponse(res, milestone, 'Milestone created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateMilestone = async (req, res, next) => {
  try {
    const milestone = await milestoneService.updateMilestone(req.params.id, req.body);
    if (!milestone) {
      return errorResponse(res, 'Milestone not found', 404);
    }
    return successResponse(res, milestone, 'Milestone updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteMilestone = async (req, res, next) => {
  try {
    const deleted = await milestoneService.deleteMilestone(req.params.id);
    if (!deleted) {
      return errorResponse(res, 'Milestone not found', 404);
    }
    return successResponse(res, deleted, 'Milestone deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone
};
