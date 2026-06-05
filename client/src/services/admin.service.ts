import axios from 'axios';
import type { UserData } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('app_token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

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