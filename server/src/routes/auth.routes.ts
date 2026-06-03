import { Router } from "express";
import { googleLoginHandler, loginHandler, registerHandler } from "../controllers/auth.controller";



const router = Router()

router.post('/google', googleLoginHandler)
router.post('/register', registerHandler)
router.post('/login', loginHandler)

export default router;