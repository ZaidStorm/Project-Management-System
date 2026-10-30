import api from './api';

export const wbsService = {
  getAll: (projectId) => api.get(`/projects/${projectId}/wbs`),
  getById: (id) => api.get(`/wbs/${id}`),
  create: (projectId, data) => api.post(`/projects/${projectId}/wbs`, data),
  update: (id, data) => api.put(`/wbs/${id}`, data),
  delete: (id) => api.delete(`/wbs/${id}`)
};
