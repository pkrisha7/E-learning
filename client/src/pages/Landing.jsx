import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const features = [
  { icon: '🎥', title: 'HD Video Lessons',     desc: 'Watch high quality lessons at your own pace, anytime anywhere.' },
  { icon: '📝', title: 'Quizzes & Assessments', desc: 'Test your knowledge with quizzes after every course.' },
  { icon: '🎓', title: 'Certificates',          desc: 'Earn verified certificates when you complete courses.' },
  { icon: '📱', title: 'Learn Anywhere',        desc: 'Access courses on any device — desktop, tablet, or mobile.' },
  { icon: '👨‍🏫', title: 'Expert Instructors',   desc: 'Learn from industry professionals with real experience.' },
  { icon: '♾️', title: 'Lifetime Access',       desc: 'Buy once, access forever. Learn at your own schedule.' },
];

const testimonials = [
  { name: 'Priya Sharma',   role: 'Web Developer',      text: 'Learnly helped me switch careers in just 6 months. The courses are practical and well-structured.',        avatar: 'P' },
  { name: 'Rahul Verma',    role: 'Data Scientist',     text: 'The quiz system really helped me retain what I learned. Best learning platform I have used.',              avatar: 'R' },
  { name: 'Anjali Mehta',   role: 'UX Designer',        text: 'I love how easy it is to track my progress on Learnly. Completed 4 courses already!',                      avatar: 'A' },
];

const stats = [
  { value: '10,000+', label: 'Active Students' },
  { value: '200+',    label: 'Curated Courses' },
  { value: '50+',     label: 'Top Instructors' },
  { value: '95%',     label: 'Satisfaction Rate' },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between z-50 transition-all">
        <Logo size="md" />

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link to="/courses" className="hover:text-sky-600 transition-colors">Courses</Link>
          <a href="#features" className="hover:text-sky-600 transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-sky-600 transition-colors">Reviews</a>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-sky-500/25 hover:scale-[1.02] transition-all">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors px-3 py-2">
                Login
              </Link>
              <Link to="/register" className="bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-sky-500/25 hover:scale-[1.02] transition-all">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-b from-sky-50/80 via-cyan-50/30 to-slate-50 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-400/20 to-cyan-300/20 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-sky-100/80 border border-sky-200/60 text-sky-700 px-4 py-2 rounded-full text-sm font-semibold mb-8 shadow-xs">
            <span>🚀</span> The #1 Next-Gen eLearning Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
            Learn Without{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-500 to-indigo-600">
              Limits
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
            Master real-world skills with expert-led courses, interactive quizzes, and a thriving global student community.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all">
              Start Learning Free →
            </Link>
            <Link to="/courses" className="bg-white text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all border border-slate-200/90 shadow-xs">
              Browse Courses
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
            {stats.map(s => (
              <div key={s.label} className="bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-slate-200/60 shadow-xs">
                <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">{s.value}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Everything you need to succeed</h2>
            <p className="text-slate-500 text-base md:text-lg">Designed for maximum engagement and skill retention</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(f => (
              <div key={f.title} className="bg-slate-50/80 rounded-2xl p-7 hover:bg-sky-50/50 hover:shadow-lg hover:shadow-sky-500/5 hover:-translate-y-1 transition-all duration-300 border border-slate-200/60 group">
                <div className="text-4xl mb-4 p-3 bg-white w-fit rounded-xl border border-slate-200/60 shadow-xs group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-sky-600 transition-colors">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Ready to unlock your potential?</h2>
          <p className="text-sky-200/80 text-lg mb-8 max-w-xl mx-auto">Join thousands of ambitious learners growing their skills on Learnly today.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/courses" className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105 transition-all">
              Browse All Courses
            </Link>
            <Link to="/register" className="bg-slate-800/80 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold transition-all border border-slate-700">
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">What our students say</h2>
            <p className="text-slate-500 text-base md:text-lg">Real impact from real learners</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-xs font-medium text-slate-400">{t.role}</p>
                  </div>
                </div>
                <div className="text-amber-400 text-sm mb-3">★★★★★</div>
                <p className="text-slate-600 text-sm leading-relaxed italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-14 px-6 border-t border-slate-800">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="mb-4">
              <Logo size="md" variant="dark" />
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              The modern learning platform designed to elevate your skills and career.
            </p>
          </div>
          {[
            { title: 'Learn',   links: ['All Courses', 'Categories', 'Free Courses'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers'] },
            { title: 'Support', links: ['Help Center', 'Contact', 'Privacy Policy'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white font-bold mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}><Link to="/courses" className="text-sm text-slate-400 hover:text-sky-400 transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-5xl mx-auto mt-12 pt-8 border-t border-slate-800/80 text-center text-xs font-medium text-slate-500">
          © 2026 Learnly. All rights reserved.
        </div>
      </footer>
    </div>
  );
}