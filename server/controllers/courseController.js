const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

exports.getAllCourses = async(req, res) => {
    const { category, level, search } = req.query;
    let filter = { isPublished: true };
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) filter.title = { $regex: search, $options: 'i' };
    const courses = await Course.find(filter).populate('instructor', 'name avatar');
    res.json(courses);
};

exports.getCourseById = async(req, res) => {
    const course = await Course.findById(req.params.id).populate('instructor', 'name avatar');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
};

exports.createCourse = async(req, res) => {
    const course = await Course.create({...req.body, instructor: req.user._id });
    res.status(201).json(course);
};

exports.updateCourse = async(req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
};

exports.deleteCourse = async(req, res) => {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
};

exports.enrollInCourse = async(req, res) => {
    const { courseId } = req.params;
    const existing = await Enrollment.findOne({ user: req.user._id, course: courseId });
    if (existing) return res.status(400).json({ message: 'Already enrolled' });
    const enrollment = await Enrollment.create({ user: req.user._id, course: courseId });
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });
    res.status(201).json(enrollment);
};

exports.getMyEnrollments = async(req, res) => {
    const enrollments = await Enrollment.find({ user: req.user._id })
        .populate('course', 'title thumbnail lessons instructor');
    res.json(enrollments);
};

exports.markLessonComplete = async(req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        let enrollment = await Enrollment.findOne({ user: req.user._id, course: courseId });
        if (!enrollment) return res.status(404).json({ message: 'Not enrolled' });

        const existing = enrollment.progress.find(p => p.lessonId && p.lessonId.toString() === lessonId);
        if (existing) {
            existing.completed = true;
            existing.watchedAt = new Date();
        } else {
            enrollment.progress.push({ lessonId, completed: true, watchedAt: new Date() });
        }

        const course = await Course.findById(courseId);
        if (course && enrollment.progress.filter(p => p.completed).length >= course.lessons.length) {
            enrollment.completedAt = new Date();
        }

        await enrollment.save();
        res.json(enrollment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};