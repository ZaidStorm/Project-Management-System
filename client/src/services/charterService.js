import api from './api';

export const charterService = {
  getByProjectId: (projectId) => api.get(`/projects/${projectId}/charter`),
  save: (projectId, data) => api.put(`/projects/${projectId}/charter`, data)
};
