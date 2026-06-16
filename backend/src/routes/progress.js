import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getProgressForUser } from '../services/progressService.js';

const router = Router();

router.get('/', authMiddleware, (req, res) => {
  res.json(getProgressForUser(req.user.id));
});

export default router;
