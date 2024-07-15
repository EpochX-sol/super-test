import { writable } from 'svelte/store';
import axios from 'axios';
import type { AxiosInstance } from 'axios';

interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  // Add any other project-specific properties here
}

export const projects = writable<Project[]>([]);

const API_BASE_URL = '/api'; // Adjust this if your API is hosted elsewhere

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL
});

export const projectStore = {
  loadProjects: async (userId: string): Promise<void> => {
    const response = await api.get<Project[]>('/projects', { params: { userId } });
    projects.set(response.data);
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  addProject: async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    const response = await api.post<Project>('/projects', projectData);
    const newProject = response.data;
    projects.update(current => [...current, newProject]);
    return newProject;
  },

  updateProject: async (id: string, projectData: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Project> => {
    const response = await api.put<Project>(`/projects/${id}`, projectData);
    const updatedProject = response.data;
    projects.update(current => 
      current.map(project => project.id === id ? updatedProject : project)
    );
    return updatedProject;
  },

  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
    projects.update(current => current.filter(project => project.id !== id));
  }
};