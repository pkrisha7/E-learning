const router = require('express').Router();
const {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    getMyEnrollments
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllCourses);
router.get('/my-enrollments', protect, getMyEnrollments);
router.get('/:id', getCourseById);
router.post('/', protect, createCourse);
router.put('/:id', protect, updateCourse);
router.delete('/:id', protect, deleteCourse);
router.post('/:courseId/enroll', protect, enrollInCourse);
router.put('/:courseId/progress/:lessonId', protect, require('../controllers/courseController').markLessonComplete);
module.exports = router;