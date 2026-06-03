import axios from 'axios';
import type { UserData } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL;

export const getUsersService = async (): Promise<UserData[]> => {
  const token = localStorage.getItem('app_token');
  const res = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.users;
};

export const updateRoleService = async (id: number | string, role: string): Promise<UserData> => {
  const token = localStorage.getItem('app_token');
  const res = await axios.patch(`${API_URL}/users/${id}/role`, { role }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.user;
};