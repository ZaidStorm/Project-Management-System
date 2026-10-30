const ProjectStatus = require('../models/ProjectStatus');
const Project = require('../models/Project');
const { successResponse, errorResponse } = require('../utils/response');

const getStatus = async (req, res, next) => {
  try {
    const pid = req.params.projectId.toUpperCase();
    let status = await ProjectStatus.findOne({ projectId: pid });
    if (!status) {
      const project = await Project.findOne({ projectId: pid });
      if (project) {
        status = await ProjectStatus.create({
          projectId: pid,
          overallStatus: project.status || 'Planning',
          progress: 0,
          currentPhase: 'Initiation',
          updatedBy: project.projectManager
        });
      } else {
        return errorResponse(res, 'Project not found', 404);
      }
    }
    return successResponse(res, status, 'Project status retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const pid = req.params.projectId.toUpperCase();
    const status = await ProjectStatus.findOneAndUpdate(
      { projectId: pid },
      { ...req.body, projectId: pid },
      { new: true, upsert: true, runValidators: true }
    );

    // Keep Project.status in sync if overallStatus was modified
    if (req.body.overallStatus) {
      await Project.findOneAndUpdate(
        { projectId: pid },
        { status: req.body.overallStatus }
      );
    }

    return successResponse(res, status, 'Project status updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStatus,
  updateStatus
};
