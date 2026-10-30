const changeRequestService = require('../services/changeRequestService');
const { successResponse, errorResponse } = require('../utils/response');

const getChangeRequests = async (req, res, next) => {
  try {
    const list = await changeRequestService.getChangeRequests(req.params.projectId);
    return successResponse(res, list, 'Change requests retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getChangeRequest = async (req, res, next) => {
  try {
    const cr = await changeRequestService.getChangeRequestById(req.params.id);
    if (!cr) return errorResponse(res, 'Change request not found', 404);
    return successResponse(res, cr, 'Change request retrieved');
  } catch (error) {
    next(error);
  }
};

const createChangeRequest = async (req, res, next) => {
  try {
    const cr = await changeRequestService.createChangeRequest(req.params.projectId, req.body);
    return successResponse(res, cr, 'Change request submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateChangeRequest = async (req, res, next) => {
  try {
    const cr = await changeRequestService.updateChangeRequest(req.params.id, req.body);
    if (!cr) return errorResponse(res, 'Change request not found', 404);
    return successResponse(res, cr, 'Change request updated');
  } catch (error) {
    next(error);
  }
};

const approveChangeRequest = async (req, res, next) => {
  try {
    const cr = await changeRequestService.approveChangeRequest(req.params.id, req.body.approvedBy);
    if (!cr) return errorResponse(res, 'Change request not found', 404);
    return successResponse(res, cr, 'Change request approved and scope updated');
  } catch (error) {
    next(error);
  }
};

const rejectChangeRequest = async (req, res, next) => {
  try {
    const cr = await changeRequestService.rejectChangeRequest(req.params.id, req.body.approvedBy);
    if (!cr) return errorResponse(res, 'Change request not found', 404);
    return successResponse(res, cr, 'Change request rejected');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChangeRequests,
  getChangeRequest,
  createChangeRequest,
  updateChangeRequest,
  approveChangeRequest,
  rejectChangeRequest
};
