const requirementService = require('../services/requirementService');
const { successResponse, errorResponse } = require('../utils/response');

const getRequirements = async (req, res, next) => {
  try {
    const list = await requirementService.getRequirementsByProjectId(req.params.projectId, req.query);
    return successResponse(res, list, 'Requirements retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getRequirement = async (req, res, next) => {
  try {
    const item = await requirementService.getRequirementById(req.params.id);
    if (!item) return errorResponse(res, 'Requirement not found', 404);
    return successResponse(res, item, 'Requirement retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const createRequirement = async (req, res, next) => {
  try {
    const item = await requirementService.createRequirement(req.params.projectId, req.body);
    return successResponse(res, item, 'Requirement created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateRequirement = async (req, res, next) => {
  try {
    const updated = await requirementService.updateRequirement(req.params.id, req.body);
    if (!updated) return errorResponse(res, 'Requirement not found', 404);
    return successResponse(res, updated, 'Requirement updated successfully');
  } catch (error) {
    next(error);
  }
};

const approveRequirement = async (req, res, next) => {
  try {
    const approved = await requirementService.approveRequirement(req.params.id, req.body.approvedBy);
    if (!approved) return errorResponse(res, 'Requirement not found', 404);
    return successResponse(res, approved, 'Requirement approved into Official Scope');
  } catch (error) {
    next(error);
  }
};

const rejectRequirement = async (req, res, next) => {
  try {
    const rejected = await requirementService.rejectRequirement(req.params.id, req.body.approvedBy);
    if (!rejected) return errorResponse(res, 'Requirement not found', 404);
    return successResponse(res, rejected, 'Requirement rejected from Scope');
  } catch (error) {
    next(error);
  }
};

const deleteRequirement = async (req, res, next) => {
  try {
    const deleted = await requirementService.deleteRequirement(req.params.id);
    if (!deleted) return errorResponse(res, 'Requirement not found', 404);
    return successResponse(res, deleted, 'Requirement deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getApprovedScope = async (req, res, next) => {
  try {
    const scope = await requirementService.getApprovedScope(req.params.projectId);
    return successResponse(res, scope, 'Approved Project Scope retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRequirements,
  getRequirement,
  createRequirement,
  updateRequirement,
  approveRequirement,
  rejectRequirement,
  deleteRequirement,
  getApprovedScope
};
