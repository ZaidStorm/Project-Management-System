const validateMilestoneInput = (data) => {
  const errors = [];

  if (!data.title || !data.title.trim()) {
    errors.push('Milestone title is required');
  }

  if (!data.dueDate) {
    errors.push('Due date is required');
  }

  if (!data.responsiblePerson || !data.responsiblePerson.trim()) {
    errors.push('Responsible person is required');
  }

  if (data.progress !== undefined && (isNaN(data.progress) || data.progress < 0 || data.progress > 100)) {
    errors.push('Progress must be a number between 0 and 100');
  }

  if (data.status && !['Pending', 'In Progress', 'Completed', 'Delayed'].includes(data.status)) {
    errors.push('Invalid milestone status');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { validateMilestoneInput };
