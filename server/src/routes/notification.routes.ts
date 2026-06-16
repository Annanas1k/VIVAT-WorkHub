import { Router } from 'express';
import {
  getAllNotifications,
  markAsRead,
  markAllAsRead,
} from '../controllers/notification.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware)

router.get('/', getAllNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);

export default router;