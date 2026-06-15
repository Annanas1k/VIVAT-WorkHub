import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { 
    getAllComments,
    createComment,
    updateComment,
    deleteComment
} from "../controllers/comment.controller";

const router = Router()

router.use(authMiddleware)

router.get('/:entityType/:entityId', getAllComments)        // GET      /api/comments/:entityType/:entityId
router.post('/:entityType/:entityId', createComment)       // POST     /api/comments/:entityType/:entityId
router.put('/:commentId', updateComment)                    // PUT      /api/comments/:commentId
router.delete('/:commentId', deleteComment)                 // DELETE   /api/comments/:commentId


export default router