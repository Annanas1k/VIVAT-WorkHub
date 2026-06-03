import { Router } from "express";
import { getUsersHandler, updateRoleHandler,  } from "../controllers/user.controller";
import { adminOnly, authMiddleware } from "../middleware/auth.middleware";

const router = Router({mergeParams: true})

router.get('/users', authMiddleware, getUsersHandler)
router.patch('/users/:id/role', authMiddleware, adminOnly, updateRoleHandler)

export default router;