import axios from 'axios';
import type { UserData } from '../types/auth.types';
import type {  DetailedLogResponse, GetLogsResponse } from '../types/logs.types';
import type { CustomerData, ProjectData, TaskData } from '../types/admin.types';
const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('app_token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ─────────────────────────────────────────
// USER CRUD FETCH
// ─────────────────────────────────────────

export const adminGetUsers = async (): Promise<UserData[]> => {
  const res = await axios.get(`${API_URL}/users`, getAuthHeaders());
  return res.data.users;
};

export const adminCreateUser = async (data: Partial<UserData>): Promise<UserData> => {
  const res = await axios.post(`${API_URL}/users`, data, getAuthHeaders());
  return res.data.user;
};

export const adminUpdateUser = async (id: number | string, data: Partial<UserData>): Promise<UserData> => {
  const res = await axios.patch(`${API_URL}/users/${id}`, data, getAuthHeaders());
  return res.data.user;
};

export const adminDeleteUser = async (id: number | string): Promise<{ message: string }> => {
  const res = await axios.delete(`${API_URL}/users/${id}`, getAuthHeaders());
  return res.data;
};


// ─────────────────────────────────────────
// LOGS CRUD FETCH
// ─────────────────────────────────────────

export const adminGetAllLogs = async (): Promise<GetLogsResponse> => {
  const res = await axios.get(`${API_URL}/logs`, getAuthHeaders())
  return res.data
}

export const adminGetLogByIdLog = async (id: string | number): Promise<DetailedLogResponse> =>{
  const res = await axios.get(`${API_URL}/logs/${id}`, getAuthHeaders())
  return res.data
}



// ─────────────────────────────────────────
// CUSTOMERS CRUD FRTCH
// ─────────────────────────────────────────
export const adminGetCustomers = async (): Promise<CustomerData[]> => {
  const res = await axios.get(`${API_URL}/customers`, getAuthHeaders());
  return res.data
};
 
export const adminCreateCustomer = async (data: Partial<CustomerData>): Promise<CustomerData> => {
  const res = await axios.post(`${API_URL}/customers`, data, getAuthHeaders());
  return res.data
};
 
export const adminUpdateCustomer = async (id: number | string, data: Partial<CustomerData>): Promise<CustomerData> => {
  const res = await axios.patch(`${API_URL}/customers/${id}`, data, getAuthHeaders());
  return res.data
};
 
export const adminDeleteCustomer = async (id: number | string): Promise<{ message: string }> => {
  const res = await axios.delete(`${API_URL}/customers/${id}`, getAuthHeaders());
  return res.data
};
 
// ─────────────────────────────────────────
// PROJECTS CRUD FETCH
// ─────────────────────────────────────────
export const adminGetProjects = async (): Promise<ProjectData[]> => {
  const res = await axios.get(`${API_URL}/projects`, getAuthHeaders());
  return res.data.projects;
};
 
export const adminCreateProject = async (data: Partial<ProjectData>): Promise<ProjectData> => {
  const res = await axios.post(`${API_URL}/projects`, data, getAuthHeaders());
  return res.data.project;
};
 
export const adminUpdateProject = async (id: number | string, data: Partial<ProjectData>): Promise<ProjectData> => {
  const res = await axios.patch(`${API_URL}/projects/${id}`, data, getAuthHeaders());
  return res.data.project;
};
 
export const adminDeleteProject = async (id: number | string): Promise<{ message: string }> => {
  const res = await axios.delete(`${API_URL}/projects/${id}`, getAuthHeaders());
  return res.data;
};
 
// ─────────────────────────────────────────
// TASKS CRUD FETCH
// ─────────────────────────────────────────
export const adminGetTasks = async (): Promise<TaskData[]> => {
  const res = await axios.get(`${API_URL}/tasks`, getAuthHeaders());
  return res.data.tasks;
};
 
export const adminCreateTask = async (data: Partial<TaskData>): Promise<TaskData> => {
  const res = await axios.post(`${API_URL}/tasks`, data, getAuthHeaders());
  return res.data.task;
};
 
export const adminUpdateTask = async (id: number | string, data: Partial<TaskData>): Promise<TaskData> => {
  const res = await axios.patch(`${API_URL}/tasks/${id}`, data, getAuthHeaders());
  return res.data.task;
};
 
export const adminDeleteTask = async (id: number | string): Promise<{ message: string }> => {
  const res = await axios.delete(`${API_URL}/tasks/${id}`, getAuthHeaders());
  return res.data;
};
