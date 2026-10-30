import api from './api';

export const managementPlanService = {
  getByProjectId: (projectId) => api.get(`/projects/${projectId}/management-plan`),
  save: (projectId, data) => api.put(`/projects/${projectId}/management-plan`, data)
};
