const costService = require('../services/costService');
const { successResponse, errorResponse } = require('../utils/response');

const getEstimates = async (req, res, next) => {
  try {
    const list = await costService.getCostEstimates(req.params.projectId);
    return successResponse(res, list, 'Cost estimates retrieved');
  } catch (error) {
    next(error);
  }
};

const saveEstimate = async (req, res, next) => {
  try {
    const est = await costService.saveCostEstimate(req.params.projectId, req.body);
    return successResponse(res, est, 'Cost estimate saved successfully');
  } catch (error) {
    next(error);
  }
};

const getExpenses = async (req, res, next) => {
  try {
    const list = await costService.getExpenses(req.params.projectId);
    return successResponse(res, list, 'Actual expenses retrieved');
  } catch (error) {
    next(error);
  }
};

const createExpense = async (req, res, next) => {
  try {
    const exp = await costService.createExpense(req.params.projectId, req.body);
    return successResponse(res, exp, 'Expense recorded successfully', 201);
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const exp = await costService.deleteExpense(req.params.id);
    if (!exp) return errorResponse(res, 'Expense not found', 404);
    return successResponse(res, exp, 'Expense deleted');
  } catch (error) {
    next(error);
  }
};

const getEVM = async (req, res, next) => {
  try {
    const evm = await costService.calculateEVM(req.params.projectId);
    return successResponse(res, evm, 'Earned Value Analysis computed');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEstimates,
  saveEstimate,
  getExpenses,
  createExpense,
  deleteExpense,
  getEVM
};
