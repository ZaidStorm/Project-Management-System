import api from './api';

export const qualityRiskService = {
  // Defects
  getDefects: (projectId) => api.get(`/projects/${projectId}/quality-risk/defects`),
  createDefect: (projectId, data) => api.post(`/projects/${projectId}/quality-risk/defects`, data),
  updateDefect: (id, data) => api.put(`/quality-risk/defects/${id}`, data),
  deleteDefect: (id) => api.delete(`/quality-risk/defects/${id}`),

  // Checklists
  getChecklists: (projectId) => api.get(`/projects/${projectId}/quality-risk/checklists`),
  createChecklist: (projectId, data) => api.post(`/projects/${projectId}/quality-risk/checklists`, data),
  updateChecklist: (id, data) => api.put(`/quality-risk/checklists/${id}`, data),

  // Inspections
  getInspections: (projectId) => api.get(`/projects/${projectId}/quality-risk/inspections`),
  createInspection: (projectId, data) => api.post(`/projects/${projectId}/quality-risk/inspections`, data),

  // Risks
  getRisks: (projectId) => api.get(`/projects/${projectId}/quality-risk/risks`),
  createRisk: (projectId, data) => api.post(`/projects/${projectId}/quality-risk/risks`, data),
  updateRisk: (id, data) => api.put(`/quality-risk/risks/${id}`, data),
  deleteRisk: (id) => api.delete(`/quality-risk/risks/${id}`)
};
