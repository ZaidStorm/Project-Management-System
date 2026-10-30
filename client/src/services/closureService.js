import api from './api';

export const closureService = {
  getByProjectId: (projectId) => api.get(`/projects/${projectId}/closure`),
  save: (projectId, data) => api.put(`/projects/${projectId}/closure`, data)
};
