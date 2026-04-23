const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
    getStats,
    getAllUsers,
    deleteUser,
    updateUserRole,
    getAllCoursesAdmin,
    togglePublish,
    deleteCourseAdmin
} = require('../controllers/adminController');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);
router.get('/courses', getAllCoursesAdmin);
router.put('/courses/:id/toggle', togglePublish);
router.delete('/courses/:id', deleteCourseAdmin);

module.exports = router;