import { writable } from 'svelte/store';
import axios from 'axios';
import type { AxiosInstance } from 'axios';

interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean; 
}

interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  completed: boolean;
  subtasks: Subtask[]; 
}

export const tasks = writable<Task[]>([]);

const API_BASE_URL = '/api'; // Adjust this if your API is hosted elsewhere

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL
});

export const taskStore = {
  loadTasks: async (projectId: string): Promise<void> => {
    const response = await api.get<Task[]>(`/projects/${projectId}/tasks`);
    tasks.set(response.data);
  },

  getTask: async (projectId: string, taskId: string): Promise<Task> => {
    const response = await api.get<Task>(`/projects/${projectId}/tasks/${taskId}`);
    return response.data;
  },

  addTask: async (projectId: string, taskData: Omit<Task, 'id' | 'projectId' | 'subtasks'>): Promise<Task> => {
    const response = await api.post<Task>(`/projects/${projectId}/tasks`, taskData);
    const newTask = response.data;
    tasks.update(current => [...current, newTask]);
    return newTask;
  },

  updateTask: async (projectId: string, taskId: string, taskData: Partial<Omit<Task, 'subtasks'>>): Promise<Task> => {
    const response = await api.put<Task>(`/projects/${projectId}/tasks/${taskId}`, taskData);
    const updatedTask = response.data;
    tasks.update(current => 
      current.map(task => task.id === taskId ? updatedTask : task)
    );
    return updatedTask;
  },

  deleteTask: async (projectId: string, taskId: string): Promise<void> => {
    await api.delete(`/projects/${projectId}/tasks/${taskId}`);
    tasks.update(current => current.filter(task => task.id !== taskId));
  },

  // Subtask operations
  addSubtask: async (projectId: string, taskId: string, subtaskData: Omit<Subtask, 'id' | 'taskId'>): Promise<Subtask> => {
    const response = await api.post<Subtask>(`/projects/${projectId}/tasks/${taskId}/subtasks`, subtaskData);
    const newSubtask = response.data;
    tasks.update(current => 
      current.map(task => 
        task.id === taskId 
          ? { ...task, subtasks: [...task.subtasks, newSubtask] }
          : task
      )
    );
    return newSubtask;
  },

  updateSubtask: async (projectId: string, taskId: string, subtaskId: string, subtaskData: Partial<Subtask>): Promise<Subtask> => {
    const response = await api.put<Subtask>(`/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}`, subtaskData);
    const updatedSubtask = response.data;
    tasks.update(current => 
      current.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              subtasks: task.subtasks.map(subtask => 
                subtask.id === subtaskId ? updatedSubtask : subtask
              )
            }
          : task
      )
    );
    return updatedSubtask;
  },

  deleteSubtask: async (projectId: string, taskId: string, subtaskId: string): Promise<void> => {
    await api.delete(`/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}`);
    tasks.update(current => 
      current.map(task => 
        task.id === taskId 
          ? { ...task, subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId) }
          : task
      )
    );
  }
};