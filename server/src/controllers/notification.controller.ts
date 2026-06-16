import { RequestHandler } from 'express';
import prisma from '../config/prisma';

// GET /notifications
export const getAllNotifications: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json(notifications);
  } catch (err) {
    console.error('[getAllNotifications]', err);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

// PATCH /notifications/read-all
export const markAllAsRead: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.id;

    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('[markAllAsRead]', err);
    res.status(500).json({ message: 'Failed to mark all as read' });
  }
};

// PATCH /notifications/:id/read
export const markAsRead: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    const id = Number(req.params.id);

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    if (notification.userId !== userId) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('[markAsRead]', err);
    res.status(500).json({ message: 'Failed to mark as read' });
  }
};