const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

exports.register = async(req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: 'Please fill all fields' });
        const exists = await User.findOne({ email });
        if (exists)
            return res.status(400).json({ message: 'Email already registered' });
        const allowedRoles = ['student', 'instructor'];
        const userRole = allowedRoles.includes(role) ? role : 'student';
        const user = await User.create({ name, email, password, role: userRole });
        res.status(201).json({
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error('Register error:', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password)))
            return res.status(401).json({ message: 'Invalid credentials' });
        res.json({
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.getMe = async(req, res) => {
    try {
        res.json(req.user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.forgotPassword = async(req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: 'No user with that email' });
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save();
        res.json({ message: 'Reset email sent' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateProfile = async(req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id, { name, email }, { new: true }
        ).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.changePassword = async(req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);
        if (!(await user.matchPassword(currentPassword)))
            return res.status(400).json({ message: 'Current password is incorrect' });
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};