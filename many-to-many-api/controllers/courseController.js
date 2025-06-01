import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

export const createCourse = async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        await Course.findByIdAndUpdate(req.params.id, { isActive: false });
        await Enrollment.updateMany({ courseId: req.params.id }, { isActive: false });
        res.status(200).json({ message: "Course soft-deleted." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getCourseStudents = async (req, res) => {
    try {
        const students = await Enrollment.find({ courseId: req.params.id, isActive: true })
            .populate({ path: 'studentId', match: { isActive: true } });
        res.status(200).json(students.map(e => e.studentId).filter(Boolean));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};