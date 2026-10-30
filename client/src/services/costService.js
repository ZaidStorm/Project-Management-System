import api from './api';

export const costService = {
  getEstimates: (projectId) => api.get(`/projects/${projectId}/cost/estimates`),
  saveEstimate: (projectId, data) => api.post(`/projects/${projectId}/cost/estimates`, data),

  getExpenses: (projectId) => api.get(`/projects/${projectId}/cost/expenses`),
  createExpense: (projectId, data) => api.post(`/projects/${projectId}/cost/expenses`, data),
  deleteExpense: (id) => api.delete(`/cost/expenses/${id}`),

  getEVM: (projectId) => api.get(`/projects/${projectId}/cost/evm`)
};
