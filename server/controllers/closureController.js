const closureService = require('../services/closureService');
const { successResponse, errorResponse } = require('../utils/response');

const getClosure = async (req, res, next) => {
  try {
    const closure = await closureService.getClosureByProjectId(req.params.projectId);
    if (!closure) {
      return errorResponse(res, 'Project closure details not found', 404);
    }
    return successResponse(res, closure, 'Project closure retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const saveClosure = async (req, res, next) => {
  try {
    const closure = await closureService.upsertClosure(req.params.projectId, req.body);
    return successResponse(res, closure, 'Project closure saved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClosure,
  saveClosure
};
