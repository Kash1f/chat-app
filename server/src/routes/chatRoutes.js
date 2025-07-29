import express from 'express';
import protectedRoute from "../middleware/auth.middleware.js";
import { getConversation } from '../controllers/chatController.js';

const router = express.Router();

router.get('/:receiverId', protectedRoute, getConversation);

export default router;