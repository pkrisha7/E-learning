const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    lessonId: { type: mongoose.Schema.Types.ObjectId },
    completed: { type: Boolean, default: false },
    watchedAt: { type: Date },
});

const enrollmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: [progressSchema],
    completedAt: { type: Date },
    certificate: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);