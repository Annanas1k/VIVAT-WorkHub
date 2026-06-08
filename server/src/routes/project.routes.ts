import { Router } from 'express';
import { 
    getAllProjectsHandler,
    getProjectByIdHandler,
    createProjectHandler,
    updateProjectHandler,
    deleteProjectHandler,
    addProjectMemberHandler,
    removeProjectMemberHandler
} from '../controllers/project.controller';
import { authMiddleware } from '../middleware/auth.middleware';


const router = Router()

router.use(authMiddleware)

router.get('/', getAllProjectsHandler)                              // GET       /api/projects
router.get('/:id', getProjectByIdHandler)                           // GET       /api/projects/:id
router.post('/', createProjectHandler)                              // POST      /api/projects
router.patch('/:id', updateProjectHandler)                          // PATCH     /api/projects/:id
router.delete('/:id', deleteProjectHandler)                         // DELETE    /api/projects/:id

router.post('/:id/members', addProjectMemberHandler)                // POST     /api/projects/:id/members
router.delete('/:id/members/:userId', removeProjectMemberHandler)   // DELETE   /api/projects/:id/members/:userId

export default router