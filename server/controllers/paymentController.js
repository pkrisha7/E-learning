const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');

exports.createCheckoutSession = async(req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        if (course.isFree) {
            await Enrollment.create({ user: req.user._id, course: course._id });
            return res.json({ free: true });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: course.title, images: course.thumbnail ? [course.thumbnail] : [] },
                    unit_amount: Math.round(course.price * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/payment-success?courseId=${course._id}`,
            cancel_url: `${process.env.CLIENT_URL}/courses/${course._id}`,
            metadata: { courseId: course._id.toString(), userId: req.user._id.toString() },
        });

        await Payment.create({
            user: req.user._id,
            course: course._id,
            stripePaymentId: session.id,
            amount: course.price,
            status: 'pending'
        });

        res.json({ url: session.url });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.paymentSuccess = async(req, res) => {
    try {
        const { courseId } = req.query;
        const existing = await Enrollment.findOne({ user: req.user._id, course: courseId });
        if (!existing) {
            await Enrollment.create({ user: req.user._id, course: courseId });
            await Payment.findOneAndUpdate({ user: req.user._id, course: courseId }, { status: 'completed' });
            await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};