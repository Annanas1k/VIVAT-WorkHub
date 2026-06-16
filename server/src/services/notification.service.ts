import prisma from '../config/prisma';
import { io } from '../app';
import { notification_type } from '@prisma/client';

interface CreateNotificationParams {
  userId: number;
  type: notification_type;
  title: string;
  message: string;
  entityType?: string;
  entityId?: number;
}

export async function createNotification(params: CreateNotificationParams) {
  const notification = await prisma.notification.create({
    data: params,
  });

  // dacă userul e online, primește instant
  io.to(`user_${params.userId}`).emit('notification', notification);

  return notification;
}