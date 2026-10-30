import api from './api';

export const changeRequestService = {
  getAll: (projectId) => api.get(`/projects/${projectId}/change-requests`),
  getById: (id) => api.get(`/change-requests/${id}`),
  create: (projectId, data) => api.post(`/projects/${projectId}/change-requests`, data),
  update: (id, data) => api.put(`/change-requests/${id}`, data),
  approve: (id, approvedBy) => api.patch(`/change-requests/${id}/approve`, { approvedBy }),
  reject: (id, approvedBy) => api.patch(`/change-requests/${id}/reject`, { approvedBy })
};
