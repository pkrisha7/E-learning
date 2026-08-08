const User = require('../models/User');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');

exports.getStats = async(req, res) => {
    const [users, courses, enrollments, payments] = await Promise.all([
        User.countDocuments(),
        Course.countDocuments(),
        Enrollment.countDocuments(),
        Payment.find({ status: 'completed' }),
    ]);
    const revenue = payments.reduce((sum, p) => sum + p.amount, 0);
    res.json({ users, courses, enrollments, revenue });
};

exports.getAllUsers = async(req, res) => {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
};

exports.deleteUser = async(req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
};

exports.updateUserRole = async(req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
    res.json(user);
};

exports.getAllCoursesAdmin = async(req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'instructor') {
            filter.instructor = req.user._id;
        }
        const courses = await Course.find(filter).populate('instructor', 'name email').sort({ createdAt: -1 });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.togglePublish = async(req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        if (req.user.role === 'instructor' && course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        course.isPublished = !course.isPublished;
        await course.save();
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteCourseAdmin = async(req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        if (req.user.role === 'instructor' && course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};