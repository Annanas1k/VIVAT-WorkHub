// Structură fișier: src/services/notification.service.ts

import axios from 'axios';
import type { Notification } from '../types/notification.types';

const getAuthHeaders = () => {
  const token = localStorage.getItem('app_token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const API_URL = import.meta.env.VITE_API_URL;

// GET funcționează perfect pentru că config este al doilea parametru
export const getNotifications = async (): Promise<Notification[]> => {
  const res = await axios.get(`${API_URL}/notifications`, getAuthHeaders());
  return res.data;
};

// CORECTAT: Adăugat un body gol ({}) pe poziția a doua
export const markNotificationAsRead = async (id: number): Promise<void> => {
  await axios.patch(`${API_URL}/notifications/${id}/read`, {}, getAuthHeaders());
};

// CORECTAT: Adăugat un body gol ({}) pe poziția a doua
export const markAllNotificationsAsRead = async (): Promise<void> => {
  await axios.patch(`${API_URL}/notifications/read-all`, {}, getAuthHeaders());
};