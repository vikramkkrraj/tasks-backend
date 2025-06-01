import express from 'express';
import { createSession, getRecentSessions } from '../controllers/sessionController.js';

const router = express.Router();
router.post('/', createSession);
router.get('/recent', getRecentSessions);

export default router;