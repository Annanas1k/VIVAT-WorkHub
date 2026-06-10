import axios from "axios";
import type { Project } from "../types/project.types";
const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('app_token');
  return { headers: { Authorization: `Bearer ${token}` } };
};




// ─────────────────────────────────────────
// PROJECTS CRUD FETCH
// ─────────────────────────────────────────
export const getAllProjects = async (): Promise<Project[]> => {
  const res = await axios.get(`${API_URL}/projects`, getAuthHeaders());
  return res.data.projects;
};
 
export const createProject = async (data: Partial<Project>): Promise<Project> => {
  const res = await axios.post(`${API_URL}/projects`, data, getAuthHeaders());
  return res.data.project;
};
 
export const updateProject = async (id: number | string, data: Partial<Project>): Promise<Project> => {
  const res = await axios.patch(`${API_URL}/projects/${id}`, data, getAuthHeaders());
  return res.data.project;
};
 
export const deleteProject = async (id: number | string): Promise<{ message: string }> => {
  const res = await axios.delete(`${API_URL}/projects/${id}`, getAuthHeaders());
  return res.data;
};