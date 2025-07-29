import express from 'express';
import protectedRoute from "../middleware/auth.middleware.js";
import  getUsersByRole  from '../controllers/userController.js';

const router = express.Router();

router.get('/:role', protectedRoute, getUsersByRole);

export default router;