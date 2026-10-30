const Defect = require('../models/Defect');
const QualityChecklist = require('../models/QualityChecklist');
const Inspection = require('../models/Inspection');
const Risk = require('../models/Risk');

// --- Defects ---
const getDefects = async (projectId) => {
  return await Defect.find({ projectId: projectId.toUpperCase() }).sort({ createdAt: -1 });
};

const createDefect = async (projectId, data) => {
  const pid = projectId.toUpperCase();
  if (!data.defectId) {
    const count = await Defect.countDocuments({ projectId: pid });
    data.defectId = `DEF-${String(count + 1).padStart(3, '0')}`;
  } else {
    data.defectId = data.defectId.toUpperCase();
  }

  return await Defect.create({
    ...data,
    projectId: pid
  });
};

const updateDefect = async (id, data) => {
  let defect = await Defect.findById(id);
  if (!defect) defect = await Defect.findOne({ defectId: id.toUpperCase() });
  if (!defect) return null;

  if (data.status === 'Resolved' && !defect.resolvedDate) {
    data.resolvedDate = new Date();
  }

  Object.assign(defect, data);
  return await defect.save();
};

const deleteDefect = async (id) => {
  let defect = await Defect.findById(id);
  if (!defect) defect = await Defect.findOne({ defectId: id.toUpperCase() });
  if (!defect) return null;

  await Defect.deleteOne({ _id: defect._id });
  return defect;
};

// --- Checklists ---
const getChecklists = async (projectId) => {
  return await QualityChecklist.find({ projectId: projectId.toUpperCase() });
};

const createChecklist = async (projectId, data) => {
  const pid = projectId.toUpperCase();
  if (!data.checklistId) {
    const count = await QualityChecklist.countDocuments({ projectId: pid });
    data.checklistId = `QC-${String(count + 1).padStart(3, '0')}`;
  }

  return await QualityChecklist.create({
    ...data,
    projectId: pid
  });
};

const updateChecklist = async (id, data) => {
  let item = await QualityChecklist.findById(id);
  if (!item) item = await QualityChecklist.findOne({ checklistId: id.toUpperCase() });
  if (!item) return null;

  Object.assign(item, data);
  return await item.save();
};

// --- Inspections ---
const getInspections = async (projectId) => {
  return await Inspection.find({ projectId: projectId.toUpperCase() }).sort({ inspectionDate: -1 });
};

const createInspection = async (projectId, data) => {
  const pid = projectId.toUpperCase();
  if (!data.inspectionId) {
    const count = await Inspection.countDocuments({ projectId: pid });
    data.inspectionId = `INSP-${String(count + 1).padStart(3, '0')}`;
  }

  return await Inspection.create({
    ...data,
    projectId: pid
  });
};

// --- Risks ---
const getRisks = async (projectId) => {
  return await Risk.find({ projectId: projectId.toUpperCase() }).sort({ riskScore: -1 });
};

const createRisk = async (projectId, data) => {
  const pid = projectId.toUpperCase();
  if (!data.riskId) {
    const count = await Risk.countDocuments({ projectId: pid });
    data.riskId = `RSK-${String(count + 1).padStart(3, '0')}`;
  } else {
    data.riskId = data.riskId.toUpperCase();
  }

  return await Risk.create({
    ...data,
    projectId: pid
  });
};

const updateRisk = async (id, data) => {
  let risk = await Risk.findById(id);
  if (!risk) risk = await Risk.findOne({ riskId: id.toUpperCase() });
  if (!risk) return null;

  Object.assign(risk, data);
  return await risk.save();
};

const deleteRisk = async (id) => {
  let risk = await Risk.findById(id);
  if (!risk) risk = await Risk.findOne({ riskId: id.toUpperCase() });
  if (!risk) return null;

  await Risk.deleteOne({ _id: risk._id });
  return risk;
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
