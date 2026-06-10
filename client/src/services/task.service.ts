import axios from "axios";
import type { Task } from "../types/task.types";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('app_token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ─────────────────────────────────────────
// TASKS CRUD
// ─────────────────────────────────────────

export const getAllTasks = async (): Promise<Task[]> => {
  const res = await axios.get(`${API_URL}/tasks`, getAuthHeaders());
  return res.data.tasks;
};

export const getProjectTasks = async (projectId: number): Promise<Task[]> => {
  const res = await axios.get(`${API_URL}/projects/${projectId}/tasks`, getAuthHeaders());
  return res.data.tasks;
};

export const getTaskById = async (id: number): Promise<Task> => {
  const res = await axios.get(`${API_URL}/tasks/${id}`, getAuthHeaders());
  return res.data.task;
};

export const createTask = async (data: Partial<Task> & { projectId?: number; assigneeIds?: number[] }): Promise<Task> => {
  const res = await axios.post(`${API_URL}/tasks`, data, getAuthHeaders());
  return res.data.task;
};

export const updateTask = async (id: number, data: Partial<Task>): Promise<Task> => {
  const res = await axios.patch(`${API_URL}/tasks/${id}`, data, getAuthHeaders());
  return res.data.task;
};

export const deleteTask = async (id: number): Promise<{ message: string }> => {
  const res = await axios.delete(`${API_URL}/tasks/${id}`, getAuthHeaders());
  return res.data;
};

// ─────────────────────────────────────────
// ASSIGNEES
// ─────────────────────────────────────────

export const getTaskAssignees = async (taskId: number) => {
  const res = await axios.get(`${API_URL}/tasks/${taskId}/assignees`, getAuthHeaders());
  return res.data.assignees;
};

export const addTaskAssignee = async (taskId: number, userId: number) => {
  const res = await axios.post(`${API_URL}/tasks/${taskId}/assignees`, { userId }, getAuthHeaders());
  return res.data.assignee;
};

export const removeTaskAssignee = async (taskId: number, userId: number) => {
  const res = await axios.delete(`${API_URL}/tasks/${taskId}/assignees/${userId}`, getAuthHeaders());
  return res.data;
};