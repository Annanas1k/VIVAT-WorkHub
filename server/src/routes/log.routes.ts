import { Router } from "express";
import { getAllLogsHandlers, getLogByIdHandler } from "../controllers/log.controller";
import { adminOnly, authMiddleware } from "../middleware/auth.middleware";


const router = Router()

router.use(authMiddleware, adminOnly)

router.get('/', getAllLogsHandlers)     // GET  /api/logs
router.get('/:id', getLogByIdHandler)   // GET  /api/logs/:id\

export default router