import { useEffect, useState } from 'react';
import socket from '../lib/socket';
import toast from 'react-hot-toast';
import type { Notification } from '../types/notification.types';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '../services/notification.service';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Fetch la mount folosind service-ul izolat
  useEffect(() => {
    getNotifications()
      .then(data => {
        setNotifications(data);
      })
      .catch(console.error);
  }, []);

  // Socket — notificări noi în timp real
  useEffect(() => {
    socket.on('notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      toast(notification.message, { icon: '🔔' });
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error("Eroare la marcarea notificării ca citită:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Eroare la marcarea tuturor notificărilor ca citite:", error);
    }
  };

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}