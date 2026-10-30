import api from './api';

export const milestoneService = {
  getByProjectId: (projectId) => api.get(`/projects/${projectId}/milestones`),
  create: (projectId, data) => api.post(`/projects/${projectId}/milestones`, data),
  update: (id, data) => api.put(`/milestones/${id}`, data),
  delete: (id) => api.delete(`/milestones/${id}`)
};
