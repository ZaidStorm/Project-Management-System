import { useState, useEffect, useCallback } from 'react';
import { milestoneService } from '../services/milestoneService';

export const useMilestones = (projectId) => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMilestones = useCallback(async () => {
    if (!projectId) {
      setMilestones([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await milestoneService.getByProjectId(projectId);
      setMilestones(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load milestones');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const addMilestone = async (data) => {
    const res = await milestoneService.create(projectId, data);
    await fetchMilestones();
    return res.data;
  };

  const updateMilestone = async (id, data) => {
    const res = await milestoneService.update(id, data);
    await fetchMilestones();
    return res.data;
  };

  const deleteMilestone = async (id) => {
    const res = await milestoneService.delete(id);
    await fetchMilestones();
    return res.data;
  };

  return {
    milestones,
    loading,
    error,
    refresh: fetchMilestones,
    addMilestone,
    updateMilestone,
    deleteMilestone
  };
};
