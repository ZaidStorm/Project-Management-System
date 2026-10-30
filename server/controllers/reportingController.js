const reportingService = require('../services/reportingService');
const { successResponse, errorResponse } = require('../utils/response');

const getPerformanceDashboard = async (req, res, next) => {
  try {
    const data = await reportingService.getIntegratedPerformance(req.params.projectId);
    return successResponse(res, data, 'Integrated project performance metrics retrieved');
  } catch (error) {
    next(error);
  }
};

const getFullReport = async (req, res, next) => {
  try {
    const report = await reportingService.getCompleteProjectReport(req.params.projectId);
    return successResponse(res, report, 'Complete project audit report generated');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPerformanceDashboard,
  getFullReport
};
