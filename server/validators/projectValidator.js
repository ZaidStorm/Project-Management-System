const validateProjectInput = (data) => {
  const errors = [];

  if (!data.projectName || !data.projectName.trim()) {
    errors.push('Project name is required');
  }

  if (!data.projectManager || !data.projectManager.trim()) {
    errors.push('Project manager is required');
  }

  if (!data.startDate) {
    errors.push('Start date is required');
  }

  if (!data.deadline) {
    errors.push('Deadline is required');
  }

  if (data.startDate && data.deadline && new Date(data.startDate) > new Date(data.deadline)) {
    errors.push('Start date cannot be after deadline');
  }

  if (data.approvedBudget === undefined || data.approvedBudget === null || isNaN(data.approvedBudget) || Number(data.approvedBudget) < 0) {
    errors.push('Approved budget must be a positive number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { validateProjectInput };
