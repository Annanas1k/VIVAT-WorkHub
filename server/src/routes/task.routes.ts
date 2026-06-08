import { Router } from "express";
import { 
    getAllTasksHandler,
    getTaskByIdHandler,
    createTaskHandler,
    updateTaskHandler,
    deleteTaskHandler,
    addTaskAssigneeHandler,
    removeTaskAssigneeHandler
} from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router()

router.use(authMiddleware)

router.get('/', getAllTasksHandler)                                 // GET       /api/tasks
router.get('/:id', getTaskByIdHandler)                              // GET       /api/tasks/:id
router.post('/', createTaskHandler)                                 // POST      /api/tasks
router.patch('/:id', updateTaskHandler)                             // PATCH     /api/tasks/:id
router.delete('/:id', deleteTaskHandler)                            // DELETE    /api/tasks/:id

router.post('/:id/assignees', addTaskAssigneeHandler)                 // POST     /api/tasks/:id/assignees
router.delete('/:id/assignees/:userId', removeTaskAssigneeHandler)    // DELETE   /api/tasks/:id/assignees/:userId

export default router