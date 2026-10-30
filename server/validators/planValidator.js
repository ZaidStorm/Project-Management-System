const validatePlanInput = (data) => {
  const errors = [];

  if (data.costPlan) {
    const fields = ['developmentCost', 'hardwareCost', 'softwareCost', 'otherCost', 'contingency'];
    for (const field of fields) {
      if (data.costPlan[field] !== undefined && (isNaN(data.costPlan[field]) || Number(data.costPlan[field]) < 0)) {
        errors.push(`${field} must be a non-negative number`);
      }
    }
  }

  if (data.schedulePlan) {
    const { developmentStart, developmentEnd, testingStart, testingEnd } = data.schedulePlan;
    if (developmentStart && developmentEnd && new Date(developmentStart) > new Date(developmentEnd)) {
      errors.push('Development start cannot be after development end');
    }
    if (testingStart && testingEnd && new Date(testingStart) > new Date(testingEnd)) {
      errors.push('Testing start cannot be after testing end');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { validatePlanInput };
