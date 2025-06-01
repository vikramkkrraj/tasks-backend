import express from 'express';
import { createCourse, deleteCourse, getCourseStudents } from '../controllers/courseController.js';
const router = express.Router();

router.post('/', createCourse);
router.delete('/:id', deleteCourse);
router.get('/:id/students', getCourseStudents);

export default router;