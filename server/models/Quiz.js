const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String }], // array of 4 options
    correctAnswer: { type: Number, required: true }, // index 0-3
    explanation: { type: String },
});

const quizSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    questions: [questionSchema],
    passingScore: { type: Number, default: 60 }, // percentage
    timeLimit: { type: Number, default: 30 }, // minutes
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);