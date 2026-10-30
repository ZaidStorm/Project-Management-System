const validateCharterInput = (data) => {
  const errors = [];

  if (data.approvalStatus && !['Draft', 'Submitted', 'Approved', 'Rejected'].includes(data.approvalStatus)) {
    errors.push('Invalid approval status');
  }

  if (data.approvalStatus === 'Approved' && !data.approvedBy) {
    errors.push('Approved by is required when charter is Approved');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { validateCharterInput };
