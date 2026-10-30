import { useState, useEffect, useCallback } from 'react';
import { charterService } from '../services/charterService';

export const useCharter = (projectId) => {
  const [charter, setCharter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCharter = useCallback(async () => {
    if (!projectId) {
      setCharter(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await charterService.getByProjectId(projectId);
      setCharter(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load charter');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchCharter();
  }, [fetchCharter]);

  const saveCharter = async (data) => {
    try {
      const res = await charterService.save(projectId, data);
      setCharter(res.data);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  return { charter, loading, error, refresh: fetchCharter, saveCharter };
};
