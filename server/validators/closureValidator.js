const validateClosureInput = (data) => {
  const errors = [];

  if (data.finalStatus && !['Completed', 'Terminated', 'Archived'].includes(data.finalStatus)) {
    errors.push('Invalid final status');
  }

  if (data.approvalStatus && !['Pending', 'Approved', 'Rejected'].includes(data.approvalStatus)) {
    errors.push('Invalid approval status');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { validateClosureInput };
