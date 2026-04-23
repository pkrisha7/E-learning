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
    const courses = await Course.find().populate('instructor', 'name email').sort({ createdAt: -1 });
    res.json(courses);
};

exports.togglePublish = async(req, res) => {
    const course = await Course.findById(req.params.id);
    course.isPublished = !course.isPublished;
    await course.save();
    res.json(course);
};

exports.deleteCourseAdmin = async(req, res) => {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
};