const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch {
        res.status(401).json({ message: 'Token invalid or expired' });
    }
};

exports.adminOnly = (req, res, next) => {
    if (req.user && req.user.role !== 'admin')
        return res.status(403).json({ message: 'Admin access only' });
    next();
};