const managementPlanService = require('../services/managementPlanService');
const { successResponse, errorResponse } = require('../utils/response');

const getPlan = async (req, res, next) => {
  try {
    const plan = await managementPlanService.getManagementPlanByProjectId(req.params.projectId);
    if (!plan) {
      return errorResponse(res, 'Management plan not found', 404);
    }
    return successResponse(res, plan, 'Management plan retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const savePlan = async (req, res, next) => {
  try {
    const plan = await managementPlanService.upsertManagementPlan(req.params.projectId, req.body);
    return successResponse(res, plan, 'Management plan saved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlan,
  savePlan
};
