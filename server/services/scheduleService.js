const Activity = require('../models/Activity');
const Resource = require('../models/Resource');
const Dependency = require('../models/Dependency');
const WBSNode = require('../models/WBSNode');
const Project = require('../models/Project');

// --- Activities ---
const getActivities = async (projectId) => {
  return await Activity.find({ projectId: projectId.toUpperCase() }).sort({ startDate: 1 });
};

const getActivityById = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return await Activity.findById(id);
  }
  return await Activity.findOne({ activityId: id.toUpperCase() });
};

const createActivity = async (projectId, data) => {
  const pid = projectId.toUpperCase();

  // Validate WBS Node exists
  if (data.wbsId) {
    const node = await WBSNode.findOne({ projectId: pid, wbsId: data.wbsId.toUpperCase() });
    if (!node) {
      throw new Error(`WBS Node ${data.wbsId} not found.`);
    }
  }

  if (!data.activityId) {
    const count = await Activity.countDocuments({ projectId: pid });
    data.activityId = `ACT-${String(count + 1).padStart(3, '0')}`;
  } else {
    data.activityId = data.activityId.toUpperCase();
  }

  return await Activity.create({
    ...data,
    projectId: pid
  });
};

const updateActivity = async (id, data) => {
  const act = await getActivityById(id);
  if (!act) return null;

  Object.assign(act, data);
  return await act.save();
};

const deleteActivity = async (id) => {
  const act = await getActivityById(id);
  if (!act) return null;

  await Activity.deleteOne({ _id: act._id });
  // Clean up dependencies referencing this activity
  await Dependency.deleteMany({
    projectId: act.projectId,
    $or: [{ predecessorActivity: act.activityId }, { successorActivity: act.activityId }]
  });
  return act;
};

// --- Delay Detection Algorithm ---
const detectDelays = async (projectId) => {
  const pid = projectId.toUpperCase();
  const [activities, dependencies, project] = await Promise.all([
    Activity.find({ projectId: pid }).lean(),
    Dependency.find({ projectId: pid }).lean(),
    Project.findOne({ projectId: pid }).lean()
  ]);

  const actMap = {};
  activities.forEach((a) => (actMap[a.activityId] = a));

  const delays = [];
  const now = new Date();

  // Check individual overdue activities
  for (const act of activities) {
    const endDate = new Date(act.endDate);
    if (act.status !== 'Completed' && now > endDate) {
      const daysOverdue = Math.ceil((now - endDate) / (1000 * 60 * 60 * 24));
      delays.push({
        activityId: act.activityId,
        name: act.name,
        plannedEnd: act.endDate,
        daysDelayed: daysOverdue,
        type: 'Overdue Activity',
        status: act.status
      });
    }
  }

  // Check dependencies: if predecessor finishes after successor's start date
  for (const dep of dependencies) {
    const pred = actMap[dep.predecessorActivity];
    const succ = actMap[dep.successorActivity];

    if (pred && succ && dep.dependencyType === 'FS') {
      const predEnd = new Date(pred.endDate);
      const succStart = new Date(succ.startDate);

      if (predEnd > succStart) {
        const diffDays = Math.ceil((predEnd - succStart) / (1000 * 60 * 60 * 24)) + (dep.lag || 0);
        delays.push({
          predecessor: pred.activityId,
          successor: succ.activityId,
          predecessorName: pred.name,
          successorName: succ.name,
          impactDays: diffDays,
          type: 'Cascading Dependency Delay'
        });
      }
    }
  }

  // Check deadline risk
  let deadlineRisk = false;
  if (project && project.deadline && activities.length > 0) {
    const latestEnd = new Date(Math.max(...activities.map((a) => new Date(a.endDate).getTime())));
    if (latestEnd > new Date(project.deadline)) {
      deadlineRisk = true;
    }
  }

  return {
    delays,
    totalActivities: activities.length,
    completed: activities.filter((a) => a.status === 'Completed').length,
    inProgress: activities.filter((a) => a.status === 'In Progress').length,
    delayed: delays.length,
    deadlineRisk
  };
};

// --- Resources ---
const getResources = async (projectId) => {
  return await Resource.find({ projectId: projectId.toUpperCase() }).sort({ name: 1 });
};

const createResource = async (projectId, data) => {
  const pid = projectId.toUpperCase();
  if (!data.resourceId) {
    const count = await Resource.countDocuments({ projectId: pid });
    data.resourceId = `R-${String(count + 1).padStart(3, '0')}`;
  } else {
    data.resourceId = data.resourceId.toUpperCase();
  }

  return await Resource.create({
    ...data,
    projectId: pid
  });
};

const updateResource = async (id, data) => {
  let resItem = await Resource.findById(id);
  if (!resItem) resItem = await Resource.findOne({ resourceId: id.toUpperCase() });
  if (!resItem) return null;

  Object.assign(resItem, data);
  return await resItem.save();
};

const deleteResource = async (id) => {
  let resItem = await Resource.findById(id);
  if (!resItem) resItem = await Resource.findOne({ resourceId: id.toUpperCase() });
  if (!resItem) return null;

  await Resource.deleteOne({ _id: resItem._id });
  return resItem;
};

// --- Dependencies ---
const getDependencies = async (projectId) => {
  return await Dependency.find({ projectId: projectId.toUpperCase() });
};

const createDependency = async (projectId, data) => {
  const pid = projectId.toUpperCase();
  if (!data.dependencyId) {
    const count = await Dependency.countDocuments({ projectId: pid });
    data.dependencyId = `DEP-${String(count + 1).padStart(3, '0')}`;
  }

  return await Dependency.create({
    ...data,
    projectId: pid
  });
};

const deleteDependency = async (id) => {
  let dep = await Dependency.findById(id);
  if (!dep) dep = await Dependency.findOne({ dependencyId: id.toUpperCase() });
  if (!dep) return null;

  await Dependency.deleteOne({ _id: dep._id });
  return dep;
};

module.exports = {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  detectDelays,
  getResources,
  createResource,
  updateResource,
  deleteResource,
  getDependencies,
  createDependency,
  deleteDependency
};
