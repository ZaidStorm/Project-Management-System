import api from './api';

export const requirementService = {
  getAll: (projectId, params) => api.get(`/projects/${projectId}/requirements`, { params }),
  getById: (id) => api.get(`/requirements/${id}`),
  create: (projectId, data) => api.post(`/projects/${projectId}/requirements`, data),
  update: (id, data) => api.put(`/requirements/${id}`, data),
  delete: (id) => api.delete(`/requirements/${id}`),
  approve: (id, approvedBy) => api.patch(`/requirements/${id}/approve`, { approvedBy }),
  reject: (id, approvedBy) => api.patch(`/requirements/${id}/reject`, { approvedBy }),
  getApprovedScope: (projectId) => api.get(`/projects/${projectId}/scope`)
};
