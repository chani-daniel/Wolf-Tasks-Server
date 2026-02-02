import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listProjects, createProject } from '../controllers/projects.controller.js';

const router = Router();
router.use(requireAuth);

router.get('/', listProjects);

router.post('/', createProject);

export default router;
