import { Router } from 'express';
import {
  getUserByIdHandler,
  getUsersHandler,
  updateUserHandler,
  deleteUserHandler,
  createUserHandler,
  updateProfileHandler,
} from '../controllers/user.controller';
import { adminOnly, authMiddleware } from '../middleware/auth.middleware';
import { uploadAvatar } from '../middleware/upload.middleware';

const router = Router();

// ── Rute cu path specific — ÎNTOTDEAUNA înaintea lui /:id ──────
router.patch('/profile/update', authMiddleware, uploadAvatar.single('avatar'), updateProfileHandler);

// ── Rute Admin ─────────────────────────────────────────────────
router.get('/', authMiddleware, getUsersHandler);
router.post('/', authMiddleware, adminOnly, createUserHandler);
router.patch('/:id', authMiddleware, adminOnly, updateUserHandler);
router.delete('/:id', authMiddleware, adminOnly, deleteUserHandler);

// ── Rute accesibile oricărui user logat ───────────────────────
router.get('/:id', authMiddleware, getUserByIdHandler);

export default router;