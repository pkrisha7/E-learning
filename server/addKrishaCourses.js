const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const Quiz = require('./models/Quiz');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnly';

async function seedKrisha() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB...');

    // Find Krisha or create her instructor account
    let krisha = await User.findOne({ email: 'krisha@example.com' });
    if (!krisha) {
      krisha = await User.findOne({ name: /krisha/i });
    }

    if (!krisha) {
      krisha = await User.create({
        name: 'Krisha',
        email: 'krisha@example.com',
        password: 'password123',
        role: 'instructor',
      });
      console.log('Created Krisha instructor account.');
    } else {
      krisha.role = 'instructor';
      await krisha.save();
      console.log(`Updated user ${krisha.name} (${krisha.email}) to instructor role.`);
    }

    // Courses for Krisha
    const krishaCourses = [
      {
        title: 'Modern React 19 & Next.js 15 Masterclass',
        description: 'Build enterprise-grade full-stack web applications with React 19 Server Components, App Router, and Tailwind CSS.',
        category: 'Web Development',
        level: 'intermediate',
        price: 2499,
        isFree: false,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        isPublished: true,
        instructor: krisha._id,
        enrolledCount: 142,
        lessons: [
          {
            title: '1.1 Next.js 15 App Router & Server Components',
            videoUrl: 'https://www.youtube.com/watch?v=wm5gMKCO6gY',
            description: 'Understanding Server Actions, Layouts, and Streaming SSR.',
            freePreview: true,
          },
          {
            title: '1.2 API Routes & Database Integration with Prisma',
            videoUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
            description: 'Setting up PostgreSQL models, migrations, and ORM queries.',
            freePreview: false,
          },
        ],
        quiz: {
          title: 'React 19 & Next.js 15 Mastery Quiz',
          passingScore: 70,
          questions: [
            {
              questionText: 'What is the default rendering paradigm for components inside Next.js App Router?',
              options: ['Client Components', 'React Server Components', 'Static HTML', 'Service Worker'],
              correctAnswer: 1,
              explanation: 'In the Next.js App Router, components default to React Server Components (RSC).',
            },
          ],
        },
      },
      {
        title: 'Framer Motion & UI Animation Masterclass',
        description: 'Design dynamic 60fps micro-animations, page transitions, and interactive UI gestures in React.',
        category: 'Design',
        level: 'beginner',
        price: 1299,
        isFree: false,
        thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
        isPublished: true,
        instructor: krisha._id,
        enrolledCount: 89,
        lessons: [
          {
            title: '1.1 Framer Motion Basics: Animate & Keyframes',
            videoUrl: 'https://www.youtube.com/watch?v=znbCa4urrMI',
            description: 'Adding hover, tap, and layout animations to React components.',
            freePreview: true,
          },
        ],
        quiz: {
          title: 'UI Animation Quiz',
          passingScore: 60,
          questions: [
            {
              questionText: 'Which prop in Framer Motion triggers automatic spring transitions when layout changes?',
              options: ['layout', 'autoSpring', 'transitionId', 'flexAnimate'],
              correctAnswer: 0,
              explanation: 'Setting the layout prop enables automatic smooth layout animations.',
            },
          ],
        },
      },
    ];

    for (const cData of krishaCourses) {
      const { quiz: quizData, ...courseFields } = cData;

      // Delete existing course with same title if present
      await Course.deleteMany({ title: courseFields.title });

      const course = await Course.create(courseFields);

      if (quizData) {
        await Quiz.deleteMany({ course: course._id });
        await Quiz.create({
          ...quizData,
          course: course._id,
        });
      }
      console.log(`✓ Created course for Krisha: "${course.title}"`);
    }

    console.log('Done! Krisha now has authored courses on her instructor dashboard.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

seedKrisha();
