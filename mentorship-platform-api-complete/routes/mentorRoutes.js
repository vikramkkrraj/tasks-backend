import express from 'express';
import { createMentor, deleteMentor } from '../controllers/mentorController.js';

const router = express.Router();
router.post('/', createMentor);
router.delete('/:id', deleteMentor);

export default router;