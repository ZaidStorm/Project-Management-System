const projectService = require('../services/projectService');
const { successResponse, errorResponse } = require('../utils/response');

const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getAllProjects();
    return successResponse(res, projects, 'Projects retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }
    return successResponse(res, project, 'Project retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.body);
    return successResponse(res, project, 'Project created successfully', 201);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 'A project with this ID or name already exists', 409);
    }
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const updated = await projectService.updateProject(req.params.id, req.body);
    if (!updated) {
      return errorResponse(res, 'Project not found', 404);
    }
    return successResponse(res, updated, 'Project updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const deleted = await projectService.deleteProject(req.params.id);
    if (!deleted) {
      return errorResponse(res, 'Project not found', 404);
    }
    return successResponse(res, deleted, 'Project and associated data deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};
