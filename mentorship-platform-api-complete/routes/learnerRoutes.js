import express from 'express';
import { createLearner, deleteLearner } from '../controllers/learnerController.js';

const router = express.Router();
router.post('/', createLearner);
router.delete('/:id', deleteLearner);

export default router;