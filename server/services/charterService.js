const ProjectCharter = require('../models/ProjectCharter');
const Stakeholder = require('../models/Stakeholder');
const Project = require('../models/Project');

const getCharterByProjectId = async (projectId) => {
  const pid = projectId.toUpperCase();
  let charter = await ProjectCharter.findOne({ projectId: pid });
  if (!charter) {
    const project = await Project.findOne({ projectId: pid });
    if (project) {
      charter = await ProjectCharter.create({
        projectId: pid,
        approvedBudget: project.approvedBudget,
        deadline: project.deadline,
        projectManager: project.projectManager,
        approvalStatus: 'Draft'
      });
    }
  }
  return charter;
};

const upsertCharter = async (projectId, charterData) => {
  const pid = projectId.toUpperCase();

  // If approved, record approval date if not set
  if (charterData.approvalStatus === 'Approved' && !charterData.approvalDate) {
    charterData.approvalDate = new Date();
  }

  const charter = await ProjectCharter.findOneAndUpdate(
    { projectId: pid },
    { ...charterData, projectId: pid },
    { new: true, upsert: true, runValidators: true }
  );

  // Sync stakeholders into Stakeholder collection as well if present
  if (Array.isArray(charterData.stakeholders)) {
    for (const sh of charterData.stakeholders) {
      if (sh.name && sh.role) {
        await Stakeholder.findOneAndUpdate(
          { projectId: pid, name: sh.name },
          {
            stakeholderId: sh.stakeholderId || `SH-${Date.now().toString().slice(-4)}`,
            projectId: pid,
            name: sh.name,
            role: sh.role,
            organization: sh.organization || '',
            email: sh.email || '',
            responsibility: sh.responsibility || '',
            influenceLevel: sh.influenceLevel || 'Medium'
          },
          { upsert: true }
        );
      }
    }
  }

  return charter;
};

module.exports = {
  getCharterByProjectId,
  upsertCharter
};
