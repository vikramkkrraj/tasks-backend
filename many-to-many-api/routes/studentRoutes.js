import express from 'express';
import { createStudent, deleteStudent, getStudentCourses } from '../controllers/studentController.js';
const router = express.Router();

router.post('/', createStudent);
router.delete('/:id', deleteStudent);
router.get('/:id/courses', getStudentCourses);

export default router;