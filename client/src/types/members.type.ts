import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL
const getAuthHeaders = () => {
  const token = localStorage.getItem('app_token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ─────────────────────────────────────────
// PROJECT MEMBERS
// ─────────────────────────────────────────

export interface ProjectMember {
  id: number;
  userId: number;
  projectId: number;
  role: string;
  joinedAt: string;
  user: { id: number; name: string; email: string; avatar?: string; role: string };
}

export const getProjectMembers = async (projectId: number): Promise<ProjectMember[]> => {
  const res = await axios.get(`${API_URL}/projects/${projectId}/members`, getAuthHeaders());
  return res.data.members;
};

export const addProjectMember = async (
  projectId: number,
  data: { userId: number; role: string }
): Promise<ProjectMember> => {
  const res = await axios.post(`${API_URL}/projects/${projectId}/members`, data, getAuthHeaders());
  return res.data.member;
};

export const updateProjectMember = async (
  projectId: number,
  memberId: number,
  data: { role: string }
): Promise<ProjectMember> => {
  const res = await axios.patch(`${API_URL}/projects/${projectId}/members/${memberId}`, data, getAuthHeaders());
  return res.data.member;
};

export const removeProjectMember = async (
  projectId: number,
  memberId: number
): Promise<{ message: string }> => {
  const res = await axios.delete(`${API_URL}/projects/${projectId}/members/${memberId}`, getAuthHeaders());
  return res.data;
};

// ─────────────────────────────────────────
// TASK ASSIGNEES
// ─────────────────────────────────────────

export interface TaskAssignee {
  id: number;
  userId: number;
  taskId: number;
  assignedAt: string;
  user: { id: number; name: string; email: string; avatar?: string; role: string };
}

export const getTaskAssignees = async (taskId: number): Promise<TaskAssignee[]> => {
  const res = await axios.get(`${API_URL}/tasks/${taskId}/assignees`, getAuthHeaders());
  return res.data.assignees;
};

export const addTaskAssignee = async (
  taskId: number,
  data: { userId: number }
): Promise<TaskAssignee> => {
  const res = await axios.post(`${API_URL}/tasks/${taskId}/assignees`, data, getAuthHeaders());
  return res.data.assignee;
};

export const removeTaskAssignee = async (
  taskId: number,
  assigneeId: number
): Promise<{ message: string }> => {
  const res = await axios.delete(`${API_URL}/tasks/${taskId}/assignees/${assigneeId}`, getAuthHeaders());
  return res.data;
};