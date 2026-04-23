const router = require('express').Router();
const Quiz = require('../models/Quiz');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/course/:courseId', protect, async(req, res) => {
    const quiz = await Quiz.findOne({ course: req.params.courseId });
    if (!quiz) return res.status(404).json({ message: 'No quiz for this course' });
    res.json(quiz);
});

router.post('/', protect, adminOnly, async(req, res) => {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
});

router.put('/:id', protect, adminOnly, async(req, res) => {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(quiz);
});

router.delete('/:id', protect, adminOnly, async(req, res) => {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted' });
});

module.exports = router;