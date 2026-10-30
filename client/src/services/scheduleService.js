import api from './api';

export const scheduleService = {
  // Activities
  getActivities: (projectId) => api.get(`/projects/${projectId}/schedule/activities`),
  getActivityById: (id) => api.get(`/schedule/activities/${id}`),
  createActivity: (projectId, data) => api.post(`/projects/${projectId}/schedule/activities`, data),
  updateActivity: (id, data) => api.put(`/schedule/activities/${id}`, data),
  deleteActivity: (id) => api.delete(`/schedule/activities/${id}`),
  getDelays: (projectId) => api.get(`/projects/${projectId}/schedule/delays`),

  // Resources
  getResources: (projectId) => api.get(`/projects/${projectId}/schedule/resources`),
  createResource: (projectId, data) => api.post(`/projects/${projectId}/schedule/resources`, data),
  updateResource: (id, data) => api.put(`/schedule/resources/${id}`, data),
  deleteResource: (id) => api.delete(`/schedule/resources/${id}`),

  // Dependencies
  getDependencies: (projectId) => api.get(`/projects/${projectId}/schedule/dependencies`),
  createDependency: (projectId, data) => api.post(`/projects/${projectId}/schedule/dependencies`, data),
  deleteDependency: (id) => api.delete(`/schedule/dependencies/${id}`)
};
