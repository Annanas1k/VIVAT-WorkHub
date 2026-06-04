import { Router } from "express";
import { getUserByIdHandler, getUsersHandler, updateProfileHandler, updateRoleHandler,  } from "../controllers/user.controller";
import { adminOnly, authMiddleware } from "../middleware/auth.middleware";
import { uploadAvatar } from "../middleware/upload.middleware";

const router = Router({mergeParams: true})

router.get('/', authMiddleware, getUsersHandler)
router.patch('/:id/role', authMiddleware, adminOnly, updateRoleHandler)
router.patch('/profile/update', authMiddleware, uploadAvatar.single('avatar'), updateProfileHandler)
router.get('/profile/:id', authMiddleware, getUserByIdHandler)
export default router;