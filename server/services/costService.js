const CostEstimate = require('../models/CostEstimate');
const Expense = require('../models/Expense');
const EarnedValue = require('../models/EarnedValue');
const Activity = require('../models/Activity');
const Project = require('../models/Project');

// --- Cost Estimates ---
const getCostEstimates = async (projectId) => {
  return await CostEstimate.find({ projectId: projectId.toUpperCase() });
};

const saveCostEstimate = async (projectId, data) => {
  const pid = projectId.toUpperCase();
  if (!data.estimateId) {
    const count = await CostEstimate.countDocuments({ projectId: pid });
    data.estimateId = `EST-${String(count + 1).padStart(3, '0')}`;
  }

  const labor = Number(data.laborCost) || 0;
  const mat = Number(data.materialCost) || 0;
  const sw = Number(data.softwareCost) || 0;
  const other = Number(data.otherCost) || 0;
  data.totalEstimatedCost = labor + mat + sw + other;

  return await CostEstimate.findOneAndUpdate(
    { projectId: pid, activityId: data.activityId },
    { ...data, projectId: pid },
    { new: true, upsert: true, runValidators: true }
  );
};

// --- Expenses ---
const getExpenses = async (projectId) => {
  return await Expense.find({ projectId: projectId.toUpperCase() }).sort({ date: -1 });
};

const createExpense = async (projectId, data) => {
  const pid = projectId.toUpperCase();
  if (!data.expenseId) {
    const count = await Expense.countDocuments({ projectId: pid });
    data.expenseId = `EXP-${String(count + 1).padStart(3, '0')}`;
  }

  const exp = await Expense.create({
    ...data,
    projectId: pid
  });

  // Re-calculate EVM
  await calculateEVM(pid);
  return exp;
};

const deleteExpense = async (id) => {
  let exp = await Expense.findById(id);
  if (!exp) exp = await Expense.findOne({ expenseId: id.toUpperCase() });
  if (!exp) return null;

  await Expense.deleteOne({ _id: exp._id });
  await calculateEVM(exp.projectId);
  return exp;
};

// --- EVM Calculation Engine ---
const calculateEVM = async (projectId) => {
  const pid = projectId.toUpperCase();
  const [project, activities, expenses, estimates] = await Promise.all([
    Project.findOne({ projectId: pid }).lean(),
    Activity.find({ projectId: pid }).lean(),
    Expense.find({ projectId: pid }).lean(),
    CostEstimate.find({ projectId: pid }).lean()
  ]);

  if (!project) return null;

  const plannedBudget = project.approvedBudget || 0;

  // 1. Calculate Actual Cost (AC) = Total Actual Expenditure
  const ac = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // 2. Calculate Actual Completion % based on Activities
  let actualCompletionPct = 0;
  let plannedCompletionPct = 0;
  const now = new Date();

  if (activities.length > 0) {
    const totalProgress = activities.reduce((sum, a) => sum + (Number(a.progress) || 0), 0);
    actualCompletionPct = (totalProgress / activities.length) / 100;

    // Planned Completion %: based on timeline elapsed
    let totalPlannedDuration = 0;
    let elapsedDuration = 0;

    for (const a of activities) {
      const start = new Date(a.startDate);
      const end = new Date(a.endDate);
      const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      totalPlannedDuration += totalDays;

      if (now > end) {
        elapsedDuration += totalDays;
      } else if (now > start) {
        const daysPassed = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
        elapsedDuration += Math.min(totalDays, daysPassed);
      }
    }

    plannedCompletionPct = totalPlannedDuration > 0 ? (elapsedDuration / totalPlannedDuration) : 0;
  } else {
    actualCompletionPct = 0;
    plannedCompletionPct = 0;
  }

  // 3. Planned Value (PV) = Planned Budget * Planned Completion %
  const pv = Math.round(plannedBudget * Math.min(1, plannedCompletionPct));

  // 4. Earned Value (EV) = Planned Budget * Actual Completion %
  const ev = Math.round(plannedBudget * Math.min(1, actualCompletionPct));

  // 5. Indices & Variances
  const cpi = ac > 0 ? Number((ev / ac).toFixed(2)) : 1.0;
  const spi = pv > 0 ? Number((ev / pv).toFixed(2)) : 1.0;
  const costVariance = ev - ac;
  const scheduleVariance = ev - pv;

  // Cost & Schedule Status
  let costStatus = 'On Budget';
  if (cpi < 0.85) costStatus = 'Critical Overrun';
  else if (cpi < 1.0) costStatus = 'Over Budget';
  else if (cpi > 1.0) costStatus = 'Under Budget';

  let scheduleStatus = 'On Schedule';
  if (spi < 0.85) scheduleStatus = 'Critical Delay';
  else if (spi < 1.0) scheduleStatus = 'Behind Schedule';
  else if (spi > 1.0) scheduleStatus = 'Ahead of Schedule';

  // Warnings
  const warnings = [];
  if (cpi < 0.9) warnings.push(`⚠ Significant Cost Overrun: CPI is ${cpi} (Below 0.90 threshold)`);
  if (spi < 0.9) warnings.push(`⚠ Significant Schedule Delay: SPI is ${spi} (Below 0.90 threshold)`);
  if (ac > plannedBudget) warnings.push(`🔴 Budget Overrun: Actual expenditure exceeds approved budget of Rs. ${plannedBudget.toLocaleString()}`);

  if (project.deadline && now > new Date(project.deadline) && actualCompletionPct < 1) {
    warnings.push(`🔴 Deadline Risk: Project has passed target deadline while work is still in progress`);
  }

  // Upsert EarnedValue record
  const evmRecord = await EarnedValue.findOneAndUpdate(
    { projectId: pid },
    {
      projectId: pid,
      pv,
      ev,
      ac,
      cpi,
      spi,
      costVariance,
      scheduleVariance,
      costStatus,
      scheduleStatus,
      warnings,
      calculatedAt: new Date()
    },
    { new: true, upsert: true }
  );

  return evmRecord;
};

module.exports = {
  getCostEstimates,
  saveCostEstimate,
  getExpenses,
  createExpense,
  deleteExpense,
  calculateEVM
};
