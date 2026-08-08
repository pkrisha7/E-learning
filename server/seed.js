const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const Quiz = require('./models/Quiz');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnly';

const coursesData = [
  {
    title: 'Full-Stack Web Development Bootcamp',
    description: 'Learn modern HTML, CSS, JavaScript, React, and Node.js to build modern web applications from scratch.',
    category: 'Web Development',
    level: 'beginner',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    isPublished: true,
    lessons: [
      {
        title: '1.1 Introduction to Web Architecture & HTML5',
        videoUrl: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
        description: 'Understand how the web works, client-server models, and HTML5 semantic elements.',
        freePreview: true,
      },
      {
        title: '1.2 Modern CSS Grid & Flexbox Layouts',
        videoUrl: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
        description: 'Master responsive layouts, flex container alignment, and CSS grid templates.',
        freePreview: true,
      },
      {
        title: '1.3 JavaScript ES6+ Fundamentals & Async/Await',
        videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
        description: 'Learn arrow functions, destructuring, promises, fetch API, and async programming.',
        freePreview: false,
      },
      {
        title: '1.4 React Components & State Management',
        videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
        description: 'Build modular React UI components using useState and useEffect hooks.',
        freePreview: false,
      },
    ],
    quiz: {
      title: 'Web Development Core Fundamentals Quiz',
      passingScore: 70,
      questions: [
        {
          questionText: 'Which HTML tag is used for the largest top-level heading?',
          options: ['<h6>', '<heading>', '<h1>', '<head>'],
          correctAnswer: 2,
          explanation: '<h1> represents the primary, top-level heading in HTML5 document structure.',
        },
        {
          questionText: 'What CSS layout module is best suited for 1-dimensional horizontal or vertical item alignment?',
          options: ['CSS Grid', 'Flexbox', 'Float', 'Absolute Positioning'],
          correctAnswer: 1,
          explanation: 'Flexbox is designed specifically for 1-dimensional layout alignment.',
        },
        {
          questionText: 'Which JavaScript keyword declares a block-scoped variable that cannot be re-assigned?',
          options: ['var', 'let', 'const', 'static'],
          correctAnswer: 2,
          explanation: 'const creates a block-scoped constant variable.',
        },
      ],
    },
  },
  {
    title: 'Machine Learning & Python Masterclass',
    description: 'Master Python data analysis, NumPy, Pandas, Scikit-Learn, and Neural Networks for artificial intelligence.',
    category: 'Data Science',
    level: 'intermediate',
    price: 2999,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    isPublished: true,
    lessons: [
      {
        title: '1.1 Python Data Science Ecosystem & Jupyter',
        videoUrl: 'https://www.youtube.com/watch?v=HW29067qVWk',
        description: 'Setting up Anaconda, Jupyter Notebooks, and working with NumPy array math.',
        freePreview: true,
      },
      {
        title: '1.2 Data Wrangling with Pandas & Matplotlib',
        videoUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg',
        description: 'Cleaning datasets, filtering rows, handling missing data, and plotting charts.',
        freePreview: false,
      },
      {
        title: '1.3 Supervised Learning: Regression & Classification',
        videoUrl: 'https://www.youtube.com/watch?v=i_LwzRVP7bg',
        description: 'Building predictive algorithms using Scikit-Learn linear regression and decision trees.',
        freePreview: false,
      },
    ],
    quiz: {
      title: 'Machine Learning Fundamentals Quiz',
      passingScore: 60,
      questions: [
        {
          questionText: 'Which Python library is primary used for data manipulation and tabular dataframes?',
          options: ['NumPy', 'Pandas', 'Flask', 'Requests'],
          correctAnswer: 1,
          explanation: 'Pandas provides high-performance data structure DataFrames.',
        },
        {
          questionText: 'What type of machine learning task involves predicting continuous numerical values?',
          options: ['Classification', 'Clustering', 'Regression', 'Reinforcement Learning'],
          correctAnswer: 2,
          explanation: 'Regression algorithms predict continuous numeric quantities.',
        },
      ],
    },
  },
  {
    title: 'UI/UX Design Systems & Figma Essentials',
    description: 'Design beautiful, accessible user interfaces and interactive prototypes in Figma from wireframes to design tokens.',
    category: 'Design',
    level: 'beginner',
    price: 1999,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800',
    isPublished: true,
    lessons: [
      {
        title: '1.1 Principles of Visual Hierarchy & Typography',
        videoUrl: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
        description: 'Understanding visual weight, contrast, font pairings, and grid systems.',
        freePreview: true,
      },
      {
        title: '1.2 Figma Auto-Layout & Design Components',
        videoUrl: 'https://www.youtube.com/watch?v=FTl38Jmxl_4',
        description: 'Creating scalable UI component libraries with Auto-Layout variants.',
        freePreview: false,
      },
    ],
    quiz: {
      title: 'UI/UX Principles Quiz',
      passingScore: 70,
      questions: [
        {
          questionText: 'What is the recommended minimum contrast ratio for standard text under WCAG AA accessibility guidelines?',
          options: ['2:1', '3:1', '4.5:1', '7:1'],
          correctAnswer: 2,
          explanation: 'WCAG 2.1 AA requires a contrast ratio of at least 4.5:1 for normal text.',
        },
      ],
    },
  },
  {
    title: 'Digital Marketing & Growth Hacking Essentials',
    description: 'Discover SEO strategies, social media campaigns, Google Analytics 4, and conversion funnel optimization.',
    category: 'Marketing',
    level: 'beginner',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    isPublished: true,
    lessons: [
      {
        title: '1.1 Search Engine Optimization (SEO) Masterclass',
        videoUrl: 'https://www.youtube.com/watch?v=DvwS7cV9GmQ',
        description: 'Keyword research, technical on-page optimization, and backlink strategies.',
        freePreview: true,
      },
      {
        title: '1.2 Performance Ad Campaigns & Conversion Funnels',
        videoUrl: 'https://www.youtube.com/watch?v=nU-IIXBWlS4',
        description: 'Setting up Meta Ads, Google PPC campaigns, and analyzing conversion metrics.',
        freePreview: true,
      },
    ],
    quiz: {
      title: 'Digital Marketing Quiz',
      passingScore: 60,
      questions: [
        {
          questionText: 'What does CTR stand for in online digital advertising?',
          options: ['Cost To Return', 'Click-Through Rate', 'Customer Total Reach', 'Conversion Traffic Ratio'],
          correctAnswer: 1,
          explanation: 'CTR stands for Click-Through Rate (clicks divided by impressions).',
        },
      ],
    },
  },
  {
    title: 'Product Management & Agile Leadership',
    description: 'Learn product roadmap strategies, user story mapping, Agile Scrum frameworks, and data-driven prioritization.',
    category: 'Business',
    level: 'intermediate',
    price: 2499,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
    isPublished: true,
    lessons: [
      {
        title: '1.1 Product Strategy & Problem Discovery',
        videoUrl: 'https://www.youtube.com/watch?v=843s8G1Q984',
        description: 'Identifying user pain points, framing problem statements, and MVP validation.',
        freePreview: true,
      },
      {
        title: '1.2 Agile Scrum Methodology & Sprint Planning',
        videoUrl: 'https://www.youtube.com/watch?v=2Vt7Ik8Ublw',
        description: 'Running daily standups, backlog refinement, sprint planning, and retrospectives.',
        freePreview: false,
      },
    ],
    quiz: {
      title: 'Product Leadership Quiz',
      passingScore: 70,
      questions: [
        {
          questionText: 'What does MVP stand for in product development strategy?',
          options: ['Most Valuable Person', 'Minimum Viable Product', 'Maximum Volume Performance', 'Modular Vector Process'],
          correctAnswer: 1,
          explanation: 'MVP stands for Minimum Viable Product, a version with just enough features to validate ideas with early users.',
        },
      ],
    },
  },
  {
    title: 'Creative Photography & Visual Composition',
    description: 'Master manual camera controls, lighting setups, color grading, and Adobe Lightroom editing techniques.',
    category: 'Photography',
    level: 'advanced',
    price: 1499,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800',
    isPublished: true,
    lessons: [
      {
        title: '1.1 Exposure Triangle: ISO, Aperture & Shutter Speed',
        videoUrl: 'https://www.youtube.com/watch?v=V7z7BAZdt2M',
        description: 'Controlling depth of field, motion blur, and sensor sensitivity in manual mode.',
        freePreview: true,
      },
      {
        title: '1.2 Golden Ratio & Rule of Thirds Composition',
        videoUrl: 'https://www.youtube.com/watch?v=7ZVyNjKSr0M',
        description: 'Framing subjects, leading lines, and light reflection to create cinematic shots.',
        freePreview: false,
      },
    ],
    quiz: {
      title: 'Photography Composition Quiz',
      passingScore: 60,
      questions: [
        {
          questionText: 'Which camera setting controls the depth of field (amount of background blur)?',
          options: ['Shutter Speed', 'Aperture (f-stop)', 'ISO', 'White Balance'],
          correctAnswer: 1,
          explanation: 'Aperture (f-stop) controls how wide the lens opening is and directly affects depth of field.',
        },
      ],
    },
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Find or create instructor user
    let instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      instructor = await User.create({
        name: 'Sarah Connor',
        email: 'instructor@learnly.com',
        password: 'password123',
        role: 'instructor',
      });
      console.log('Created sample instructor account: instructor@learnly.com / password123');
    }

    // Find or create admin user
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.create({
        name: 'Alex Rivera (Admin)',
        email: 'admin@learnly.com',
        password: 'password123',
        role: 'admin',
      });
      console.log('Created sample admin account: admin@learnly.com / password123');
    }

    // Clear existing sample courses & quizzes to prevent duplicates
    await Course.deleteMany({});
    await Quiz.deleteMany({});

    console.log('Seeding courses...');
    for (const cData of coursesData) {
      const { quiz: quizData, ...courseFields } = cData;
      const course = await Course.create({
        ...courseFields,
        instructor: instructor._id,
        enrolledCount: Math.floor(Math.random() * 400) + 50,
      });

      if (quizData) {
        await Quiz.create({
          ...quizData,
          course: course._id,
        });
      }
      console.log(`✓ Seeded course: "${course.title}" (${course.category})`);
    }

    console.log('Successfully seeded database with 6 featured courses and quizzes!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
