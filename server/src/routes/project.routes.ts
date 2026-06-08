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

// ─────────────────────────────────────────
// pId => project ID
// uId => user ID
// ─────────────────────────────────────────


router.get('/', getAllProjectsHandler)
router.get('/:pId', getProjectByIdHandler)
router.post('/', createProjectHandler)
router.patch('/:pId', updateProjectHandler)
router.delete('/:pId', deleteProjectHandler)

router.post('/:pId/members', addProjectMemberHandler)
router.delete('/pId/members/:uId')