import api from './api';

export const statusService = {
  getByProjectId: (projectId) => api.get(`/projects/${projectId}/status`),
  update: (projectId, data) => api.put(`/projects/${projectId}/status`, data)
};
