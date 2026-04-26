const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { createCheckoutSession, paymentSuccess } = require('../controllers/paymentController');

router.post('/checkout/:courseId', protect, createCheckoutSession);
router.post('/success', protect, paymentSuccess);

module.exports = router;