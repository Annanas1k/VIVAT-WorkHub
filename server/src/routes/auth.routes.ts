import { Router } from "express";
import { googleLoginHandler } from "../controllers/auth.controller";



const router = Router()

router.post('/google', googleLoginHandler)

export default router;