import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '🎥', title: 'HD Video Lessons',     desc: 'Watch high quality lessons at your own pace, anytime anywhere.' },
  { icon: '📝', title: 'Quizzes & Assessments', desc: 'Test your knowledge with quizzes after every course.' },
  { icon: '🎓', title: 'Certificates',          desc: 'Earn certificates when you complete courses.' },
  { icon: '📱', title: 'Learn Anywhere',        desc: 'Access courses on any device — desktop, tablet, or mobile.' },
  { icon: '👨‍🏫', title: 'Expert Instructors',   desc: 'Learn from industry professionals with real experience.' },
  { icon: '♾️', title: 'Lifetime Access',       desc: 'Buy once, access forever. Learn at your own schedule.' },
];

const testimonials = [
  { name: 'Priya Sharma',   role: 'Web Developer',      text: 'LearnHub helped me switch careers in just 6 months. The courses are practical and well-structured.',        avatar: 'P' },
  { name: 'Rahul Verma',    role: 'Data Scientist',     text: 'The quiz system really helped me retain what I learned. Best platform I have used.',                       avatar: 'R' },
  { name: 'Anjali Mehta',   role: 'UX Designer',        text: 'I love how easy it is to track my progress. Completed 4 courses already!',                                 avatar: 'A' },
];

const stats = [
  { value: '10,000+', label: 'Students' },
  { value: '200+',    label: 'Courses' },
  { value: '50+',     label: 'Instructors' },
  { value: '95%',     label: 'Satisfaction' },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">L</div>
          <span className="text-xl font-bold text-gray-900">LearnHub</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link to="/courses" className="hover:text-purple-600 transition">Courses</Link>
          <a href="#features" className="hover:text-purple-600 transition">Features</a>
          <a href="#testimonials" className="hover:text-purple-600 transition">Reviews</a>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login"    className="text-sm text-gray-600 hover:text-purple-600 transition">Login</Link>
              <Link to="/register" className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            🚀 The #1 platform for online learning
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Learn Without
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600"> Limits</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Master new skills with expert-led courses, hands-on quizzes, and a community of learners. Start free today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-purple-700 transition shadow-lg shadow-purple-200">
              Start Learning Free →
            </Link>
            <Link to="/courses" className="bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition border border-gray-200">
              Browse Courses
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-purple-600">{s.value}</div>
                <div className="text-sm text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
            <p className="text-gray-400 text-lg">A complete learning experience built for modern learners</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-gray-50 rounded-2xl p-6 hover:bg-purple-50 transition group">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to start learning?</h2>
          <p className="text-purple-200 text-lg mb-8">Join thousands of students already learning on LearnHub</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/courses" className="bg-white text-purple-700 px-8 py-4 rounded-2xl font-semibold hover:bg-purple-50 transition">
              Browse All Courses
            </Link>
            <Link to="/register" className="bg-purple-500 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-purple-400 transition border border-purple-400">
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What our students say</h2>
            <p className="text-gray-400 text-lg">Real results from real learners</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
                <div className="text-yellow-400 text-sm mb-3">★★★★★</div>
                <p className="text-gray-600 text-sm leading-relaxed">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">L</div>
              <span className="text-white font-bold">LearnHub</span>
            </div>
            <p className="text-sm leading-relaxed">The best platform to learn new skills and advance your career.</p>
          </div>
          {[
            { title: 'Learn',   links: ['All Courses', 'Categories', 'Free Courses'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers'] },
            { title: 'Support', links: ['Help Center', 'Contact', 'Privacy Policy'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold mb-3 text-sm">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l}><Link to="/courses" className="text-sm hover:text-white transition">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-5xl mx-auto mt-10 pt-8 border-t border-gray-800 text-center text-sm">
          © 2026 LearnHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}