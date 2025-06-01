import Student from '../models/Student.js';
import Enrollment from '../models/Enrollment.js';

export const createStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        await Student.findByIdAndUpdate(req.params.id, { isActive: false });
        await Enrollment.updateMany({ studentId: req.params.id }, { isActive: false });
        res.status(200).json({ message: "Student soft-deleted." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getStudentCourses = async (req, res) => {
    try {
        const courses = await Enrollment.find({ studentId: req.params.id, isActive: true })
            .populate({ path: 'courseId', match: { isActive: true } });
        res.status(200).json(courses.map(e => e.courseId).filter(Boolean));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};