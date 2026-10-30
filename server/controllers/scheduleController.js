const scheduleService = require('../services/scheduleService');
const { successResponse, errorResponse } = require('../utils/response');

// Activities
const getActivities = async (req, res, next) => {
  try {
    const list = await scheduleService.getActivities(req.params.projectId);
    return successResponse(res, list, 'Activities retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getActivity = async (req, res, next) => {
  try {
    const act = await scheduleService.getActivityById(req.params.id);
    if (!act) return errorResponse(res, 'Activity not found', 404);
    return successResponse(res, act, 'Activity retrieved');
  } catch (error) {
    next(error);
  }
};

const createActivity = async (req, res, next) => {
  try {
    const act = await scheduleService.createActivity(req.params.projectId, req.body);
    return successResponse(res, act, 'Activity created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const updateActivity = async (req, res, next) => {
  try {
    const act = await scheduleService.updateActivity(req.params.id, req.body);
    if (!act) return errorResponse(res, 'Activity not found', 404);
    return successResponse(res, act, 'Activity updated');
  } catch (error) {
    next(error);
  }
};

const deleteActivity = async (req, res, next) => {
  try {
    const act = await scheduleService.deleteActivity(req.params.id);
    if (!act) return errorResponse(res, 'Activity not found', 404);
    return successResponse(res, act, 'Activity deleted');
  } catch (error) {
    next(error);
  }
};

const getDelays = async (req, res, next) => {
  try {
    const delays = await scheduleService.detectDelays(req.params.projectId);
    return successResponse(res, delays, 'Delay detection analysis generated');
  } catch (error) {
    next(error);
  }
};

// Resources
const getResources = async (req, res, next) => {
  try {
    const list = await scheduleService.getResources(req.params.projectId);
    return successResponse(res, list, 'Resources retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const createResource = async (req, res, next) => {
  try {
    const resource = await scheduleService.createResource(req.params.projectId, req.body);
    return successResponse(res, resource, 'Resource created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateResource = async (req, res, next) => {
  try {
    const resource = await scheduleService.updateResource(req.params.id, req.body);
    if (!resource) return errorResponse(res, 'Resource not found', 404);
    return successResponse(res, resource, 'Resource updated');
  } catch (error) {
    next(error);
  }
};

const deleteResource = async (req, res, next) => {
  try {
    const resource = await scheduleService.deleteResource(req.params.id);
    if (!resource) return errorResponse(res, 'Resource not found', 404);
    return successResponse(res, resource, 'Resource deleted');
  } catch (error) {
    next(error);
  }
};

// Dependencies
const getDependencies = async (req, res, next) => {
  try {
    const list = await scheduleService.getDependencies(req.params.projectId);
    return successResponse(res, list, 'Dependencies retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const createDependency = async (req, res, next) => {
  try {
    const dep = await scheduleService.createDependency(req.params.projectId, req.body);
    return successResponse(res, dep, 'Dependency created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const deleteDependency = async (req, res, next) => {
  try {
    const dep = await scheduleService.deleteDependency(req.params.id);
    if (!dep) return errorResponse(res, 'Dependency not found', 404);
    return successResponse(res, dep, 'Dependency deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  getDelays,
  getResources,
  createResource,
  updateResource,
  deleteResource,
  getDependencies,
  createDependency,
  deleteDependency
};
