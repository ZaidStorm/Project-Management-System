const Project = require('../models/Project');

/**
 * Generates the next sequential project ID (e.g. PRJ-001, PRJ-002, ...)
 */
async function generateProjectId() {
  const lastProject = await Project.findOne({}, { projectId: 1 })
    .sort({ createdAt: -1 })
    .lean();

  if (!lastProject || !lastProject.projectId) {
    return 'PRJ-001';
  }

  const match = lastProject.projectId.match(/PRJ-(\d+)/i);
  if (match) {
    const nextNum = parseInt(match[1], 10) + 1;
    return `PRJ-${String(nextNum).padStart(3, '0')}`;
  }

  // Fallback random timestamp-based
  return `PRJ-${Date.now().toString().slice(-4)}`;
}

module.exports = generateProjectId;
