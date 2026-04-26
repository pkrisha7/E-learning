exports.markLessonComplete = async(req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        let enrollment = await Enrollment.findOne({ user: req.user._id, course: courseId });
        if (!enrollment) return res.status(404).json({ message: 'Not enrolled' });

        const existing = enrollment.progress.find(p => p.lessonId ? .toString() === lessonId);
        if (existing) {
            existing.completed = true;
            existing.watchedAt = new Date();
        } else {
            enrollment.progress.push({ lessonId, completed: true, watchedAt: new Date() });
        }

        // Check if all lessons completed
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