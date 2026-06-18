import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getProgressForUser } from '../services/progressService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get(
  '/',
  authMiddleware,
  asyncHandler(async (req, res) => {
    res.json(await getProgressForUser(req.user.id));
  })
);

export default router;
