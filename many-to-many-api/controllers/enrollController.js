import Enrollment from '../models/Enrollment.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';

export const enrollStudent = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        const student = await Student.findById(studentId);
        const course = await Course.findById(courseId);
        if (!student?.isActive || !course?.isActive) return res.status(400).json({ error: "Inactive student or course" });

        const enrollment = new Enrollment({ studentId, courseId });
        await enrollment.save();
        res.status(201).json(enrollment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};