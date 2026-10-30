import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/projectService';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async (selectId = null) => {
    try {
      setLoading(true);
      setError(null);
      const res = await projectService.getAll();
      const list = res.data || [];
      setProjects(list);

      // Handle current project selection
      if (selectId) {
        const found = list.find(
          (p) => p.projectId === selectId || p._id === selectId
        );
        if (found) setCurrentProject(found);
      } else if (!currentProject && list.length > 0) {
        // Default to first project if none active
        setCurrentProject(list[0]);
      } else if (currentProject) {
        // Sync current project details
        const refreshed = list.find((p) => p.projectId === currentProject.projectId);
        if (refreshed) setCurrentProject(refreshed);
      }
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const selectProject = (projectOrId) => {
    if (typeof projectOrId === 'string') {
      const match = projects.find(
        (p) => p.projectId === projectOrId || p._id === projectOrId
      );
      if (match) setCurrentProject(match);
    } else {
      setCurrentProject(projectOrId);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        setCurrentProject,
        selectProject,
        fetchProjects,
        loading,
        error
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
