const qualityRiskService = require('../services/qualityRiskService');
const { successResponse, errorResponse } = require('../utils/response');

// Defects
const getDefects = async (req, res, next) => {
  try {
    const list = await qualityRiskService.getDefects(req.params.projectId);
    return successResponse(res, list, 'Defects retrieved');
  } catch (error) {
    next(error);
  }
};

const createDefect = async (req, res, next) => {
  try {
    const defect = await qualityRiskService.createDefect(req.params.projectId, req.body);
    return successResponse(res, defect, 'Defect logged successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateDefect = async (req, res, next) => {
  try {
    const defect = await qualityRiskService.updateDefect(req.params.id, req.body);
    if (!defect) return errorResponse(res, 'Defect not found', 404);
    return successResponse(res, defect, 'Defect updated');
  } catch (error) {
    next(error);
  }
};

const deleteDefect = async (req, res, next) => {
  try {
    const defect = await qualityRiskService.deleteDefect(req.params.id);
    if (!defect) return errorResponse(res, 'Defect not found', 404);
    return successResponse(res, defect, 'Defect deleted');
  } catch (error) {
    next(error);
  }
};

// Checklists
const getChecklists = async (req, res, next) => {
  try {
    const list = await qualityRiskService.getChecklists(req.params.projectId);
    return successResponse(res, list, 'Quality checklists retrieved');
  } catch (error) {
    next(error);
  }
};

const createChecklist = async (req, res, next) => {
  try {
    const item = await qualityRiskService.createChecklist(req.params.projectId, req.body);
    return successResponse(res, item, 'Quality checklist created', 201);
  } catch (error) {
    next(error);
  }
};

const updateChecklist = async (req, res, next) => {
  try {
    const item = await qualityRiskService.updateChecklist(req.params.id, req.body);
    if (!item) return errorResponse(res, 'Checklist not found', 404);
    return successResponse(res, item, 'Quality checklist updated');
  } catch (error) {
    next(error);
  }
};

// Inspections
const getInspections = async (req, res, next) => {
  try {
    const list = await qualityRiskService.getInspections(req.params.projectId);
    return successResponse(res, list, 'Inspections retrieved');
  } catch (error) {
    next(error);
  }
};

const createInspection = async (req, res, next) => {
  try {
    const insp = await qualityRiskService.createInspection(req.params.projectId, req.body);
    return successResponse(res, insp, 'Inspection test results recorded', 201);
  } catch (error) {
    next(error);
  }
};

// Risks
const getRisks = async (req, res, next) => {
  try {
    const list = await qualityRiskService.getRisks(req.params.projectId);
    return successResponse(res, list, 'Risks retrieved');
  } catch (error) {
    next(error);
  }
};

const createRisk = async (req, res, next) => {
  try {
    const risk = await qualityRiskService.createRisk(req.params.projectId, req.body);
    return successResponse(res, risk, 'Risk registered with score calculation', 201);
  } catch (error) {
    next(error);
  }
};

const updateRisk = async (req, res, next) => {
  try {
    const risk = await qualityRiskService.updateRisk(req.params.id, req.body);
    if (!risk) return errorResponse(res, 'Risk not found', 404);
    return successResponse(res, risk, 'Risk updated');
  } catch (error) {
    next(error);
  }
};

const deleteRisk = async (req, res, next) => {
  try {
    const risk = await qualityRiskService.deleteRisk(req.params.id);
    if (!risk) return errorResponse(res, 'Risk not found', 404);
    return successResponse(res, risk, 'Risk deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDefects,
  createDefect,
  updateDefect,
  deleteDefect,
  getChecklists,
  createChecklist,
  updateChecklist,
  getInspections,
  createInspection,
  getRisks,
  createRisk,
  updateRisk,
  deleteRisk
};
