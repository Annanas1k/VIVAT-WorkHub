import { Router } from "express";
import { getUserByIdHandler, getUsersHandler, updateUserHandler, deleteUserHandler, createUserHandler,  updateRoleHandler, updateProfileHandler} from "../controllers/user.controller";
import { adminOnly, authMiddleware } from "../middleware/auth.middleware";
import { uploadAvatar } from "../middleware/upload.middleware";

const router = Router({mergeParams: true})

router.get('/', authMiddleware, getUsersHandler)
router.get('/:id', authMiddleware, getUserByIdHandler)
router.post('/', authMiddleware, createUserHandler)
router.patch('/:id', authMiddleware, updateUserHandler)
router.delete('/:id', authMiddleware, deleteUserHandler)

//casha facute de mine
router.patch('/:id/role', authMiddleware, adminOnly, updateRoleHandler)
router.patch('/update', authMiddleware, uploadAvatar.single('avatar'), updateProfileHandler)
export default router;