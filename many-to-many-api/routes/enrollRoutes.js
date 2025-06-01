import express from 'express';
import { enrollStudent } from '../controllers/enrollController.js';
const router = express.Router();

router.post('/', enrollStudent);

export default router;