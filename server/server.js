const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://your-frontend.onrender.com'
    ],
    credentials: true
}));
// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error handler
app.use(require('./middleware/errorMiddleware'));

app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);