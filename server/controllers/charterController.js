const charterService = require('../services/charterService');
const { successResponse, errorResponse } = require('../utils/response');

const getCharter = async (req, res, next) => {
  try {
    const charter = await charterService.getCharterByProjectId(req.params.projectId);
    if (!charter) {
      return errorResponse(res, 'Project charter not found', 404);
    }
    return successResponse(res, charter, 'Project charter retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const saveCharter = async (req, res, next) => {
  try {
    const charter = await charterService.upsertCharter(req.params.projectId, req.body);
    return successResponse(res, charter, 'Project charter saved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCharter,
  saveCharter
};
