const wbsService = require('../services/wbsService');
const { successResponse, errorResponse } = require('../utils/response');

const getWBS = async (req, res, next) => {
  try {
    const nodes = await wbsService.getWBSByProjectId(req.params.projectId);
    return successResponse(res, nodes, 'WBS nodes retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getWBSNode = async (req, res, next) => {
  try {
    const node = await wbsService.getWBSById(req.params.id);
    if (!node) return errorResponse(res, 'WBS Node not found', 404);
    return successResponse(res, node, 'WBS Node retrieved');
  } catch (error) {
    next(error);
  }
};

const createWBSNode = async (req, res, next) => {
  try {
    const node = await wbsService.createWBSNode(req.params.projectId, req.body);
    return successResponse(res, node, 'WBS Node created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const updateWBSNode = async (req, res, next) => {
  try {
    const node = await wbsService.updateWBSNode(req.params.id, req.body);
    if (!node) return errorResponse(res, 'WBS Node not found', 404);
    return successResponse(res, node, 'WBS Node updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const deleteWBSNode = async (req, res, next) => {
  try {
    const node = await wbsService.deleteWBSNode(req.params.id);
    if (!node) return errorResponse(res, 'WBS Node not found', 404);
    return successResponse(res, node, 'WBS Node and sub-tree deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWBS,
  getWBSNode,
  createWBSNode,
  updateWBSNode,
  deleteWBSNode
};
