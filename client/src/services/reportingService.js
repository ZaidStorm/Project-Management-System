import api from './api';

export const reportingService = {
  getPerformance: (projectId) => api.get(`/projects/${projectId}/integration/performance`),
  getFullReport: (projectId) => api.get(`/projects/${projectId}/integration/report`)
};
