import axios from 'axios';
import type { UserData } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL;

interface ProfileUpdateResponse {
  user: UserData;
  token: string;
}

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('app_token')}`,
});

export const getUsersService = async (): Promise<UserData[]> => {
  const res = await axios.get(`${API_URL}/users`, {
    headers: authHeader(),
  });
  return res.data.users;
};

// updateRoleService → acum folosește PATCH /:id (același endpoint de update)
export const updateRoleService = async (id: number | string, role: string): Promise<UserData> => {
  const res = await axios.patch(`${API_URL}/users/${id}`, { role }, {
    headers: authHeader(),
  });
  return res.data.user;
};

export const updateProfileService = async (formData: FormData): Promise<ProfileUpdateResponse> => {
  const res = await axios.patch(`${API_URL}/users/profile/update`, formData, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getUserByIdService = async (id: string | number): Promise<UserData> => {
  const res = await axios.get(`${API_URL}/users/${id}`, {
    headers: authHeader(),
  });
  return res.data;
};

// Funcții noi pentru CRUD admin — gata de folosit când ai nevoie
export const createUserService = async (data: Partial<UserData> & { password: string }): Promise<UserData> => {
  const res = await axios.post(`${API_URL}/users`, data, {
    headers: authHeader(),
  });
  return res.data.user;
};

export const updateUserService = async (id: number | string, data: Partial<UserData>): Promise<UserData> => {
  const res = await axios.patch(`${API_URL}/users/${id}`, data, {
    headers: authHeader(),
  });
  return res.data.user;
};

export const deleteUserService = async (id: number | string): Promise<{ message: string }> => {
  const res = await axios.delete(`${API_URL}/users/${id}`, {
    headers: authHeader(),
  });
  return res.data;
};